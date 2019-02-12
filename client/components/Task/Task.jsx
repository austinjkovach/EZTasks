import React from 'react';
import { render } from 'react-dom';
import './Task.scss';

const Task = props => (
  <div className={`task ${props.data.completed ? 'complete' : ''}`}>
    <p>{props.data.text}</p>
    <button onClick={() => props.completeTask(props.data.id, !props.data.completed)}>Complete</button>
    <button onClick={() => props.deleteTask(props.data.id)}>Delete</button>
  </div>
)

export default Task;