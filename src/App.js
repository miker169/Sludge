import React from 'react';
import './App.css';

import Nav from './components/nav/Nav';
import Header from './components/Header/header';
import Main from './components/Main';
import Params from './components/Params';
import {Provider as ScenarioProvider} from './context/ScenarioContext';
import {HelpContextProvider} from './context/HelpContext';
import {ParamsContextProvider} from './context/ParamsContext'
import {FileContextProvider} from "./context/FileContext";
import {FlowContextProvider} from "./context/FlowContext";

function App() {
  const [activeTab, setActiveTab] = React.useState('workflow')
  const clickHandler = (e) => {
    setActiveTab(e.target.name);
  }

  return (
    <div data-testid="app">
      <ScenarioProvider>
        <FileContextProvider>
          <ParamsContextProvider>
            <FlowContextProvider>
              <HelpContextProvider>
                <Header/>
                <Nav clickHandler={clickHandler} activeTab={activeTab}/>
                {
                  activeTab === 'params' ? <Params/> : <Main/>
                }
              </HelpContextProvider>
            </FlowContextProvider>
          </ParamsContextProvider>
        </FileContextProvider>
      </ScenarioProvider>
    </div>
  );
}

export default App;
