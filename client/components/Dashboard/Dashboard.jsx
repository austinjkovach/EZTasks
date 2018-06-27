import React from 'react';
import { render } from 'react-dom';
import axios from 'axios';

import Task from '../Task/Task.jsx';
import './Dashboard.scss';

import moment from 'moment';


// HOLY SHIT PLEASE ABSTRACT THIS
function getWeekDateRangeFromUnixTimestamp(unix_timestamp) {
let current = moment(unix_timestamp);
let weekStart = moment(current.startOf('week'));
let weekEnd = moment(current.endOf('week'));


  return {
    start: weekStart.unix(),
    end: weekEnd.unix()
  }
}

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      textValue: '',
    }

    this.handleNewTaskSubmit = this.handleNewTaskSubmit.bind(this);
    this.handleCompleteButtonClick = this.handleCompleteButtonClick.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleDeleteButtonClick = this.handleDeleteButtonClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }
  componentDidMount() {
    // TODO CLEANUP -> GOTO LINE 11
    // ACCOUNT FOR UNIX QUERY PARAMS IN URL
    let currentDate = Date.now();
    let dateRange = getWeekDateRangeFromUnixTimestamp(currentDate);



    axios.get(`/api/tasks?start=${dateRange.start}&end=${dateRange.end}`)
      .then(res => {
        let tasks = res.data
        this.setState({tasks})
      })
      .catch(err => {console.log({err})})
  }
  handleNewTaskSubmit(e) {
    e.preventDefault();

    let data = {
      // TODO STOP HARDCODING USER_ID
      user_id: 1,
      text: this.state.textValue
    }
    axios.post('/api/tasks', data)
      .then((response) => {
        let {tasks} = this.state
        let newTasks = [...tasks, ...response.data]
        this.setState({tasks: newTasks})
      })
      .catch(err => {console.log({err})})
      this.setState({textValue: ''})
  }
  handleCompleteButtonClick(task_id) {
    console.log({task_id})
  }
  handleEditButtonClick(task_id) {
    console.log('edit', {task_id})
  }
  handleDeleteButtonClick(task_id) {
    // OPTIMISTIC
    let tasks = this.state.tasks.filter(t => t.id !== task_id);
    this.setState({tasks})
    axios.delete(`/api/tasks/${task_id}`)
  }
  handleChange(e) {
    this.setState({textValue: e.target.value});
  }
  render() {
    return (
      <div id="dashboard">
        <form id="newTaskForm" onSubmit={this.handleNewTaskSubmit}>
          <input id="newTaskTextField" name="newTaskValue" type="text" placeholder="Add Task" value={this.state.textValue} onChange={this.handleChange} />
          <button id="newTaskSubmit" type="submit" >+</button>
        </form>
        {
          this.state.tasks && this.state.tasks.map(task => (
            <Task
              key={task.id}
              {...task}
              deleteTask={() => this.handleDeleteButtonClick(task.id)}
            />
          ))
        }
      </div>
    )
  }
}
export default Dashboard;