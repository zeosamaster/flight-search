/**
 * Userflight model events
 */

'use strict';

import {EventEmitter} from 'events';
import Userflight from './userflight.model';
var UserflightEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
UserflightEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Userflight.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    UserflightEvents.emit(event + ':' + doc._id, doc);
    UserflightEvents.emit(event, doc);
  };
}

export default UserflightEvents;
