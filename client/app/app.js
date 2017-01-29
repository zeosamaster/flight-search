'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import 'angular-socket-io';

import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';
//import ngValidationMatch from 'angular-validation-match';


import {
    routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import userflight from './userflight/userflight.component';
import airport from './airport/airport.component';

import './app.scss';

angular.module('flightSearchApp', [
    // ngAnimate,
    ngCookies, ngResource, ngSanitize, 'btford.socket-io', uiRouter, uiBootstrap,
    // ngMessages,

    // ngValidationMatch,
    _Auth, account, admin, navbar, footer, main, constants, socket, util,

    userflight, airport
])
    .config(routeConfig)
    .run(($rootScope, $location, Auth) => {
        'ngInject';
        // Redirect to login if route requires auth and you're not logged in

        $rootScope.$on('$stateChangeStart', (event, next) => {
            Auth.isLoggedIn(loggedIn => {
                if (next.authenticate && !loggedIn) {
                    $location.path('/login');
                }
            });
        });
    });

angular.element(document)
    .ready(() => {
        angular.bootstrap(document, ['flightSearchApp'], {
            strictDi: true
        });
    });
