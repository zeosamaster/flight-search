'use strict';

export default function($stateProvider) {
  'ngInject';

  $stateProvider
    .state('userflight', {
      url: '/userflight',
      template: '<userflight></userflight>',
      authenticate: true
    });
}
