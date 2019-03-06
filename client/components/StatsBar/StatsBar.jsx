import React from 'react';

const StatsBar = props => (
  <div className="stats-bar">
    <p className="comp-fraction">{props.tasks.filter(t => t.completed).length} / {props.tasks.length}</p>
    <p className="comp-percent">{props.tasks.length > 0 && Math.floor((props.tasks.filter(t => t.completed).length/props.tasks.length) * 100)}%</p>
    <div className="progress progress-wrapper" style={{width: '100%', background: 'linear-gradient(45deg,#1a1e5a 0,#122d98 100%)'}}>
      <div className="progress" style={{width: `${props.tasks.length > 0 ? Math.floor((props.tasks.filter(t => t.completed).length/props.tasks.length) * 100) : '0'}%` , background: 'linear-gradient(45deg,#fa9b00 0,#f4ca12 100%)', borderRadius: '4px'}} />
    </div>
  </div>    
)

export default StatsBar;