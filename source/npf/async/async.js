goog.provide('npf.async');


/**
 * @param {!Array<T>} arr
 * @param {function(this:SCOPE1,T,number,function())} func
 * @param {SCOPE1} funcScope
 * @param {function(this:SCOPE2)} callback
 * @param {SCOPE2=} opt_scope
 * @template T, SCOPE1, SCOPE2
 */
npf.async.forEach = function(arr, func, funcScope, callback, opt_scope) {
  /** @type {number} */
  var counter = arr.length;

  if (counter) {
    for (var i = 0; i < arr.length; i++) {
      func.call(funcScope, arr[i], i, function() {
        counter--;

        if (!counter) {
          callback.call(opt_scope);
        }
      });
    }
  } else {
    callback.call(opt_scope);
  }
};

/**
 * @param {!Array<T>} arr
 * @param {function(this:SCOPE1,T,number,function())} func
 * @param {SCOPE1} funcScope
 * @param {function(this:SCOPE2)} callback
 * @param {SCOPE2=} opt_scope
 * @template T, SCOPE1, SCOPE2
 */
npf.async.forEachSeries = function(arr, func, funcScope, callback, opt_scope) {
  /** @type {number} */
  var index = 0;
  var run = function() {
    if (index < arr.length) {
      func.call(funcScope, arr[index], index, function() {
        index++;
        run();
      });
    } else {
      callback.call(opt_scope);
    }
  };
  run();
};
