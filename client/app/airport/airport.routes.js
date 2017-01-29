'use strict';

export default function ($stateProvider) {
    'ngInject';

    $stateProvider
        .state('airport', {
            url: '/airport',
            template: '<airport></airport>',
            authenticate: true
        });
}
