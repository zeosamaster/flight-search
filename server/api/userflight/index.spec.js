'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userflightCtrlStub = {
  index: 'userflightCtrl.index',
  show: 'userflightCtrl.show',
  create: 'userflightCtrl.create',
  upsert: 'userflightCtrl.upsert',
  patch: 'userflightCtrl.patch',
  destroy: 'userflightCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userflightIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './userflight.controller': userflightCtrlStub
});

describe('Userflight API Router:', function() {
  it('should return an express router instance', function() {
    expect(userflightIndex).to.equal(routerStub);
  });

  describe('GET /api/userflights', function() {
    it('should route to userflight.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'userflightCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/userflights/:id', function() {
    it('should route to userflight.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'userflightCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/userflights', function() {
    it('should route to userflight.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'userflightCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/userflights/:id', function() {
    it('should route to userflight.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'userflightCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/userflights/:id', function() {
    it('should route to userflight.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'userflightCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/userflights/:id', function() {
    it('should route to userflight.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'userflightCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
