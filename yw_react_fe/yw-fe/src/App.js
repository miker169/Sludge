import React, {useEffect} from 'react';
import './App.css';
import Nav from "./components/nav/Nav";
import Header from "./components/Header/header";
import Main from "./components/Main";



function App() {
  return (
    <>
      <Header />
      <Nav/>
      <Main/>
    </>
);
}

export default App;
