'use strict';

describe('Component: UserflightComponent', function() {
  // load the controller's module
  beforeEach(module('flightSearchApp.userflight'));

  var UserflightComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    UserflightComponent = $componentController('userflight', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
