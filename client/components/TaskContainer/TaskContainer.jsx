import React from 'react';
import Task from '../Task/Task.jsx';
// import './TaskContainer.scss';

const TaskContainer = props => (
  <div className={`container ${props.index}`}>
    <h3>{props.label}</h3>
    {
      props.tasks.map(task => (
        <Task
          key={task.id}
          data={task}
          completeTask={props.completeTask}
          editTask={props.editTask}
          deleteTask={props.deleteTask}
        />
      ))
    }            
  </div>    
)

export default TaskContainer;