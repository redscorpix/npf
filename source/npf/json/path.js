goog.provide('npf.json.Path');
goog.provide('npf.json.path');


/**
 * @param {*} data
 * @param {string} expression
 * @source JSONPath 0.8.0 - XPath for JSON, Stefan Goessner (goessner.net)
 * @constructor
 */
npf.json.Path = function(data, expression, arg) {
  /**
   * @type {*}
   * @private
   */
  this.data_ = data;

  /**
   * @private {string}
   */
  this.expression_ = expression;

  /**
   * @private {Array}
   */
  this.result_ = null;

  /**
   * @private {boolean}
   */
  this.tracePath_ = false;
};

/**
 * @return {Array}
 */
npf.json.Path.prototype.trace = function() {
  this.result_ = null;
  this.tracePath_ = false;
  this.trace_(this.normalize().replace(/^\$;/,""), this.data_, "$");

  return this.result_;
};

/**
 * @return {Array.<string>}
 */
npf.json.Path.prototype.tracePath = function() {
  this.result_ = null;
  this.tracePath_ = true;
  this.trace_(this.normalize().replace(/^\$;/,""), this.data_, "$");

  return /** @type {Array.<string>} */ (this.result_);
};

/**
 * @param {string} expression
 * @param {*} val
 * @param {string} path
 * @private
 */
npf.json.Path.prototype.trace_ = function(expression, val, path) {
  if (expression) {
    var x = expression.split(";");
    /** @type {string} */
    var location = x.shift();
    /** @type {string} */
    var subExpression = x.join(';');

    if (val && val.hasOwnProperty(location)) {
      this.trace_(subExpression, val[location], path + ";" + location);
    } else if (location === "*") {
      this.walk_(location, subExpression, val, path, goog.bind(function(m, l, x, v, p) {
        this.trace_(m + ";" + x, v, p);
      }, this));
    } else if (location === "..") {
      this.trace_(subExpression, val, path);
      this.walk_(location, subExpression, val, path, goog.bind(function(m, l, x, v, p) {
        if (typeof v[m] === "object") {
          this.trace_("..;" + x, v[m], p + ";" + m);
        }
      }, this));
    } else if (/,/.test(location)) {
      // [name1,name2,...]
      for (var s = location.split(/'?,'?/), i = 0, n = s.length; i < n; i++) {
        this.trace_(s[i] + ";" + subExpression, val, path);
      }
    } else if (/^\(.*?\)$/.test(location)) {
      // [(expression)]
      var subPath = path.substr(path.lastIndexOf(";") + 1);
      this.trace_(this.eval_(location, val, subPath) + ";" + subExpression, val, path);
    } else if (/^\?\(.*?\)$/.test(location)) {
      // [?(expression)]
      this.walk_(location, subExpression, val, path, goog.bind(function(m, l, x, v, p) {
        if (this.eval_(l.replace(/^\?\((.*?)\)$/,"$1"), v[m], m)) {
          this.trace_(m + ";" + x, v, p);
        }
      }, this));
    } else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(location)) {
      // [start:end:step]  phyton slice syntax
      this.slice_(location, subExpression, val, path);
    }
  } else if (path) {
    if (!this.result_) {
      this.result_ = [];
    }

    this.result_.push(this.tracePath_ ? this.asPath_(path) : val);
  }
};

/**
 * @return {string}
 */
npf.json.Path.prototype.normalize = function() {
  var subx = [];

  return this.expression_.
    replace(/[\['](\??\(.*?\))[\]']/g, function($0, $1) {
      return "[#" + (subx.push($1) - 1) + "]";
    }).
    replace(/'?\.'?|\['?/g, ";").
    replace(/;;;|;;/g, ";..;").
    replace(/;$|'?\]|'$/g, "").
    replace(/#([0-9]+)/g, function($0, $1) {
      return subx[$1];
    });
};

/**
 * @param {string} path
 * @return {string}
 * @private
 */
npf.json.Path.prototype.asPath_ = function(path) {
  /** @type {!Array.<string>} */
  var x = path.split(";");
  /** @type {string} */
  var p = "$";

  for (var i = 1, n = x.length; i < n; i++) {
    var a = /^[0-9*]+$/.test(x[i]) ? "" : "'";
    p += "[" + a + x[i] + a + "]";
  }

  return p;
};

/**
 * @param {string} loc
 * @param {string} expr
 * @param {*} val
 * @param {string} path
 * @param {function(number|string, string, string, *, string)} f
 * @private
 */
npf.json.Path.prototype.walk_ = function(loc, expr, val, path, f) {
  if (val instanceof Array) {
    for (var i = 0, n = val.length; i < n; i++) {
      if (i in val) {
        f(i, loc, expr, val, path);
      }
    }
  } else if (typeof val === "object") {
    for (var m in val) {
      if (val.hasOwnProperty(m)) {
        f(m, loc, expr, val, path);
      }
    }
  }
};

/**
 * @param {string} loc
 * @param {string} expr
 * @param {*} val
 * @param {string} path
 */
npf.json.Path.prototype.slice_ = function(loc, expr, val, path) {
  if (val instanceof Array) {
    /** @type {number} */
    var len = val.length;
    /** @type {number} */
    var start = 0;
    /** @type {number} */
    var end = len;
    /** @type {number} */
    var step = 1;

    loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0, $1, $2, $3) {
      start = parseInt($1 || start);
      end = parseInt($2 || end);
      step = parseInt($3 || step);
    });
    start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
    end   = (end < 0)   ? Math.max(0, end + len)   : Math.min(len, end);

    for (var i = start; i < end; i += step) {
      this.trace_(i + ";" + expr, val, path);
    }
  }
};

/**
 * @param {string} x
 * @param {*} _v
 * @param {string} _vname
 * @return {string}
 * @private
 */
npf.json.Path.prototype.eval_ = function(x, _v, _vname) {
  try {
    return this.data_ && _v && eval(x.replace(/@/g, "_v"));
  } catch(e) {
    throw new SyntaxError("jsonPath: " + e.message + ": " +
      x.replace(/@/g, "_v").replace(/\^/g, "_a"));
  }
};


/**
 * @param {*} data
 * @param {string} expression
 * @return {Array}
 */
npf.json.path.trace = function(data, expression) {
  var pathTracer = new npf.json.Path(data, expression);

  return pathTracer.trace();
};

/**
 * @param {*} data
 * @param {string} expression
 * @return {Array.<string>}
 */
npf.json.path.tracePath = function(data, expression) {
  var pathTracer = new npf.json.Path(data, expression);

  return pathTracer.tracePath();
};
