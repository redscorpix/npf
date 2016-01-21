goog.provide('npf.userAgent.speech');

goog.require('npf.userAgent.utils');


/**
 * @private {boolean?}
 */
npf.userAgent.speech.recognition_ = null;

/**
 * @return {boolean}
 */
npf.userAgent.speech.isRecognitionSupported = function() {
  if (npf.userAgent.speech.recognition_) {
    npf.userAgent.speech.recognition_ =
      !!npf.userAgent.utils.prefixed('SpeechRecognition', goog.global)
  }

  return /** @type {boolean} */ (npf.userAgent.speech.recognition_);
};

/**
 * @return {boolean}
 */
npf.userAgent.speech.isSynthesisSupported = function() {
  return 'SpeechSynthesisUtterance' in goog.global;
};
