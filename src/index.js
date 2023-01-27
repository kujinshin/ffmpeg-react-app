import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { WasmProvider } from './context/WasmContext';
import { BrowserRouter, NavLink, Route, Router, Switch } from 'react-router-dom';
import Boomerang from './pages/Boomerang';
import Thumbnail from './pages/Thumbnail';
import { TestBench } from './pages/TestBench';

ReactDOM.render(
  <React.StrictMode>
    <WasmProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', gap: '1rem'}}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/boomerang">Boomerang</NavLink>
          <NavLink to="/thumbnail">Thumbnail</NavLink>
          <NavLink to="/test-bench">Test Bench</NavLink>
        </div>
        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          <Route path="/boomerang" exact>
            <Boomerang />
          </Route>
          <Route path="/thumbnail" exact>
            <Thumbnail />
          </Route>
          <Route path="/test-bench" exact>
            <TestBench />
          </Route>
        </Switch>
      </BrowserRouter>
    </WasmProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
