import React, { useEffect, useContext, useState } from 'react';
import { TestBenchForm } from '../components/TestBenchForm';
import { UploadVideoFileInput } from '../components/UploadVideoFileInput';
import { WasmContext } from '../context/WasmContext';
import {
  ExecuteBoomerangCommand,
  ExecuteTrimCommand
} from '../service/ffmpegUtils';
import { Timeline } from '../components/Timeline';

const FEATURE_OPTIONS = ['Boomerang', 'Thumbnail', 'Trimming'];

export const TestBench = () => {
  const { ffmpeg, isLoaded } = useContext(WasmContext);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [outputSrc, setOutputSrc] = useState();

  const [commandOptions, setCommandOptions] = useState();

  const handleFileLoaded = fileData => {
    console.log(fileData);
    setVideoMetadata(fileData);
  };

  const onFormSubmit = async (formData) => {
    setOutputSrc(null);
    const outputSrc = await ExecuteBoomerangCommand({
      videoMetadata,
      ffmpeg,
      ...formData
    });
    setOutputSrc(outputSrc);

    // Example of running the Trim command
    //const outputSrc = await ExecuteTrimCommand({
    //  videoMetadata,
    //  ffmpeg,
    //  startTime: 1,
    //  endTime: 3
    //});
    //setOutputSrc(outputSrc);
  };

  return (
    <div style={{ width: '50vw', margin: 'auto' }}>
      <div>
        <UploadVideoFileInput onFileLoaded={handleFileLoaded} />
      </div>
      <Timeline videoMetadata={videoMetadata} />
      <div id='feature-select' style={{ paddingTop: '1rem' }}>
        {videoMetadata && (
          <TestBenchForm 
            fileData={videoMetadata} 
            onSubmit={onFormSubmit}
          /> 
        )}
      </div>
      <div>
        {outputSrc && (
          <a target="_blank" href={outputSrc}>Link</a>
          // <video
          //   src={outputSrc}
          //   autoPlay
          //   loop
          //   // style={{ width: '100%', height: '100%' }}
          // />
        )}
      </div>
    </div>
  );
};
