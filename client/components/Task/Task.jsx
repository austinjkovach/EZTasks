import React from 'react';
import { render } from 'react-dom';
import './Task.scss';

const Task = props => (
  <div className={`task ${props.data.completed ? 'complete' : ''}`}>
    <p>{props.data.text}</p>
    <button className="task-btn btn-complete" onClick={() => props.completeTask(props.data.id, !props.data.completed)}>✔</button>
    <button className="task-btn btn-edit" onClick={() => props.editTask(props.data.id)}>✎</button>
    <button className="task-btn btn-delete" onClick={() => props.deleteTask(props.data.id)}>X</button>
  </div>
)

export default Task;