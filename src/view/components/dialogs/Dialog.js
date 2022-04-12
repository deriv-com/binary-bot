import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'Store';
import { observer as globalObserver } from 'Observer';
import DialogComponent from './DialogComponent';

export default class Dialog {
    constructor(id, title, content, options = {}) {
        this.componentId = `${id}-component`;

        ReactDOM.render(
            <Provider store={store}>
                <DialogComponent id={this.componentId} title={title} content={content} options={options} />
            </Provider>,
            document.getElementById(id)
        );
    }
    open() {
        $(`#${this.componentId}`).dialog('open');
        globalObserver.emit('dialog.opened', this.componentId);
    }
    close() {
        $(`#${this.componentId}`).dialog('close');
    }
    registerCloseOnOtherDialog() {
        globalObserver.register('dialog.opened', dialogId => {
            if (dialogId !== this.componentId) {
                this.close();
            }
        });
    }
}
