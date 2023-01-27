import React, { useContext, useEffect, useState } from 'react';
import { fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';
import { WasmContext } from './context/WasmContext';

function App() {
  const {ffmpeg, isLoaded} = useContext(WasmContext)

  const [videoSrc, setVideoSrc] = useState('');
  const [message, setMessage] = useState('Click Start to transcode');

  useEffect(() => {
    if(isLoaded) {
      console.log('ffmpeg ready')
    } else {
      console.log('loading..')
    }
  }, [ffmpeg, isLoaded])
  
  const doTranscode = async () => {
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'test.avi', await fetchFile('/flame.avi'));
    await ffmpeg.run('-i', 'test.avi', 'test.mp4');
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'test.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };
  return (
    <div className="App">
      <p/>
      <video src={videoSrc} controls onLoadedMetadata={(e) => console.log(e.target.duration)}></video><br/>
      <button disabled={!isLoaded} onClick={doTranscode}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
