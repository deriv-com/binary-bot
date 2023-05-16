/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'notifyjs-browser';
import 'jquery-ui/ui/widgets/dialog';
import store from './botPage/view/deriv/store';
import App from './botPage/view/deriv/app';
import { api_base } from './botPage/view/deriv/api';
import { load as loadLang } from './common/lang';

api_base.init();

loadLang();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main')
);
