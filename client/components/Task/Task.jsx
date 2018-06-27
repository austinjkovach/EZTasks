import React from 'react';
import { render } from 'react-dom';
import './Task.scss';

const Task = props => (
  <div className="task">
    {props.text}
    {/*<button onClick={props.completeTask}>Complete</button>
    <button onClick={props.editTask}>Edit</button>*/}
    <button onClick={props.deleteTask}>Delete</button>

  </div>
)

export default Task;