import React from 'react';
import './EditPanel.scss';

export default class EditPanel extends React.Component {
    constructor(props) {
        super(props)

        let {
            id,
            completed,
            text,
            completed_on,
            assigned_time,
        } = this.props.editPanelObj
        this.state = {
            id,
            completed,
            text,
            completed_on,
            assigned_time,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({defaultValues: nextProps.editPanelObj})
    }
    updateCompleted(nextState) {
        this.setState({completed: nextState})
    }
    render() {
        console.log(this.state.completed)
        return (
            <div id={'editPanel'} className={'edit_panel'}>
                Edit Panel
                <div>
                    {this.props.editPanelObj.id}
                    <form id="editForm">
                        <input id="editText" type="text" value={this.state.text} onChange={(e) => this.setState({text: e.target.value})}/>

                        <label htmlFor="editCheckbox">Completed</label>
                        <input id="editCheckbox" type="checkbox" checked={this.state.completed || false} onClick={(e) => this.setState({completed: !this.state.completed})} />

                        <input id="editDate" type="date" />
                        <button type="submit" className='btn btn-success' onClick={(e) => this.props.editPanelSubmit(e, this.state)}>Submit</button>
                    </form>
                </div>
                <button className={'btn btn-danger'} onClick={this.props.closeEditPanel}>X</button>
            </div>
        )
    }
}
