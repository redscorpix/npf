goog.provide('npf.fx.CubicBezier');


/**
 * Cubic Bezier function calculator.
 * Inspired by http://www.netzgesta.de/dev/cubic-bezier-timing-function.html
 * @param {number} t from 0 to 1.
 * @param {number} p1x from 0 to 1.
 * @param {number} p1y from 0 to 1.
 * @param {number} p2x from 0 to 1.
 * @param {number} p2y from 0 to 1.
 * @param {number} duration in ms.
 * @return {number} from 0 to 1.
 */
npf.fx.CubicBezier = function(t, p1x, p1y, p2x, p2y, duration) {
  /** @type {number} */
  var ax = 0;
  /** @type {number} */
  var bx = 0;
  /** @type {number} */
  var cx = 0;
  /** @type {number} */
  var ay = 0;
  /** @type {number} */
  var by = 0;
  /** @type {number} */
  var cy = 0;

  // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.

  /**
   * @param {number} t
   * @return {number}
   */
  function sampleCurveX(t) {
    return ((ax * t + bx) * t + cx) * t;
  }

  /**
   * @param {number} t
   * @return {number}
   */
  function sampleCurveY(t) {
    return ((ay * t + by) * t + cy) * t;
  }

  /**
   * @param {number} t
   * @return {number}
   */
  function sampleCurveDerivativeX(t) {
    return (3.0 * ax * t + 2.0 * bx) * t + cx;
  }

  // The epsilon value to pass given that the animation is going to run over
  // |dur| seconds. The longer the animation, the more precision is needed
  // in the timing function result to avoid ugly discontinuities.

  /**
   * @param {number} duration
   * @return {number}
   */
  function solveEpsilon(duration) {
    return 1.0 / (200.0 * duration);
  }

  /**
   * @param {number} x
   * @param {number} epsilon
   * @return {number}
   */
  function solve(x, epsilon) {
    return sampleCurveY(solveCurveX(x, epsilon));
  }

  // Given an x value, find a parametric value it came from.

  /**
   * @param {number} x
   * @param {number} epsilon
   * @return {number}
   */
  function solveCurveX(x, epsilon) {
    /** @type {number} */
    var t0;
    /** @type {number} */
    var t1;
    /** @type {number} */
    var t2;
    /** @type {number} */
    var x2;
    /** @type {number} */
    var d2;
    /** @type {number} */
    var i;

    // First try a few iterations of Newton's method — normally very fast.
    for (t2 = x, i = 0; i < 8; i++) {
      x2 = sampleCurveX(t2) - x;

      if (Math.abs(x2) < epsilon) {
        return t2;
      }

      d2 = sampleCurveDerivativeX(t2);

      if (Math.abs(d2) < 1e-6) {
        break;
      }

      t2 = t2 - x2 / d2;
    }

    // Fall back to the bisection method for reliability.
    t0 = 0.0;
    t1 = 1.0;
    t2 = x;

    if (t2 < t0) {
      return t0;
    }

    if (t2 > t1) {
      return t1;
    }

    while (t0 < t1) {
      x2 = sampleCurveX(t2);

      if (Math.abs(x2 - x) < epsilon) {
        return t2;
      }

      if (x > x2) {
        t0 = t2;
      } else {
        t1 = t2;
      }

      t2 = (t1 - t0) * 0.5 + t0;
    }

    return t2; // Failure.
  }

  // Calculate the polynomial coefficients, implicit first and last control
  // points are (0,0) and (1,1).
  cx = 3.0 * p1x;
  bx = 3.0 * (p2x - p1x) - cx;
  ax = 1.0 - cx - bx;
  cy = 3.0 * p1y;
  by = 3.0 * (p2y - p1y) - cy;
  ay = 1.0 - cy - by;

  // Convert from input time to parametric value in curve, then from that
  // to output time.
  return solve(t, solveEpsilon(duration));
};
