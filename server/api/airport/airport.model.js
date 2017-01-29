'use strict';

import mongoose from 'mongoose';

var AirportSchema = new mongoose.Schema({
    code: String,
    name: String,
    mainCity: String,
    country: String,
    mainCityCode: String
});

export default mongoose.model('Airport', AirportSchema);
