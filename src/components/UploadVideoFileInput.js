import React, { useEffect, useState } from 'react';

export const UploadVideoFileInput = ({
    onFileLoaded
}) => {
    const [videoFile, setVideoFile] = useState();
    const [videoSrc, setVideoSrc] = useState();


    useEffect(() => {
        if (videoFile) {
            readFile(videoFile).then((data) => {
                setVideoSrc(data);
            })
            .catch((err) => console.error('something went wrong', err))
        }
    }, [videoFile])

    const handleOnChange = (e) => {
        const file = e.target.files[0];
        console.log(file);
        setVideoFile(file);
    }

    const handleLoadedMetadata = (e) => {
        const el = e.target; 
        onFileLoaded({
            name: videoFile.name,
            size: videoFile.size,
            type: videoFile.type,
            duration: el.duration,
            width: el.videoWidth,
            height: el.videoHeight
        })
    }

    return (
        <div style={{display: 'column', gap: 4, justifyContent: 'center'}}>
            <input
                type='file'
                onChange={handleOnChange}
            />
            <video
                height={360}
                src={videoSrc}
                controls
                onLoadedMetadata={handleLoadedMetadata}
            />
        </div>
    )
}

async function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        }

        reader.onerror = reject;

        reader.readAsDataURL(file);
    })
}