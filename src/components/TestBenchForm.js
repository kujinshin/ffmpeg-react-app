import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const FEATURE_TYPES = ['Boomerang', 'Thumbnail'];

const RESOLUTIONS = [720, 480, 360, 240];

export const TestBenchForm = ({ fileData, onSubmit, disabled }) => {
  const { register, handleSubmit, setValue, watch } = useForm();
  const [selectedFeature, setSelectedFeature] = useState('Boomerang');

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'feature') {
        setSelectedFeature(value.feature);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
      <div className='form-control'>
        <input type='submit' disabled={disabled} />
      </div>
    </form>
  );
};
