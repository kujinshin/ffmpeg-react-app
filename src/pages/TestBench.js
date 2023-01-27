import React, { useEffect, useContext, useState } from 'react';
import { TestBenchForm } from '../components/TestBenchForm';
import { UploadVideoFileInput } from '../components/UploadVideoFileInput';
import { WasmContext } from '../context/WasmContext';
import { ExecuteBoomerangCommand, ExecuteTrimCommand, GenerateOneThumbnail } from '../service/ffmpegUtils';
import { Timeline } from '../components/Timeline';

const FEATURE_OPTIONS = ['Boomerang', 'Thumbnail', 'Trimming'];

export const TestBench = () => {
  const { ffmpeg, isLoaded } = useContext(WasmContext);
  const [videoMetadata, setVideoMetadata] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState('');
  const [outputSrc, setOutputSrc] = useState();
  const [outputTime, setOutputTime] = useState(0);

  const handleFileLoaded = fileData => {
    console.log(fileData);
    setVideoMetadata(fileData);
  };

  const onFormSubmit = async formData => {
    setOutputSrc(null);
    const start = performance.now();
    const { feature } = formData;
    setSelectedFeature(feature);

    let outputSrc;
    if (feature === 'Boomerang') {
      outputSrc = await ExecuteBoomerangCommand({
        videoMetadata,
        ffmpeg,
        ...formData
      });
    } else if(feature === 'Thumbnail') {
      outputSrc = await GenerateOneThumbnail({
        videoMetadata,
        ffmpeg,
        ...formData
      })
    } else if(feature === 'Trim') {
      outputSrc = await ExecuteTrimCommand({
        videoMetadata,
        ffmpeg,
        ...formData
      });
    } else {
      throw new Error(`unimplemented feature ${feature}`);
    }

    const stop = performance.now();

    const inSeconds = (stop - start) / 1000;
    const rounded = Number(inSeconds).toFixed(3);
    setOutputTime(rounded);
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
        {videoMetadata && <TestBenchForm fileData={videoMetadata} onSubmit={onFormSubmit} />}
      </div>
      <div>
        {outputSrc && (
          <div style={{ paddingTop: '1rem' }}>
            <a target='_blank' href={outputSrc}>
              Link
            </a>
            <div style={{ display: 'block' }}>
              <span>Generated in {outputTime}s</span>
            </div>
            {
              selectedFeature === 'Thumbnail' && <img src={outputSrc} alt='thumbnail' style={{width: '100%', height: '100%'}} />
            }
          </div>
        )}
      </div>
    </div>
  );
};
