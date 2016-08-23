'use strict';

var app = require('../..');
import request from 'supertest';

var newUserflight;

describe('Userflight API:', function() {
  describe('GET /api/userflights', function() {
    var userflights;

    beforeEach(function(done) {
      request(app)
        .get('/api/userflights')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          userflights = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(userflights).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/userflights', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/userflights')
        .send({
          name: 'New Userflight',
          info: 'This is the brand new userflight!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newUserflight = res.body;
          done();
        });
    });

    it('should respond with the newly created userflight', function() {
      expect(newUserflight.name).to.equal('New Userflight');
      expect(newUserflight.info).to.equal('This is the brand new userflight!!!');
    });
  });

  describe('GET /api/userflights/:id', function() {
    var userflight;

    beforeEach(function(done) {
      request(app)
        .get(`/api/userflights/${newUserflight._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          userflight = res.body;
          done();
        });
    });

    afterEach(function() {
      userflight = {};
    });

    it('should respond with the requested userflight', function() {
      expect(userflight.name).to.equal('New Userflight');
      expect(userflight.info).to.equal('This is the brand new userflight!!!');
    });
  });

  describe('PUT /api/userflights/:id', function() {
    var updatedUserflight;

    beforeEach(function(done) {
      request(app)
        .put(`/api/userflights/${newUserflight._id}`)
        .send({
          name: 'Updated Userflight',
          info: 'This is the updated userflight!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedUserflight = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedUserflight = {};
    });

    it('should respond with the original userflight', function() {
      expect(updatedUserflight.name).to.equal('New Userflight');
      expect(updatedUserflight.info).to.equal('This is the brand new userflight!!!');
    });

    it('should respond with the updated userflight on a subsequent GET', function(done) {
      request(app)
        .get(`/api/userflights/${newUserflight._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let userflight = res.body;

          expect(userflight.name).to.equal('Updated Userflight');
          expect(userflight.info).to.equal('This is the updated userflight!!!');

          done();
        });
    });
  });

  describe('PATCH /api/userflights/:id', function() {
    var patchedUserflight;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/userflights/${newUserflight._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Userflight' },
          { op: 'replace', path: '/info', value: 'This is the patched userflight!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedUserflight = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedUserflight = {};
    });

    it('should respond with the patched userflight', function() {
      expect(patchedUserflight.name).to.equal('Patched Userflight');
      expect(patchedUserflight.info).to.equal('This is the patched userflight!!!');
    });
  });

  describe('DELETE /api/userflights/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/userflights/${newUserflight._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when userflight does not exist', function(done) {
      request(app)
        .delete(`/api/userflights/${newUserflight._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
