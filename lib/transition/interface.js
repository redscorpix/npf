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
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onPlay']) && obj['onPlay'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	});
	obj.addEventListener(goog.fx.Transition.EventType.BEGIN, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onBegin']) && obj['onBegin'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	});
	obj.addEventListener(goog.fx.Transition.EventType.RESUME, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onResume']) && obj['onResume'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	});
	obj.addEventListener(goog.fx.Transition.EventType.END, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onEnd']) && obj['onEnd'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	});
	obj.addEventListener(goog.fx.Transition.EventType.STOP, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onStop']) && obj['onStop'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	});
	obj.addEventListener(goog.fx.Transition.EventType.FINISH, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onFinish']) && obj['onFinish'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	});
	obj.addEventListener(goog.fx.Transition.EventType.PAUSE, function(evt) {
		/** @type {npfTransition.interfaceMaker.Handler} */ (obj['onPause']) && obj['onPause'](npfTransition.interfaceMaker.getDataFromEvt(evt));
	});
};
