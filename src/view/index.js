/* eslint-disable import/no-extraneous-dependencies */
import React from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import "notifyjs-browser";
import "jquery-ui/ui/widgets/dialog";
import store from "Store";
import App from './app'
import 'Styles/color.scss'
import 'Styles/chart.scss';
import 'Styles/bot.scss';

ReactDOM.render(
  <Provider store={store}>
    <App /> 
  </Provider>,
  document.getElementById("main")
);
