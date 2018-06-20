import React from 'react';
import { render } from 'react-dom';
import { Switch, Route } from 'react-router-dom'
import Home from '../Home/Home';


const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Home} />
      {/*<Route path='/dashboard' component={Dashboard} />*/}
    </Switch>
  </main>
)

export default Main;