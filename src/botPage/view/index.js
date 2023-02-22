/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'notifyjs-browser';
import 'jquery-ui/ui/widgets/dialog';
import store from './deriv/store';
import App from './deriv/app';

ReactDOM.render(
  <Provider store={store}>
     <div id="g_id_onload" style={{display:'none' }}
					data-client_id={process.env.GD_CLIENT_ID}
          data-auto_prompt="false"></div>
    <App />
  </Provider>,
  document.getElementById("main")
);
