goog.provide('npf.events');

goog.require('goog.dom');


/**
 * Checks if a mouse event (mouseover or mouseout) occured below an element.
 * @param {goog.events.BrowserEvent} evt Mouse event (should be mouseover or mouseout).
 * @param {Element} element The ancestor element.
 * @return {boolean} Whether the event has a relatedTarget (the element the
 *                   mouse is coming from) and it's a descendent of elem.
 */
npf.events.isMouseEventWithinElement = function(evt, element) {
	// If relatedTarget is null, it means there was no previous element (e.g.
	// the mouse moved out of the window).  Assume this means that the mouse
	// event was not within the element.
	return !!evt.relatedTarget && goog.dom.contains(element, evt.relatedTarget);
};
