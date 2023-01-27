import { fetchFile } from '@ffmpeg/ffmpeg';

const getFFMpegTimestampFromSeconds = seconds => {
  const date = new Date(null);
  date.setMilliseconds(seconds * 1000);
  return date.toISOString().slice(11, 23);
};

// forces silent audio, we can think of a better way to deal with optional audio streams when it's not hack day
const createLoopConcatCommand = (loopCount, filename) => {
  let inputs = [];
  let streams = [];
  for (let i = 0; i < loopCount; i++) {
    inputs.push(`-i`);
    inputs.push(filename);
    streams.push([`[${i}:v]`]);
  }
  const streamsString = `${streams.join(' ')} concat=n=${loopCount}:v=1 [v]`;
  return [...inputs, '-an', '-filter_complex', streamsString, '-map', `[v]`];
};

export const ExecuteBoomerangCommand = async ({
  videoMetadata,
  ffmpeg,
  targetHeight = 480,
  startTime = 0,
  duration = 1,
  loopCount = 1
}) => {
  let filenameParts = videoMetadata.name.split('.');

  const intermediaryFileName = `${filenameParts.slice(0, filenameParts.length - 1).join('.')}-intermediary.${
    filenameParts[filenameParts.length - 1]
  }`;
  const OUTPUT_FILE_NAME = `out_${videoMetadata.name}`;

  ffmpeg.FS('writeFile', videoMetadata.name, await fetchFile(videoMetadata.src));

  await ffmpeg.run(
    '-ss',
    getFFMpegTimestampFromSeconds(startTime),
    '-to',
    getFFMpegTimestampFromSeconds(startTime + duration),
    '-i',
    videoMetadata.name,
    '-filter_complex',
    `[0]scale=-2:${targetHeight},setsar=1:1[s];[s]split[s1][s2];[s1]reverse[r];[s2][r]concat=n=2[out]`,
    '-map',
    '[out]',
    loopCount > 1 ? intermediaryFileName : OUTPUT_FILE_NAME
  );
  if(loopCount > 1) {
    await ffmpeg.run(...createLoopConcatCommand(loopCount, intermediaryFileName), OUTPUT_FILE_NAME);
  }

  const data = ffmpeg.FS('readFile', OUTPUT_FILE_NAME);

  return URL.createObjectURL(new Blob([data.buffer], { type: videoMetadata.type }));
};

export const ExecuteTrimCommand = async ({ videoMetadata, ffmpeg, trimStartTime, trimEndTime }) => {
  const OUTPUT_FILE_NAME = `out_${videoMetadata.name}`;
  ffmpeg.FS('writeFile', videoMetadata.name, await fetchFile(videoMetadata.src));
  await ffmpeg.run(
    '-ss',
    getFFMpegTimestampFromSeconds(trimStartTime),
    '-to',
    getFFMpegTimestampFromSeconds(trimEndTime),
    '-i',
    videoMetadata.name,
    '-c',
    'copy',
    OUTPUT_FILE_NAME
  );

  const data = ffmpeg.FS('readFile', OUTPUT_FILE_NAME);

  return URL.createObjectURL(new Blob([data.buffer], { type: videoMetadata.type }));
};

export const GenerateOneThumbnail = async ({ videoMetadata, ffmpeg, thumbnailTimestamp }) => {
  const screenshotTimestamp = getFFMpegTimestampFromSeconds(thumbnailTimestamp);
  ffmpeg.FS('writeFile', 'screenshot-temp.mp4', await fetchFile(videoMetadata.src));
  await ffmpeg.run(
    '-ss',
    screenshotTimestamp,
    '-i',
    'screenshot-temp.mp4',
    '-vf',
    'select=eq(n\\,0)',
    '-f',
    'image2',
    'screenshot.jpg'
  );
  const data = ffmpeg.FS('readFile', 'screenshot.jpg');
  return URL.createObjectURL(new Blob([data.buffer]), { type: 'image/jpg'});
};
