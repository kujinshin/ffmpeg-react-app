import React, { useState } from 'react';

const FEATURE_TYPES = {
    'BOOMERANG': 'BOOMERANG' 
}

export const TestBenchForm = ({
    fileData
}) => {

    const [formValue, setFormValue] = useState({
        duration: 0
    })

    const handleFormChange = (key, e) => setFormValue((prev) => ({...prev, [key]: e.target.value}));

    const onSubmit = () => console.log(formValue);

    return (
        /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
        <form onSubmit={onSubmit} >
            <input type="range" min={0} max={fileData.duration} value={formValue['duration']} onChange={(e) => handleFormChange('duration', e)} />
            <input type="number" min={0} max={fileData.duration} value={formValue['duration']} onChange={(e) => handleFormChange('duration', e)} />
            <input type="submit" />
        </form>
    );
}