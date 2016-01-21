goog.provide('npf.events.EventType');

goog.require('goog.events.EventType');


/**
 * @enum {string}
 */
npf.events.EventType = {
  DOUBLETAP: 'doubletap',
  DRAG: goog.events.EventType.DRAG,
  DRAGEND: goog.events.EventType.DRAGEND,
  DRAGSTART: goog.events.EventType.DRAGSTART,
  HOLD: 'hold',
  RELEASE: 'release',
  SWIPE: 'swipe',
  TAP: 'tap',
  TRANSFORM: 'transform',
  TRANSFORMEND: 'transformend',
  TRANSFORMSTART: 'transformstart'
};
