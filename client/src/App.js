import logo from './logo.svg';
import './App.css';
//import './style.css';
import React, {  useState, useEffect } from 'react';
//import { Button } from 'react-bootstrap';
import { BrowserRouter as Router, Routes , Route, Link,useParams } from 'react-router-dom';
import Comments from './components/Comments'

function App() {
  return (
    <div className="App">
      
      <Comments  />

    </div>
  );
}

export default App;
