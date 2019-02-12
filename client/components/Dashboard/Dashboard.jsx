import React from 'react';

// LIBRARIES
import axios from 'axios';
import moment from 'moment';
import { addDays } from 'date-fns';

// COMPONENTS
import TaskContainer from '../TaskContainer/TaskContainer.jsx';
import EditPanel from '../EditPanel/EditPanel.jsx';

// STYLES
import './Dashboard.scss';

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
      editPanelObj: null,
      days: [
        'SUNDAY',
        'MONDAY',
        'TUESDAY',
        'WEDNESDAY',
        'THURSDAY',
        'FRIDAY',
        'SATURDAY',
      ]
    }

    this.handleNewTaskSubmit = this.handleNewTaskSubmit.bind(this);
    this.handleCompleteButtonClick = this.handleCompleteButtonClick.bind(this);
    this.handleEditButtonClick = this.handleEditButtonClick.bind(this);
    this.handleEditPanelCloseClick = this.handleEditPanelCloseClick.bind(this);
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
        console.log('tasks:', tasks)
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
  handleCompleteButtonClick(task_id, completed) {
    // **** return only updated task
    // **** update state with diff between old state and updated DB record
    // **** toggle complete on click
    // **** Change "starred" to "favorite" in DB
    // **** Show edit panel
    // TODO Fix Conditional Rendering in EditPanel
    // TODO Allow editing
    // TODO Change days of week label to date
    // TODO Sanitize "Add Task" Input & allow special characters
    // TODO Allow favoriting
    // TODO Add Drag and Drop functionality
    // TODO Hook up Wakatime
    
    axios.post(`/api/tasks/complete/${task_id}`, {completed: completed})
      .then((response) => {
        let {tasks} = this.state
        
        
        let newTasks = tasks.map(t => {
          let task = Object.assign(t);
          if(t.id === task_id) {
            
            return response.data[0]
          }
          return task
        })
        this.setState({tasks: newTasks})
      })
      .catch(err => {console.log({err})})
  }
  handleDeleteButtonClick(task_id) {
    // OPTIMISTIC
    axios.delete(`/api/tasks/${task_id}`)
    let tasks = this.state.tasks.filter(t => t.id !== task_id);
    this.setState({tasks})
  }
  handleEditButtonClick(task_id) {
    this.setState({editPanelObj: {id: task_id}})
  }
  handleEditPanelCloseClick() {
    this.setState({editPanelObj: null})
  }
  handleChange(e) {
    this.setState({textValue: e.target.value});
  }
  render() {
    return (
      <div id="dashboard">
        <form id="newTaskForm" onSubmit={this.handleNewTaskSubmit}>
          <input id="newTaskTextField" name="newTaskValue" type="text" placeholder="Add Task" value={this.state.textValue} onChange={this.handleChange} tabIndex={0} autoFocus />
          <button id="newTaskSubmit" type="submit">+</button>
        </form>
        <div className="week">
          {
            this.state.days.map((d, i) => 
              <TaskContainer 
                key={i}
                index={i}
                label={d}
                completeTask={this.handleCompleteButtonClick}
                editTask={this.handleEditButtonClick}
                deleteTask={this.handleDeleteButtonClick}
                tasks={this.state.tasks.filter(task => task.day_of_week === i)}
              />
            )
          }
        </div>
        <EditPanel editPanelObj={this.state.editPanelObj} closeEditPanel={this.handleEditPanelCloseClick} visible={(this.state.editPanelObj !== null)}/>
      </div>
    )
  }
}
export default Dashboard;