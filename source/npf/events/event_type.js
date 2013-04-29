goog.provide('npf.events.EventType');


/**
 * @enum {string}
 */
npf.events.EventType = {

  /**
   * position (Array.<goog.math.Coordinate>)
   */
  DOUBLETAP: 'doubletap',

  /**
   * angle (number)
   * direction (npf.events.TouchHandler.Direction)
   * distance (number)
   * distanceX (number)
   * distanceY (number)
   * position (goog.math.Coordinate)
   */
  DRAG: 'drag',

  /**
   * angle (number)
   * direction (npf.events.TouchHandler.Direction)
   * distance (number)
   */
  DRAGEND: 'dragend',

  /**
   * angle (number)
   * direction (npf.events.TouchHandler.Direction)
   * distance (number)
   * distanceX (number)
   * distanceY (number)
   * position (goog.math.Coordinate)
   */
  DRAGSTART: 'dragstart',

  /**
   * position (Array.<goog.math.Coordinate>)
   */
  HOLD: 'hold',

  /**
   * gesture (npf.events.TouchHandler.Gesture)
   */
  RELEASE: 'release',

  /**
   * angle (number)
   * direction (npf.events.TouchHandler.Direction)
   * distance (number)
   * distanceX (number)
   * distanceY (number)
   * position (Array.<goog.math.Coordinate>)
   */
  SWIPE: 'swipe',

  /**
   * position (Array.<goog.math.Coordinate>)
   */
  TAP: 'tap',

  /**
   * position (goog.math.Coordinate)
   * rotation (number)
   * scale (number)
   */
  TRANSFORM: 'transform',

  /**
   * position (goog.math.Coordinate)
   * rotation (number)
   * scale (number)
   */
  TRANSFORMEND: 'transformend',

  /**
   * position (goog.math.Coordinate)
   * rotation (number)
   * scale (number)
   */
  TRANSFORMSTART: 'transformstart'
};
