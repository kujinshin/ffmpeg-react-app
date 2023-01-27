import React, { useState } from 'react';

import { Routes, Route } from 'react-router-dom';

import Transcode from './pages/transcode';
import Trim from './pages/trim';

function App() {
  return (
    <Routes>
      <Route exact path='/' element={<Transcode />}></Route>
      <Route exact path='/trim' element={<Trim />}></Route>
    </Routes>
  );
}

export default App;
