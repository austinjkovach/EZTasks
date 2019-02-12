import React from 'react';
import './EditPanel.scss';

export default class EditPanel extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            defaultValues: this.props.editPanelObj
        }
    }

    render() {

        return (
            <div id={'editPanel'} className={ this.props.visible ? 'edit_panel visible' : 'edit_panel'}>
                Edit Panel
                <div>
                    {this.props.editPanelObj && this.props.editPanelObj.id}
                </div>
                <button className={'btn btn-danger'} onClick={this.props.closeEditPanel}>X</button>
            </div>
        )
    }
}
