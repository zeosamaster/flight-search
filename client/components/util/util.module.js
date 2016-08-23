'use strict';

import {
  UtilService
} from './util.service';

export default angular.module('flightSearchApp.util', [])
  .factory('Util', UtilService)
  .name;
