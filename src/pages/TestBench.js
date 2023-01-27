import React, { useState } from 'react';
import { UploadVideoFileInput } from "../components/UploadVideoFileInput"

export const TestBench = () => {
    const [videoMetadata, setVideoMetadata] = useState();

    const handleFileLoaded = (fileData) => {
        setVideoMetadata(fileData);
    }

    return (
        <div>
            <UploadVideoFileInput  onFileLoaded={handleFileLoaded} />
            {JSON.stringify(videoMetadata)}
        </div>
    )
}