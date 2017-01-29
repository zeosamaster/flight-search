'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var airportCtrlStub = {
    index: 'airportCtrl.index',
    reseed: 'airportCtrl.reseed'
};

var routerStub = {
    get: sinon.spy(),
    put: sinon.spy(),
    patch: sinon.spy(),
    post: sinon.spy(),
    delete: sinon.spy()
};

// require the index with our stubbed out modules
var airportIndex = proxyquire('./index.js', {
    express: {
        Router() {
            return routerStub;
        }
    },
    './airport.controller': airportCtrlStub
});

describe('Airport API Router:', function () {
    it('should return an express router instance', function () {
        expect(airportIndex).to.equal(routerStub);
    });

    describe('GET /api/airports', function () {
        it('should route to airport.controller.index', function () {
            expect(routerStub.get
                .withArgs('/', 'airportCtrl.index')
            ).to.have.been.calledOnce;
        });
    });

    describe('POST /api/airports', function () {
        it('should route to airport.controller.create', function () {
            expect(routerStub.post
                .withArgs('/', 'airportCtrl.reseed')
            ).to.have.been.calledOnce;
        });
    });
});
