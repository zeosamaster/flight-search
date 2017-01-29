/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/airports              ->  index
 * POST    /api/reseed                ->  reseed
 */

'use strict';

import Airport from './airport.model';
import camelcaseKeys from 'camelcase-keys';

var rp = require('request-promise');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if (entity) {
            return res.status(statusCode).json({ results: entity });
        }
        return null;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function (err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Airports
export function index(req, res) {
    return Airport.find({}).exec()
        .then(airports => {
            if (!airports || !airports.length) {
                return reseed(req, res);
            } else {
                return airports;
            }
        })
        .then(results => ({ results }))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

export function reseed(req, res) {
    return Airport.remove({}).exec()
        .then(getAllAirports)
        .then(respondWithResult(res))
        .catch(handleError(res));
}

function getAllAirports() {
    return Promise.all('abcdefghijklmnopqrstuvwxyz'.split('').map(letter => searchAirports(letter)))
        .then(promiseResults => promiseResults.reduce((arr, r) => arr.concat(r), []))
        .then(airports => {
            debugger;
            var uniqueAirports = {};
            return airports.reduce((arr, airport) => {
                if (!uniqueAirports[airport.code]) {
                    uniqueAirports[airport.code] = true;
                    arr.push(airport);
                }
                return arr;
            }, []);
        })
        .then(airports => Promise.all(airports.map(airport => Airport.create(airport))))
        .then(a => {debugger; return a;})
        .then(newAirports => newAirports.reduce((arr, r) => arr.concat(r), []));
}

function searchAirports(query) {
    var reqOptions = {
        method: 'POST',
        body: {
            count: 1e9,
            language: 'en',
            prefixText: query
        },
        headers: { 'Content-Type': 'application/json' },
        json: true
    };

    return rp('http://www.momondo.co.uk/api/2.1/services.asmx/CompleteAirports', reqOptions)
        .then(response => response.d.map(a => camelcaseKeys(a)))
        .catch(err => {
            err && console.error(err);
            throw Error(`Error retrieving airports for query '${query}'`);
        });
}
