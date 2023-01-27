import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

function Boomerang() {
  const [message, setMessage] = useState('Click Start to transcode');
  const [videoSrc, setVideoSrc] = useState('');
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const doTranscode = async () => {
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'test.avi', await fetchFile('/flame.avi'));
    await ffmpeg.run(
      '-i', 'test.avi', 
      '-filter_complex', '[0]trim=duration=1[t];[t]scale=-1:480[s];[s]split[s1][s2];[s1]reverse[r];[s2][r]concat=n=2[out]',
      '-map', '[out]',
      'test.mp4'
      );
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };
  return (
    <div className="App">
      <p/>
      <video src={videoSrc} autoPlay loop></video><br/>

      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default Boomerang;
