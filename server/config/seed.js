/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
var when = require('when');

import User from '../api/user/user.model';
import Userflight from '../api/userflight/userflight.model';

var testUser,
  adminUser,
  testUserFlight;

when.join(
  User.findOne({
    email: 'test@example.com'
  }).exec().then(user => {
    if (user) {
      testUser = user;
    } else {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
      }).then(newUser => {
        testUser = newUser;
      });
    }
  }),

  User.findOne({
    email: 'admin@example.com'
  }).exec().then(user => {
    if (user) {
      adminUser = user;
    } else {
      User.create({
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      }).then(newUser => {
        adminUser = newUser;
      });
    }
  })
).then(() => {
  Userflight.findOne({
    name: 'Test',
    user: testUser._id
  }).exec().then((userflight) => {
    if (userflight) {
      testUserFlight = userflight;
    } else {
      Userflight.create({
        name: 'Test',
        info: 'Test flight',
        from: 'LIS',
        to: 'DUB',
        departure_date: new Date(2016, 7, 25),
        arrival_date: new Date(2016, 7, 31),
        passengers: 2,
        user: testUser._id
      }).then(newUserflight => {
        testUserFlight = newUserflight;
      });
    }
  });
});