import React, { useContext, useState } from 'react';
import { TestBenchForm } from '../components/TestBenchForm';
import { UploadVideoFileInput } from "../components/UploadVideoFileInput";
import { WasmContext } from '../context/WasmContext';
import { ExecuteBoomerangCommand } from '../service/ffmpegUtils';

const FEATURE_OPTIONS = [
    'Boomerang',
    'Thumbnail',
    'Trimming'
]

export const TestBench = () => {
    const {ffmpeg, isLoaded} = useContext(WasmContext);
    const [videoMetadata, setVideoMetadata] = useState();
    const [selectedFeature, setSelectedFeature] = useState('');
    const [outputSrc, setOutputSrc] = useState();

    const handleFileLoaded = (fileData) => {
        console.log(fileData);
        setVideoMetadata(fileData);
    }

    const handleTranscode = async () => {
        const outputSrc = await ExecuteBoomerangCommand({
            videoMetadata,
            ffmpeg,
            targetHeight: 360,
            startTime: 4,
            duration: 1,
        });

        setOutputSrc(outputSrc);
    }

    return (
        <div style={{width: '50vw', margin: 'auto'}}>
            <div>
                <UploadVideoFileInput  onFileLoaded={handleFileLoaded} />
            </div>
            <div id="feature-select" style={{paddingTop: '1rem'}}>
                <select value={selectedFeature} onChange={(e) => setSelectedFeature(e.target.value)}>
                    {FEATURE_OPTIONS.map((elem) => (
                        <option key={elem} value={elem}>
                            {elem}
                        </option>
                    ))}
                </select>
                
                <button disabled={!isLoaded} onClick={handleTranscode}>
                    Start
                </button>            
            </div>
            <div>
                
                {outputSrc && (
                    <video src={outputSrc} autoPlay loop style={{width: '100%', height: '100%'}} />
                )}
            </div>
        </div>
    )
}