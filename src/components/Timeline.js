import React, { useEffect, useState, useContext } from 'react';
import { WasmContext } from '../context/WasmContext';
import { fetchFile } from '@ffmpeg/ffmpeg';

export const Timeline = ({ videoMetadata }) => {
  const [thumbnails, setThumbnails] = useState([]);
  const { ffmpeg, isLoaded } = useContext(WasmContext);

  useEffect(() => {
    if (isLoaded && videoMetadata) {
      getThumbnails(ffmpeg, videoMetadata).then(thumbs => {
        setThumbnails(thumbs);
      });
    }
  }, [videoMetadata, isLoaded, ffmpeg]);

  return (
    <div style={{
      display: 'flex', overflow: 'scroll',
      padding: '1rem 0px'
    }}>
      {thumbnails.map((imgURL, id) => (
        <img
          width={100}
          src={imgURL}
          alt={`sample_video_thumbnail_${id}`}
          key={id}
        />
      ))}
    </div>
  );
};

const getThumbnails = async (ffmpeg, videoMetadata) => {
  const MAX_NUM_IMAGES = 15;
  const duration = videoMetadata.duration;
  const N =
    Math.floor(duration) < MAX_NUM_IMAGES
      ? Math.floor(duration)
      : MAX_NUM_IMAGES;
  const arrayOfImageURIs = [];
  ffmpeg.FS(
    'writeFile',
    videoMetadata.name,
    await fetchFile(videoMetadata.src)
  );
  await ffmpeg.run(
    '-i',
    videoMetadata.name,
    '-vf',
    `fps=fps=${N}/${Math.floor(duration)}`,
    `img%02d.jpg`
  );
  for (let i = 0; i < N; i++) {
    const fileName = 'img' + ('00' + (i + 1)).substr(-2) + '.jpg';
    const data = ffmpeg.FS('readFile', fileName);
    const blob = new Blob([data.buffer], { type: 'image/jpg' });
    const dataURI = await readFile(blob);
    ffmpeg.FS('unlink', fileName);
    arrayOfImageURIs.push(dataURI);
  }

  return arrayOfImageURIs;
};

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
