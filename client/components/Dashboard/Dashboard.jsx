import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import Task from '../Task/Task.jsx';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
    }
  }
  componentDidMount() {
    axios.get('/api/tasks?start=1514764800&end=1528772823')
      .then(res => {
        let tasks = res.data
        this.setState({tasks})
      })
  }
  render() {
    return (
      <div id="dashboard">
        {
         this.state.tasks && this.state.tasks.map(task => <Task key={task.id} {...task} />)
        }
      </div>
    )
  }
}
export default Dashboard;