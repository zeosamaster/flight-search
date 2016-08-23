'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './userflight.routes';

export class UserflightComponent {
  /*@ngInject*/

  constructor($http, $scope, socket) {
    this.$http = $http;
    this.socket = socket;
    this.userflight = {};

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('userflight');
    });
  }

  $onInit() {
    this.getUserFlights().then(response => {
      this.socket.syncUpdates('userflight', this.userflights);
    })
  }

  getUserFlights() {
    return this.$http.get('/api/userflights')
      .then(response => {
        this.userflights = response.data;
      });
  }

  submit() {
    if (this.userflight) {
      if (this.userflight._id) {
        this.$http.put('/api/userflights/' + this.userflight._id, this.userflight).then(() => {
          this.getUserFlights();
        });
      } else {
        this.$http.post('/api/userflights', this.userflight);
      }
      this.userflight = {};
    }
  }

  edit(userflight) {
    this.userflight = angular.extend({}, userflight);
  }

  delete(userflight) {
    this.$http.delete('/api/userflights/' + userflight._id);
  }
}

export default angular.module('flightSearchApp.userflight', [uiRouter])
  .config(routes)
  .component('userflight', {
    template: require('./userflight.html'),
    controller: UserflightComponent,
    controllerAs: 'userflightCtrl'
  })
  .name;
