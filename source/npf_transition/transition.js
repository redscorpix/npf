goog.provide('npfTransition');

goog.require('npfTransition.AnimationParallelQueue');
goog.require('npfTransition.AnimationQueue');
goog.require('goog.debug.ErrorHandler');
goog.require('goog.events.EventWrapper');
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
	animation.listen(goog.fx.Transition.EventType.END, function(evt) {
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
	animation.listen(goog.fx.Transition.EventType.END, function(evt) {
		setTimeout(function() {
			animation.dispose();
		}, 0);
	});

	return animation;
};

goog.exportSymbol('npfAnimation.css', npfTransition.createCssAnimation);
goog.exportSymbol('npfAnimation.js', npfTransition.createJsAnimation);
goog.exportSymbol('npfAnimation.isCssAnimationSupported', npf.fx.CssAnimation.isSupported);
goog.exportSymbol('npfAnimation.isCssTransformSupported', npf.userAgent.support.getCssTransforms);
goog.exportSymbol('npfAnimation.isCssTransform3dSupported', npf.userAgent.support.getCssTransforms3d);

goog.exportSymbol('NpfAnimationQueue', npfTransition.AnimationQueue);
goog.exportSymbol('NpfAnimationQueue.prototype.play', npfTransition.AnimationQueue.prototype.playEx);
goog.exportSymbol('NpfAnimationQueue.prototype.pause', npfTransition.AnimationQueue.prototype.pauseEx);
goog.exportSymbol('NpfAnimationQueue.prototype.stop', npfTransition.AnimationQueue.prototype.stop);
goog.exportSymbol('NpfAnimationQueue.prototype.dispose', npfTransition.AnimationQueue.prototype.dispose);
goog.exportSymbol('NpfAnimationQueue.prototype.add', npfTransition.AnimationQueue.prototype.addEx);
goog.exportSymbol('NpfAnimationQueue.prototype.remove', npfTransition.AnimationQueue.prototype.removeEx);
goog.exportSymbol('NpfAnimationQueue.prototype.onFinish', npfTransition.AnimationQueue.prototype.onFinishHandler);

goog.exportSymbol('NpfAnimationParallelQueue', npfTransition.AnimationParallelQueue);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.play', npfTransition.AnimationParallelQueue.prototype.playEx);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.pause', npfTransition.AnimationParallelQueue.prototype.pauseEx);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.stop', npfTransition.AnimationParallelQueue.prototype.stop);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.dispose', npfTransition.AnimationParallelQueue.prototype.dispose);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.add', npfTransition.AnimationParallelQueue.prototype.addEx);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.remove', npfTransition.AnimationParallelQueue.prototype.removeEx);
goog.exportSymbol('NpfAnimationParallelQueue.prototype.onFinish', npfTransition.AnimationParallelQueue.prototype.onFinishHandler);

goog.exportSymbol('NpfJsAnimation', npfTransition.JsAnimation);
goog.exportSymbol('NpfJsAnimation.prototype.play', npfTransition.JsAnimation.prototype.play);
goog.exportSymbol('NpfJsAnimation.prototype.pause', npfTransition.JsAnimation.prototype.pause);
goog.exportSymbol('NpfJsAnimation.prototype.stop', npfTransition.JsAnimation.prototype.stop);
goog.exportSymbol('NpfJsAnimation.prototype.dispose', npfTransition.JsAnimation.prototype.dispose);
goog.exportSymbol('NpfJsAnimation.prototype.isDisposed', npfTransition.JsAnimation.prototype.isDisposed);

goog.exportSymbol('NpfJsAnimation.prototype.addBgColorTransform', npfTransition.JsAnimation.prototype.addBgColorTransformEx);
goog.exportSymbol('NpfJsAnimation.prototype.addColorTransform', npfTransition.JsAnimation.prototype.addColorTransformEx);
goog.exportSymbol('NpfJsAnimation.prototype.addFade', npfTransition.JsAnimation.prototype.addFadeEx);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeIn', npfTransition.JsAnimation.prototype.addFadeInEx);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeInAndShow', npfTransition.JsAnimation.prototype.addFadeInAndShowEx);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeOut', npfTransition.JsAnimation.prototype.addFadeOutEx);
goog.exportSymbol('NpfJsAnimation.prototype.addFadeOutAndHide', npfTransition.JsAnimation.prototype.addFadeOutAndHideEx);
goog.exportSymbol('NpfJsAnimation.prototype.addResize', npfTransition.JsAnimation.prototype.addResizeEx);
goog.exportSymbol('NpfJsAnimation.prototype.addResizeWidth', npfTransition.JsAnimation.prototype.addResizeWidthEx);
goog.exportSymbol('NpfJsAnimation.prototype.addResizeHeight', npfTransition.JsAnimation.prototype.addResizeHeightEx);
goog.exportSymbol('NpfJsAnimation.prototype.addScroll', npfTransition.JsAnimation.prototype.addScrollEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSlide', npfTransition.JsAnimation.prototype.addSlideEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideLeft', npfTransition.JsAnimation.prototype.addSlideLeftEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideRight', npfTransition.JsAnimation.prototype.addSlideRightEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideTop', npfTransition.JsAnimation.prototype.addSlideTopEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideFrom', npfTransition.JsAnimation.prototype.addSlideFromEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideLeftFrom', npfTransition.JsAnimation.prototype.addSlideLeftFromEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSlideTopFrom', npfTransition.JsAnimation.prototype.addSlideTopFromEx);
goog.exportSymbol('NpfJsAnimation.prototype.addSwipe', npfTransition.JsAnimation.prototype.addSwipeEx);
goog.exportSymbol('NpfJsAnimation.prototype.addTransform', npfTransition.JsAnimation.prototype.addTransformEx);
goog.exportSymbol('NpfJsAnimation.prototype.addCustom', npfTransition.JsAnimation.prototype.addCustomEx);
goog.exportSymbol('NpfJsAnimation.prototype.onBegin', npfTransition.JsAnimation.prototype.onBeginHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onEnd', npfTransition.JsAnimation.prototype.onEndHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onFinish', npfTransition.JsAnimation.prototype.onFinishHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onPause', npfTransition.JsAnimation.prototype.onPauseHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onPlay', npfTransition.JsAnimation.prototype.onPlayHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onResume', npfTransition.JsAnimation.prototype.onResumeHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onStop', npfTransition.JsAnimation.prototype.onStopHandler);
goog.exportSymbol('NpfJsAnimation.prototype.onProgress', npfTransition.JsAnimation.prototype.onProgressHandler);

goog.exportSymbol('NpfCssAnimation', npfTransition.CssAnimation);
goog.exportSymbol('NpfCssAnimation.prototype.play', npfTransition.CssAnimation.prototype.playEx);
goog.exportSymbol('NpfCssAnimation.prototype.pause', npfTransition.CssAnimation.prototype.pauseEx);
goog.exportSymbol('NpfCssAnimation.prototype.stop', npfTransition.CssAnimation.prototype.stop);
goog.exportSymbol('NpfCssAnimation.prototype.dispose', npfTransition.CssAnimation.prototype.dispose);
goog.exportSymbol('NpfCssAnimation.prototype.isDisposed', npfTransition.CssAnimation.prototype.isDisposed);
goog.exportSymbol('NpfCssAnimation.prototype.getIterationCount', npfTransition.CssAnimation.prototype.getIterationCount);
goog.exportSymbol('NpfCssAnimation.prototype.setIterationCount', npfTransition.CssAnimation.prototype.setIterationCountEx);
goog.exportSymbol('NpfCssAnimation.prototype.getDuration', npfTransition.CssAnimation.prototype.getDuration);
goog.exportSymbol('NpfCssAnimation.prototype.getDelay', npfTransition.CssAnimation.prototype.getDelay);
goog.exportSymbol('NpfCssAnimation.prototype.setDelay', npfTransition.CssAnimation.prototype.setDelayEx);
goog.exportSymbol('NpfCssAnimation.prototype.getDirection', npfTransition.CssAnimation.prototype.getDirection);
goog.exportSymbol('NpfCssAnimation.prototype.setDirection', npfTransition.CssAnimation.prototype.setDirectionEx);
goog.exportSymbol('NpfCssAnimation.prototype.getAccel', npfTransition.CssAnimation.prototype.getAccel);
goog.exportSymbol('NpfCssAnimation.prototype.fromTo', npfTransition.CssAnimation.prototype.fromTo);
goog.exportSymbol('NpfCssAnimation.prototype.from', npfTransition.CssAnimation.prototype.from);
goog.exportSymbol('NpfCssAnimation.prototype.to', npfTransition.CssAnimation.prototype.to);
goog.exportSymbol('NpfCssAnimation.prototype.insertKeyframe', npfTransition.CssAnimation.prototype.insertKeyframe);
goog.exportSymbol('NpfCssAnimation.prototype.fromToTransform', npfTransition.CssAnimation.prototype.fromToTransform);
goog.exportSymbol('NpfCssAnimation.prototype.fromTransform', npfTransition.CssAnimation.prototype.fromTransform);
goog.exportSymbol('NpfCssAnimation.prototype.toTransform', npfTransition.CssAnimation.prototype.toTransform);
goog.exportSymbol('NpfCssAnimation.prototype.setTransform', npfTransition.CssAnimation.prototype.setTransform);
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

goog.exportSymbol('NpfAnimationQueue', npfTransition.SerialQueue);
goog.exportSymbol('NpfAnimationQueue.prototype.add', npfTransition.SerialQueue.prototype.add);
goog.exportSymbol('NpfAnimationQueue.prototype.remove', npfTransition.SerialQueue.prototype.remove);
goog.exportSymbol('NpfAnimationQueue.prototype.play', npfTransition.SerialQueue.prototype.play);
goog.exportSymbol('NpfAnimationQueue.prototype.pause', npfTransition.SerialQueue.prototype.pause);
goog.exportSymbol('NpfAnimationQueue.prototype.stop', npfTransition.SerialQueue.prototype.stop);
goog.exportSymbol('NpfAnimationQueue.prototype.dispose', npfTransition.SerialQueue.prototype.dispose);
goog.exportSymbol('NpfAnimationQueue.prototype.disposeInternal', npfTransition.SerialQueue.prototype.disposeInternal);
goog.exportSymbol('NpfAnimationQueue.prototype.isDisposed', npfTransition.SerialQueue.prototype.isDisposed);
