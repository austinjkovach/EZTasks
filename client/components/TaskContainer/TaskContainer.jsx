import React from 'react';
import './TaskContainer.scss';

const TaskContainer = props => (
  <div className={`container ${props.index}`}>
    <h3>{props.day}</h3>
    {
    this.props.tasks.map(task => <Task
        key={task.id}
        {...task}
        showEditPanel={this.showEditPanel}
        deleteTask={this.handleDeleteButtonClick}
    />)
    }            
  </div>    
)

export default TaskContainer;