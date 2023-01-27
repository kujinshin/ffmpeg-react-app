import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const FEATURE_TYPES = ['Boomerang', 'Thumbnail'];

const RESOLUTIONS = [720, 480, 360, 240];

export const TestBenchForm = ({ fileData, onSubmit, disabled }) => {
  const videoRef = useRef();
  const { register, handleSubmit, setValue, watch, formState } = useForm();
  const [selectedFeature, setSelectedFeature] = useState('Boomerang');

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'feature') {
        setSelectedFeature(value.feature);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);


  useEffect(() => videoRef.current?.load(), [fileData.src]);

  const submitHandler = (formData) => {

    if(selectedFeature === "Thumbnail") {
      const thumbnailTimestamp = videoRef.current.currentTime;
      formData.thumbnailTimestamp = thumbnailTimestamp;
    }
  
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <div className='form-control'>
        <label>Feature</label>
        <select {...register('feature')} defaultValue='Boomerang'>
          {FEATURE_TYPES.map(types => (
            <option key={types} value={types}>
              {types}
            </option>
          ))}
        </select>
      </div>

      <div className='form-control'>
        <label>Target Height</label>
        <select {...register('targetHeight', { valueAsNumber: true })}>
          {RESOLUTIONS.filter(elem => elem <= fileData.width).map(resolution => (
            <option key={resolution} value={resolution}>
              {resolution}
            </option>
          ))}
        </select>
      </div>

      {selectedFeature === 'Boomerang' && (
        <>
          <div className='form-control'>
            <label>Start time (s)</label>
            <input
              type='number'
              min={0}
              max={fileData.duration}
              defaultValue={0}
              {...register('startTime', { valueAsNumber: true })}
            />
          </div>

          <div className='form-control'>
            <label>Duration</label>
            <input
              type='number'
              min={1}
              max={fileData.duration}
              defaultValue={1}
              {...register('duration', { valueAsNumber: true })}
            />
          </div>

          <div className='form-control'>
            <label>Loop Count</label>
            <input
              type='number'
              min={1}
              max={100}
              defaultValue={1}
              {...register('loopCount', { valueAsNumber: true })}
            />
          </div>
        </>
      )}
      {selectedFeature === 'Thumbnail' && <>
        <h3>Select Thumbnail timestamp</h3>
        <video ref={videoRef} controls style={{width: '100%', height: '100%'}}>
          <source src={fileData.src} />
        </video>
        {/* <input type='number' {...register('thumbnailTimestamp')} /> */}
      </>}

      <div className='form-control'>
        <input type='submit' disabled={disabled} />
      </div>
    </form>
  );
};
