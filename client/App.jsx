import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="app">
        <a className="btn btn-danger" href="/auth/google">Sign in with Google</a>
      </div>
    )
  }
}

render(<App/>, document.getElementById('root'));