import { fetchFile } from '@ffmpeg/ffmpeg';

const getFFMpegTimestampFromSeconds = seconds => {
  const date = new Date(null);
  date.setMilliseconds(seconds * 1000);
  return date.toISOString().slice(11, 23);
};

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
  console.log(videoMetadata);
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
    intermediaryFileName
  );
  await ffmpeg.run(...createLoopConcatCommand(loopCount, intermediaryFileName), OUTPUT_FILE_NAME);
  //await ffmpeg.run('-stream_loop', loopCount, '-i', intermediaryFileName, '-c', 'copy', OUTPUT_FILE_NAME);

  const data = ffmpeg.FS('readFile', OUTPUT_FILE_NAME);

  return URL.createObjectURL(new Blob([data.buffer], { type: videoMetadata.type }));
};
