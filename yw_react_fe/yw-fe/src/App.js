import React, {useEffect} from 'react';
import './App.css';

import Nav from "./components/nav/Nav";
import Header from "./components/Header/header";
import Main from "./components/Main";
import { Provider as FlowProvider } from "./context/FlowContext";

function App() {
  return (
    <>
     <FlowProvider>
       <Header />
       <Nav/>
       <Main/>
     </FlowProvider>
    </>
);
}

export default App;
