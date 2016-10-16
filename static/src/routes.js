import React from 'react';
import { Route } from 'react-router';

/* containers */
import { App } from 'containers/App';
import { HomeContainer } from 'containers/HomeContainer';
import LoginView from 'components/LoginView'
import RegisterView from 'components/RegisterView'
import NotFound from 'components/NotFound'
import {Transactions} from './transactions/components';

import {DetermineAuth} from 'components/DetermineAuth';
import {requireAuthentication} from 'components/AuthenticatedComponent';
import {requireNoAuthentication} from 'components/notAuthenticatedComponent';

export default (
    <Route path="/" component={App}>
        <Route path="transactions" component={requireAuthentication(Transactions)}/>
        <Route path="main" component={requireAuthentication(Transactions)}/>
        <Route path="login" component={requireNoAuthentication(LoginView)}/>
        <Route path="register" component={requireNoAuthentication(RegisterView)}/>
        <Route path="home" component={requireNoAuthentication(HomeContainer)}/>
        <Route path="*" component={DetermineAuth(NotFound)}/>
    </Route>
);
