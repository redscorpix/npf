goog.provide('npfTransition.interfaceMaker');

/**
 * @typedef {(Function|undefined)}
 */
npfTransition.interfaceMaker.Handler;

/**
 * @param {Object} obj
 * @param {string} prop
 * @param {*} val
 */
npfTransition.interfaceMaker.setToObjIfDef = function(obj, prop, val) {
	if (goog.isDef(val)) {
		obj[prop] = val;
	}
};

/**
 * @param {goog.events.Event|goog.fx.AnimationEvent} evt
 * @return {Object}
 */
npfTransition.interfaceMaker.getDataFromEvt = function(evt) {
	var ret = {};
	npfTransition.interfaceMaker.setToObjIfDef(ret, 'coords', evt.coords);
	npfTransition.interfaceMaker.setToObjIfDef(ret, 'x', evt.x);
	npfTransition.interfaceMaker.setToObjIfDef(ret, 'y', evt.y);
	npfTransition.interfaceMaker.setToObjIfDef(ret, 'z', evt.z);
	npfTransition.interfaceMaker.setToObjIfDef(ret, 'duration', evt.duration);
	npfTransition.interfaceMaker.setToObjIfDef(ret, 'progress', evt.progress);
	npfTransition.interfaceMaker.setToObjIfDef(ret, 'fps', evt.fps);

	return ret;
};

/**
 * @param {goog.fx.TransitionBase} obj
 * @private
 */
npfTransition.interfaceMaker.install = function(obj) {
	obj.addEventListener(goog.fx.Transition.EventType.PLAY, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEventPlay']) && obj['onEventPlay'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	}, false);
	obj.addEventListener(goog.fx.Transition.EventType.BEGIN, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEventBegin']) && obj['onEventBegin'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	}, false);
	obj.addEventListener(goog.fx.Transition.EventType.RESUME, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEventResume']) && obj['onEventResume'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	}, false);
	obj.addEventListener(goog.fx.Transition.EventType.END, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEventEnd']) && obj['onEventEnd'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	}, false);
	obj.addEventListener(goog.fx.Transition.EventType.STOP, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEventStop']) && obj['onEventStop'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	}, false);
	obj.addEventListener(goog.fx.Transition.EventType.FINISH, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEventFinish']) && obj['onEventFinish'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	}, false);
	obj.addEventListener(goog.fx.Transition.EventType.PAUSE, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEventPause']) && obj['onEventPause'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	}, false);
};
