import React from 'react';
import { render } from 'react-dom';

const Task = props => (
  <div className="task">
    {props.id}
    {props.text}
  </div>
)

export default Task;