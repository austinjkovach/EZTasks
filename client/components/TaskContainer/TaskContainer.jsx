import React from 'react';
import Task from '../Task/Task.jsx';
import StatsBar from '../StatsBar/StatsBar.jsx';
// import './TaskContainer.scss';

const TaskContainer = props => (
  <div className={`container ${props.index}`}>
    <h3>{props.label}</h3>
    <StatsBar tasks={props.tasks} />
    {
      props.tasks.sort(t => t.completed ? 1 : -1).map(task => (
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