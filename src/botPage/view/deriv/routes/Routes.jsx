import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Main from '../layout/Main';
import Endpoint from '../layout/Endpoint';
import NotFound from '../layout/NotFound';
import RouteWrapper from './RouteWrapper.jsx';

// Basename added to solve the gh-page issue
// [Todo] use Vercel/CircleCI to create test links and remove basename
const Routes = () => (
<BrowserRouter 
  {...(process.env.BRANCH?{basename:`/binary-bot/${process.env.BRANCH}`}:{})}
>
  <Switch>
    <RouteWrapper exact path="/" component={Main} />
    <RouteWrapper path="/endpoint" component={Endpoint} />
    <Redirect from="/endpoint.html" to="/endpoint" />
    <Route path="*" component={NotFound} />
  </Switch>
</BrowserRouter>
)

export default Routes;
