import React from 'react';
import './App.css';

import Nav from './components/nav/Nav';
import Header from './components/Header/header';
import Main from './components/Main';
import { Provider as ScenarioProvider } from './context/ScenarioContext';
import { HelpContextProvider } from './context/HelpContext';

function App() {
  return (
    <div data-testid="app">
      <ScenarioProvider>
        <HelpContextProvider>
          <Header />
          <Nav />
          <Main />
        </HelpContextProvider>
      </ScenarioProvider>
    </div>
  );
}

export default App;
