import React,{useState} from 'react'
import Board from './Board'
import './index.css';

function App() {
  const headerStyle={
    margin: "30px auto",
    fontWeight:'bold',
    fontSize:'40px',
    textDecoration:'underline'
    
  }
  return (
    <div className="App">
      <h1 className="center" style={headerStyle}>
        Tic-Tac-Toe   <span className="glyphicon glyphicon-play-circle"></span>
      </h1>
      <Board />
    </div>
  );
}

export default App;
