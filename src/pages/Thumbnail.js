import React, { useEffect, useRef, useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const getFFMpegTimestampFromSeconds = seconds => {
  const date = new Date(null);
  date.setMilliseconds(seconds * 1000);
  return date.toISOString().slice(11, 23);
};

function Thumbnail() {
  const videoRef = useRef();
  const [videoSrc, setVideoSrc] = useState('');
  const [thumbnailSrc, setThumbnailSrc] = useState('');

  useEffect(() => videoRef.current?.load(), [videoSrc]);

  const [message, setMessage] = useState('Click Start to transcode');
  const ffmpeg = createFFmpeg({
    log: true
  });
  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'test.avi', await fetchFile('/flame.avi'));
    await ffmpeg.run('-i', 'test.avi', 'test.mp4');
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };

  const doGenerateThumbnail = async () => {
    await ffmpeg.load();
    const screenshotTimestamp = getFFMpegTimestampFromSeconds(videoRef.current.currentTime);
    console.log(videoSrc);
    ffmpeg.FS('writeFile', 'screenshot-temp.mp4', await fetchFile(videoSrc));
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
    setThumbnailSrc(URL.createObjectURL(new Blob([data.buffer])));
  };

  return (
    <div className='App'>
      <p />
      <video ref={videoRef} controls>
        <source src={videoSrc} />
      </video>
      <br />
      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
      <br />
      <button onClick={doGenerateThumbnail}>Thumbnail</button>
      <br />
      <img src={thumbnailSrc} alt='thumbnail' />
    </div>
  );
}

export default Thumbnail;
