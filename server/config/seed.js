/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';

var testUser,
  adminUser;

User.findOne({
  email: 'test@example.com'
}).exec().then(user => {
  if (user) {
    testUser = user
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
});

User.findOne({
  email: 'admin@example.com'
}).exec().then(user => {
  if (user) {
    adminUser = user
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
});