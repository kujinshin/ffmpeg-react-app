import { fetchFile } from '@ffmpeg/ffmpeg';

const getFFMpegTimestampFromSeconds = seconds => {
  const date = new Date(null);
  date.setMilliseconds(seconds * 1000);
  return date.toISOString().slice(11, 23);
};

export const ExecuteBoomerangCommand = async ({
  videoMetadata,
  ffmpeg,
  targetHeight = 480,
  startTime = 0,
  duration = 1,
  loopCount = 1
}) => {
  ffmpeg.FS(
    'writeFile',
    videoMetadata.name,
    await fetchFile(videoMetadata.src)
  );
  const OUTPUT_FILE_NAME = `out_${videoMetadata.name}`;

  await ffmpeg.run(
    '-ss',
    getFFMpegTimestampFromSeconds(startTime),
    '-to',
    getFFMpegTimestampFromSeconds(startTime + duration),
    '-i',
    videoMetadata.name,
    '-filter_complex',
    `[0]scale=-2:${targetHeight},setsar=1:1[s];[s]split[s1][s2];[s1]reverse[r];[s2][r]concat=n=2[out];`,
    '-map',
    '[out]',
    OUTPUT_FILE_NAME
  );

  const data = ffmpeg.FS('readFile', OUTPUT_FILE_NAME);

  return URL.createObjectURL(
    new Blob([data.buffer], { type: videoMetadata.type })
  );
};

export const ExecuteTrimCommand = async ({
  videoMetadata,
  ffmpeg,
  startTime,
  endTime
}) => {
  const OUTPUT_FILE_NAME = `out_${videoMetadata.name}`;
  ffmpeg.FS(
    'writeFile',
    videoMetadata.name,
    await fetchFile(videoMetadata.src)
  );
  await ffmpeg.run(
    '-ss',
    getFFMpegTimestampFromSeconds(startTime),
    '-to',
    getFFMpegTimestampFromSeconds(endTime),
    '-i',
    videoMetadata.name,
    '-c',
    'copy',
    OUTPUT_FILE_NAME
  );

  const data = ffmpeg.FS('readFile', OUTPUT_FILE_NAME);

  return URL.createObjectURL(
    new Blob([data.buffer], { type: videoMetadata.type })
  );
};
