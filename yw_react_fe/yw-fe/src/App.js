import React from 'react';
import './App.css';

import Nav from "./components/nav/Nav";
import Header from "./components/Header/header";
import Main from "./components/Main";
import { Provider as FlowProvider } from "./context/FlowContext";

function App() {
  return (
    <div data-testid="app">
     <FlowProvider>
       <Header />
       <Nav/>
       <Main/>
     </FlowProvider>
    </div>
);
}

export default App;
