import React from 'react';
import { render } from 'react-dom';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div id="home">
        <a className="btn btn-danger" href="/auth/google">Sign in with Google</a>
      </div>
    )
  }
}
export default Home;