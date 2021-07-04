import React from 'react'
import {BrowserRouter,Route,Switch} from 'react-router-dom'
import Game from './Game';
import Home from './Home';


function App() {
  
  return (
    <div >
      <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/game' component={Game} />
      </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
