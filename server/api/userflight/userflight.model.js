'use strict';

import mongoose from 'mongoose';

var UserflightSchema = new mongoose.Schema({
  user: String,
  name: String, // To-Do: remove
  info: String, // To-Do: remove
  from: String,
  to: String,
  departure_date: Date,
  arrival_date: Date,
  passengers: Number,
  active: Boolean
});

export default mongoose.model('Userflight', UserflightSchema);
