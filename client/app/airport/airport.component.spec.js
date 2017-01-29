'use strict';

describe('Component: AirportComponent', () => {
    // load the controller's module
    beforeEach(module('flightSearchApp.airport'));

    var AirportComponent;

    // Initialize the controller and a mock scope
    beforeEach(inject($componentController => {
        AirportComponent = $componentController('airport', {});
        console.dir(AirportComponent);
    }));

    it('should ...', () => {
        expect(1).to.equal(1);
    });
});
