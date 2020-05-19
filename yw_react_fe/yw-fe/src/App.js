import React from 'react';
import './App.css';

import Nav from './components/nav/Nav';
import Header from './components/Header/header';
import Main from './components/Main';
import { Provider as FlowProvider } from './context/FlowContext';
import { Provider as ScenarioProvider } from './context/ScenarioContext';
import { Provider as FileProvider } from './context/FileContext';

function App() {
  return (
    <div data-testid="app">
      <ScenarioProvider>
        <FileProvider>
          <FlowProvider>
            <Header />
            <Nav />
            <Main />
          </FlowProvider>
        </FileProvider>
      </ScenarioProvider>
    </div>
  );
}

export default App;
