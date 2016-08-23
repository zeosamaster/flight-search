'use strict';

import LoginController from './login.controller';

export default angular.module('flightSearchApp.login', [])
  .controller('LoginController', LoginController)
  .name;
