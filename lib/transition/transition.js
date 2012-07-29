goog.provide('npfTransition');

goog.require('goog.fx.AnimationParallelQueue');
goog.require('goog.fx.AnimationQueue');
goog.require('goog.fx.AnimationSerialQueue');
goog.require('goog.debug.ErrorHandler');
goog.require('npf.fx.KeyframeAnimation');
goog.require('npf.userAgent.support');
goog.require('npfTransition.CssAnimation');
goog.require('npfTransition.JsAnimation');
goog.require('npfTransition.Queue');
goog.require('npfTransition.ParallelQueue');
goog.require('npfTransition.SerialQueue');


/**
 * @param {Element} element
 * @param {number} time
 * @param {Array.<number>|string=} opt_acc
 * @return {!npfTransition.CssAnimation}
 */
npfTransition.createCssAnimation = function(element, time, opt_acc) {
	var animation = new npfTransition.CssAnimation(element, time, opt_acc);
	animation.addEventListener(goog.fx.Transition.EventType.END, function(evt) {
		setTimeout(function() {
			animation.dispose();
		}, 0);
	});

	return animation;
};

/**
 * @param {Element} element
 * @param {number} time
 * @param {Array.<number>|string|function(number):number|null=} opt_acc
 * @return {!npfTransition.JsAnimation}
 */
npfTransition.createJsAnimation = function(element, time, opt_acc) {
	var animation = new npfTransition.JsAnimation(element, time, opt_acc);
	animation.addEventListener(goog.fx.Transition.EventType.END, function(evt) {
		setTimeout(function() {
			animation.dispose();
		}, 0);
	});

	return animation;
};

goog.exportSymbol('npfAnimation.css', npfTransition.createCssAnimation);
goog.exportSymbol('npfAnimation.js', npfTransition.createJsAnimation);
goog.exportSymbol('npfAnimation.isCssAnimationSupported', npf.fx.KeyframeAnimation.isSupported);
goog.exportSymbol('npfAnimation.isCssTransformSupported', npf.userAgent.support.isCssTransformSupported);
goog.exportSymbol('npfAnimation.isCssTransform3dSupported', npf.userAgent.support.isCssTransform3dSupported);

goog.exportSymbol('NpfJsAnimation', npfTransition.JsAnimation);
goog.exportSymbol('NpfJsAnimation.prototype.play', npfTransition.JsAnimation.prototype.play);
goog.exportSymbol('NpfJsAnimation.prototype.pause', npfTransition.JsAnimation.prototype.pause);
goog.exportSymbol('NpfJsAnimation.prototype.stop', npfTransition.JsAnimation.prototype.stop);
goog.exportSymbol('NpfJsAnimation.prototype.dispose', npfTransition.JsAnimation.prototype.dispose);
goog.exportSymbol('NpfJsAnimation.prototype.disposeInternal', npfTransition.JsAnimation.prototype.disposeInternal);
goog.exportSymbol('NpfJsAnimation.prototype.isDisposed', npfTransition.JsAnimation.prototype.isDisposed);
goog.exportSymbol('NpfJsAnimation.prototype.addBgColorTransform', npfTransition.JsAnimation.prototype.addBgColorTransform);
goog.exportSymbol('NpfJsAnimation.prototype.addColorTransform', npfTransition.JsAnimation.prototype.addColorTransform);
goog.exportSymbol('NpfJsAnimation.prototype.addFade', npfTransition.JsAnimation.prototype.addFade);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeIn', npfTransition.JsAnimation.prototype.addFadeIn);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeInAndShow', npfTransition.JsAnimation.prototype.addFadeInAndShow);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeOut', npfTransition.JsAnimation.prototype.addFadeOut);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeOutAndHide', npfTransition.JsAnimation.prototype.addFadeOutAndHide);
goog.exportSymbol('NpfJsAnimation.prototype.addResize', npfTransition.JsAnimation.prototype.addResize);
goog.exportSymbol('NpfJsAnimation.prototype.addResizeWidth', npfTransition.JsAnimation.prototype.addResizeWidth);
goog.exportSymbol('NpfJsAnimation.prototype.addResizeHeight', npfTransition.JsAnimation.prototype.addResizeHeight);
goog.exportSymbol('NpfJsAnimation.prototype.addScroll', npfTransition.JsAnimation.prototype.addScroll);
goog.exportSymbol('NpfJsAnimation.prototype.addSlide', npfTransition.JsAnimation.prototype.addSlide);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideLeft', npfTransition.JsAnimation.prototype.addSlideLeft);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideRight', npfTransition.JsAnimation.prototype.addSlideRight);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideTop', npfTransition.JsAnimation.prototype.addSlideTop);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideFrom', npfTransition.JsAnimation.prototype.addSlideFrom);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideLeftFrom', npfTransition.JsAnimation.prototype.addSlideLeftFrom);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideTopFrom', npfTransition.JsAnimation.prototype.addSlideTopFrom);
goog.exportSymbol('NpfJsAnimation.prototype.addSwipe', npfTransition.JsAnimation.prototype.addSwipe);
goog.exportSymbol('NpfJsAnimation.prototype.addTransform', npfTransition.JsAnimation.prototype.addTransform);
goog.exportSymbol('NpfJsAnimation.prototype.addCustom', npfTransition.JsAnimation.prototype.addCustom);
goog.exportSymbol('NpfJsAnimation.prototype.onBegin', npfTransition.JsAnimation.prototype.onBeginHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onEnd', npfTransition.JsAnimation.prototype.onEndHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onFinish', npfTransition.JsAnimation.prototype.onFinishHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onPause', npfTransition.JsAnimation.prototype.onPauseHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onPlay', npfTransition.JsAnimation.prototype.onPlayHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onResume', npfTransition.JsAnimation.prototype.onResumeHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onStop', npfTransition.JsAnimation.prototype.onStopHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onProgress', npfTransition.JsAnimation.prototype.onProgressHandler);

goog.exportSymbol('NpfCssAnimation', npfTransition.CssAnimation);
goog.exportSymbol('NpfCssAnimation.prototype.play', npfTransition.CssAnimation.prototype.play);
goog.exportSymbol('NpfCssAnimation.prototype.pause', npfTransition.CssAnimation.prototype.pause);
goog.exportSymbol('NpfCssAnimation.prototype.stop', npfTransition.CssAnimation.prototype.stop);
goog.exportSymbol('NpfCssAnimation.prototype.dispose', npfTransition.CssAnimation.prototype.dispose);
goog.exportSymbol('NpfCssAnimation.prototype.disposeInternal', npfTransition.CssAnimation.prototype.disposeInternal);
goog.exportSymbol('NpfCssAnimation.prototype.isDisposed', npfTransition.CssAnimation.prototype.isDisposed);
goog.exportSymbol('NpfCssAnimation.prototype.getIterationCount', npfTransition.CssAnimation.prototype.getIterationCount);
goog.exportSymbol('NpfCssAnimation.prototype.setIterationCount', npfTransition.CssAnimation.prototype.setIterationCount);
goog.exportSymbol('NpfCssAnimation.prototype.getDuration', npfTransition.CssAnimation.prototype.getDuration);
goog.exportSymbol('NpfCssAnimation.prototype.getDelay', npfTransition.CssAnimation.prototype.getDelay);
goog.exportSymbol('NpfCssAnimation.prototype.setDelay', npfTransition.CssAnimation.prototype.setDelay);
goog.exportSymbol('NpfCssAnimation.prototype.getDirection', npfTransition.CssAnimation.prototype.getDirection);
goog.exportSymbol('NpfCssAnimation.prototype.setDirection', npfTransition.CssAnimation.prototype.setDirection);
goog.exportSymbol('NpfCssAnimation.prototype.getAccel', npfTransition.CssAnimation.prototype.getAccel);
goog.exportSymbol('NpfCssAnimation.prototype.fromTo', npfTransition.CssAnimation.prototype.fromTo);
goog.exportSymbol('NpfCssAnimation.prototype.from', npfTransition.CssAnimation.prototype.from);
goog.exportSymbol('NpfCssAnimation.prototype.to', npfTransition.CssAnimation.prototype.to);
goog.exportSymbol('NpfCssAnimation.prototype.insertKeyframe', npfTransition.CssAnimation.prototype.insertKeyframe);
goog.exportSymbol('NpfCssAnimation.prototype.fromToTransform', npfTransition.CssAnimation.prototype.fromToTransformRule);
goog.exportSymbol('NpfCssAnimation.prototype.fromTransform', npfTransition.CssAnimation.prototype.fromTransformRule);
goog.exportSymbol('NpfCssAnimation.prototype.toTransform', npfTransition.CssAnimation.prototype.toTransformRule);
goog.exportSymbol('NpfCssAnimation.prototype.setTransform', npfTransition.CssAnimation.prototype.setTransformRule);
goog.exportSymbol('NpfCssAnimation.prototype.setTransformOrigin', npfTransition.CssAnimation.prototype.setTransformOrigin);

goog.exportSymbol('NpfAnimationParallelQueue', npfTransition.ParallelQueue);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.add', npfTransition.ParallelQueue.prototype.add);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.remove', npfTransition.ParallelQueue.prototype.remove);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.play', npfTransition.ParallelQueue.prototype.play);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.pause', npfTransition.ParallelQueue.prototype.pause);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.stop', npfTransition.ParallelQueue.prototype.stop);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.dispose', npfTransition.ParallelQueue.prototype.dispose);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.disposeInternal', npfTransition.ParallelQueue.prototype.disposeInternal);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.isDisposed', npfTransition.ParallelQueue.prototype.isDisposed);

goog.exportSymbol('NpfAnimationSerialQueue', npfTransition.SerialQueue);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.add', npfTransition.SerialQueue.prototype.add);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.remove', npfTransition.SerialQueue.prototype.remove);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.play', npfTransition.SerialQueue.prototype.play);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.pause', npfTransition.SerialQueue.prototype.pause);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.stop', npfTransition.SerialQueue.prototype.stop);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.dispose', npfTransition.SerialQueue.prototype.dispose);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.disposeInternal', npfTransition.SerialQueue.prototype.disposeInternal);
goog.exportSymbol('NpfAnimationSerialQueue.prototype.isDisposed', npfTransition.SerialQueue.prototype.isDisposed);
