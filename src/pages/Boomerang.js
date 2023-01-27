import React, { useContext, useState } from 'react';
import { fetchFile } from '@ffmpeg/ffmpeg';
import { WasmContext } from '../context/WasmContext';

function Boomerang() {
  const {ffmpeg, isLoaded} = useContext(WasmContext);

  const [message, setMessage] = useState('Click Start to transcode');
  const [videoSrc, setVideoSrc] = useState('');

  const doTranscode = async () => {
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
      <button disabled={!isLoaded} onClick={doTranscode}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default Boomerang;
