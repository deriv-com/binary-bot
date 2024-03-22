import React from 'react';
import { BrowserRouter, Routes as Switch, Route } from 'react-router-dom';
import Main from '@components/Main';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Endpoint from '@components/Endpoint';
import NotFound from '@components/NotFound';
import OfficialVersionWarning from '../botPage/view/react-components/OfficialVersionWarning';
import { OFFICIAL_DOMAINS } from '../constants';

const generateBaseName = () => {
    const branch = process.env.BRANCH;
    if (branch) {
        const project_name = process.env.PROJECT_NAME || 'binary-bot';
        return [project_name, branch].join('/');
    }
    return '/';
};

const Routes = () => {
    const is_official = OFFICIAL_DOMAINS.includes(window.location.hostname);
    return (
        <BrowserRouter basename={generateBaseName()}>
            <Header />
            <Switch>
                <Route exact path='/' element={<Main />} />
                <Route exact path='/endpoint' element={<Endpoint />} />
                <Route path='*' element={<NotFound />} />
            </Switch>
            <OfficialVersionWarning show={!is_official} />
            <Footer />
        </BrowserRouter>
    );
};

export default Routes;
