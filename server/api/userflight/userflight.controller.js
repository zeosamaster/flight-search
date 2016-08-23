/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/userflights              ->  index
 * POST    /api/userflights              ->  create
 * GET     /api/userflights/:id          ->  show
 * PUT     /api/userflights/:id          ->  upsert
 * PATCH   /api/userflights/:id          ->  patch
 * DELETE  /api/userflights/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Userflight from './userflight.model';

var rp = require('request-promise');
var when = require('when');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch (err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Userflights
export function index(req, res) {
  return Userflight.find({
    user: req.user._id
  }).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Userflight from the DB
export function show(req, res) {
  return Userflight.find({
    _id: req.params.id,
    user: req.user._id
  }).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Userflight in the DB
export function create(req, res) {
  req.body.user = req.user._id;
  return Userflight.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Userflight in the DB at the specified ID
export function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.user = req.user._id;
  return Userflight.findOneAndUpdate(req.params.id, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Userflight in the DB
export function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  req.body.user = req.user._id;
  return Userflight.find({
    _id: req.params.id,
    user: req.user._id
  }).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Userflight from the DB
export function destroy(req, res) {
  return Userflight.findOneAndRemove({
    _id: req.params.id,
    user: req.user._id
  }).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function getMomondoSearch(res) {
  return function (userflight) {
    var d = when.defer();
    rp('http://www.momondo.co.uk/api/3.0/FlightSearch', {
      method: 'POST',
      body: {
        "AdultCount": userflight.passengers,
        "ChildAges": [],
        "Culture": "en-GB",
        "DirectOnly": false,
        "IncludeNearby": false,
        "Market": "",
        "Mix": "Segments",
        "Segments": [{
          "Depart": userflight.departure_date,
          "Departure": userflight.departure_date,
          "Destination": userflight.to,
          "Origin": userflight.from
        }, {
            "Depart": userflight.arrival_date,
            "Departure": userflight.arrival_date,
            "Destination": userflight.from,
            "Origin": userflight.to
          }],
        "TicketClass": "ECO"
      },
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Cookie': 'Currency1=EUR'
      },
      json: true
    }).then((response) => {
      d.resolve({
        EngineId: response.EngineId,
        SearchId: response.SearchId
      });
    }, () => {
      console.error(arguments);
      d.reject();
    });
    return d.promise;
  };
}

function searchMomondo(res) {
  return function (params) {
    var d = when.defer();
    rp('http://www.momondo.co.uk/api/3.0/FlightSearch/' + params.SearchId + '/' + params.EngineId + '/true', {
      headers: {
        'Cookie': 'Currency1=EUR'
      },
    })
      .then((response) => {
        d.resolve(response);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(response);
      }, () => {
        console.error(arguments);
        d.reject();
      });
    return d.promise;
  };
}

export function search(req, res) {
  return Userflight.findOne({
    _id: req.params.id,
    user: req.user._id
  }).exec()
    .then(handleEntityNotFound(res))
    .then(getMomondoSearch(res))
    .then(searchMomondo(res))
    .catch(handleError(res));
}
