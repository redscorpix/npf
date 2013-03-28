goog.provide('npf.regExp');

goog.require('goog.array');
goog.require('goog.object');


/**
 * npf.regExp provides augmented, extensible JavaScript regular expressions. You get new syntax, flags,
 * and methods beyond what browsers support natively. npf.regExp is also a regex utility belt with
 * tools to make your client-side grepping simpler and more powerful, while freeing you from
 * worrying about pesky cross-browser inconsistencies and the dubious `lastIndex` property. See
 * npf.regExp's documentation (http://xregexp.com/) for more details.
 * Source — XRegExp v2.0.0 (c) 2007-2012 Steven Levithan <http://xregexp.com/> MIT License
 * @param {string|RegExp} pattern Regex pattern string, or an existing `RegExp` object to copy.
 * @param {string=} flags Any combination of flags:
 * @return {RegExp}
 */
npf.regExp = (function() {
  /*--------------------------------------
   *  Private variables
   *------------------------------------*/

  var self;
  var addToken;

  /**
   * Storage for fixed/extended native methods
   */
  var fixed = {};

  /**
   * Storage for addon tokens
   */
  var tokens = [];

  /**
   * Token scope
   */
  var defaultScope = "default";

  /**
   * Token scope
   */
  var classScope = "class";

  /**
   * Regexes that match native regex syntax
   */
  var nativeTokens = goog.object.create(
    // Any native multicharacter token in default scope (includes octals, excludes character
    // classes)
    defaultScope, /^(?:\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S])|\(\?[:=!]|[?*+]\?|{\d+(?:,\d*)?}\??)/,
    // Any native multicharacter token in character class scope (includes octals)
    classScope, /^(?:\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4}|c[A-Za-z]|[\s\S]))/
  );

  /**
   * Any backreference in replacement strings
   */
  var replacementToken = /\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g;

  /**
   * Any character with a later instance in the string
   */
  var duplicateFlags = /([\s\S])(?=[\s\S]*\1)/g;

  /**
   * Any greedy/lazy quantifier
   */
  var quantifier = /^(?:[?*+]|{\d+(?:,\d*)?})\??/;

  /**
   * Check for correct `exec` handling of nonparticipating capturing groups
   */
  var compliantExecNpcg = !goog.isDef(/()??/.exec("")[1]);

  /**
   * Check for flag y support (Firefox 3+)
   */
  var hasNativeY = !!goog.global['RegExp']['prototype']['sticky'];

  /**
   * Used to kill infinite recursion during npf.regExp construction
   */
  var isInsideConstructor = false;

  /**
   * Storage for known flags, including addon flags
   */
  var registeredFlags = "gim" + (hasNativeY ? "y" : "");

  /*--------------------------------------
   *  Private helper functions
   *------------------------------------*/

  /**
   * Attaches npf.regExp.prototype properties and named capture supporting data to a regex object.
   * @param {RegExp} regex Regex to augment.
   * @param {Array} captureNames Array with capture names, or null.
   * @param {boolean=} isNative Whether the regex was created by `RegExp` rather than `npf.regExp`.
   * @return {RegExp} Augmented regex.
   * @private
   */
  function augment(regex, captureNames, isNative) {
    // Can't auto-inherit these since the npf.regExp constructor returns a nonprimitive value
    for (var p in self.prototype) {
      if (self.prototype.hasOwnProperty(p)) {
        regex[p] = self.prototype[p];
      }
    }

    regex.xregexp = {
      captureNames : captureNames,
      isNative : !!isNative
    };

    return regex;
  }

  /**
   * Returns native `RegExp` flags used by a regex object.
   * @param {RegExp} regex Regex to check.
   * @return {string} Native flags in use.
   * @private
   */
  function getNativeFlags(regex) {
    // return nativ.exec.call(/\/([a-z]*)$/i, String(regex))[1];
    return (regex.global ? "g" : "") + (regex.ignoreCase ? "i" : "") +
      (regex.multiline ? "m" : "") + (regex.extended ? "x" : "") + // Proposed for ES6, included in AS3
      (regex.sticky ? "y" : ""); // Proposed for ES6, included in Firefox 3+
  }

  /**
   * Copies a regex object while preserving special properties for named capture and augmenting with
   * `npf.regExp.prototype` methods. The copy has a fresh `lastIndex` property (set to zero). Allows
   * adding and removing flags while copying the regex.
   * @param {RegExp} regex Regex to copy.
   * @param {string=} addFlags Flags to be added while copying the regex.
   * @param {string=} removeFlags Flags to be removed while copying the regex.
   * @return {RegExp} Copy of the provided regex, possibly with modified flags.
   * @private
   */
  function copy(regex, addFlags, removeFlags) {
    if (!self.isRegExp(regex)) {
      throw new TypeError("type RegExp expected");
    }

    var flags = (getNativeFlags(regex) + (addFlags || "")).replace(duplicateFlags, "");

    if (removeFlags) {
      // Would need to escape `removeFlags` if this was public
      flags = flags.replace(new RegExp("[" + removeFlags + "]+", "g"), "");
    }

    if (regex.xregexp && !regex.xregexp.isNative) {
      // Compiling the current (rather than precompilation) source preserves the effects of nonnative source flags
      regex = augment(self(regex.source, flags), regex.xregexp.captureNames ? regex.xregexp.captureNames.slice(0) : null);
    } else {
      // Augment with `npf.regExp.prototype` methods, but use native `RegExp` (avoid searching for special tokens)
      regex = augment(new RegExp(regex.source, flags), null, true);
    }

    return regex;
  }

  /**
   * Determines whether an object is of the specified type.
   * @param {*} value Object to check.
   * @param {string} type Type to check for, in lowercase.
   * @return {boolean} Whether the object matches the type.
   * @private
   */
  function isType(value, type) {
    return goog.isObject(value) && (Object.prototype.toString.call(value).toLowerCase() === "[object " + type + "]");
  }

  /**
   * Runs built-in/custom tokens in reverse insertion order, until a match is found.
   * @param {string} pattern Original pattern from which an npf.regExp object is being built.
   * @param {number} pos Position to search for tokens within `pattern`.
   * @param {number} scope Current regex scope.
   * @param {Object} context Context object assigned to token handler functions.
   * @return {Object} Object with properties `output` (the substitution string returned by the
   *                  successful token handler) and `match` (the token's match array), or null.
   * @private
   */
  function runTokens(pattern, pos, scope, context) {
    var result = null;

    // Protect against constructing npf.regExps within token handler and trigger functions
    isInsideConstructor = true;

    // Must reset `isInsideConstructor`, even if a `trigger` or `handler` throws
    try {
      var i = tokens.length;

      while (i--) { // Run in reverse order
        var t = tokens[i];

        if ((t.scope === "all" || t.scope === scope) && (!t.trigger || t.trigger.call(context))) {
          t.pattern.lastIndex = pos;

          var match = fixed.exec.call(t.pattern, pattern); // Fixed `exec` here allows use of named backreferences, etc.

          if (match && match.index === pos) {
            result = {
              output : t.handler.call(context, match, scope),
              match : match
            };

            break;
          }
        }
      }
    } catch (err) {
      throw err;
    } finally {
      isInsideConstructor = false;
    }

    return result;
  }

  /*--------------------------------------
   *  Constructor
   *------------------------------------*/

  /**
   * Creates an extended regular expression object for matching text with a pattern. Differs from a
   * native regular expression in that additional syntax and flags are supported. The returned
   * object is in fact a native `RegExp` and works with all native methods.
   * @param {string|RegExp} pattern Regex pattern string, or an existing `RegExp` object to copy.
   * @param {string=} flags Any combination of flags:
   *          <li>`g` - global
   *          <li>`i` - ignore case
   *          <li>`m` - multiline anchors
   *          <li>`n` - explicit capture
   *          <li>`s` - dot matches all (aka singleline)
   *          <li>`x` - free-spacing and line comments (aka extended)
   *          <li>`y` - sticky (Firefox 3+ only) Flags cannot be provided when constructing one `RegExp` from another.
   * @returns {RegExp} Extended regular expression object.
   * @example
   * // With named capture and flag x
   * date = npf.regExp('(?<year>  [0-9]{4}) -?  # year  \n\
   *                 (?<month> [0-9]{2}) -?  # month \n\
   *                 (?<day>   [0-9]{2})     # day   ', 'x');
   * // Passing a regex object to copy it. The copy maintains special properties for named capture,
   * // is augmented with `npf.regExp.prototype` methods, and has a fresh `lastIndex` property (set to
   * // zero). Native regexes are not recompiled using npf.regExp syntax.
   * npf.regExp(/regex/);
   * @constructor
   */
  self = function(pattern, flags) {
    if (self.isRegExp(pattern)) {
      if (goog.isDef(flags)) {
        throw new TypeError("can't supply flags when constructing one RegExp from another");
      }

      return copy(/** @type {RegExp} */ (pattern));
    }

    // Tokens become part of the regex construction process, so protect against infinite recursion
    // when an npf.regExp is constructed within a token handler function
    if (isInsideConstructor) {
      throw new Error("can't call the npf.regExp constructor within token definition functions");
    }

    var output = [];
    var scope = defaultScope;
    var tokenContext = {
      hasNamedCapture : false,
      captureNames : [],
      hasFlag : function(flag) {
        return flags.indexOf(flag) > -1;
      }
    };
    var pos = 0;
    var tokenResult;
    var match;
    var chr;

    pattern = goog.isDef(pattern) ? String(pattern) : '';
    flags = goog.isDef(flags) ? String(flags) : '';

    if (flags.match(duplicateFlags)) {
      // Don't use test/exec because they would update lastIndex
      throw new SyntaxError("invalid duplicate regular expression flag");
    }

    // Strip/apply leading mode modifier with any combination of flags except g or y: (?imnsx)
    pattern = pattern.replace(/^\(\?([\w$]+)\)/, function($0, $1) {
      if (/[gy]/.test($1)) {
        throw new SyntaxError("can't use flag g or y in mode modifier");
      }

      flags = (flags + $1).replace(duplicateFlags, "");

      return "";
    });
    self.forEach(/** @type {string} */ (flags), /[\s\S]/, function(m) {
      if (registeredFlags.indexOf(m[0]) < 0) {
        throw new SyntaxError("invalid regular expression flag " + m[0]);
      }
    });

    while (pos < pattern.length) {
      // Check for custom tokens at the current position
      tokenResult = runTokens(pattern, pos, scope, tokenContext);

      if (tokenResult) {
        output.push(tokenResult.output);
        pos += (tokenResult.match[0].length || 1);
      } else {
        // Check for native tokens (except character classes) at the current position
        match = nativeTokens[scope].exec(pattern.slice(pos));

        if (match) {
          output.push(match[0]);
          pos += match[0].length;
        } else {
          chr = pattern.charAt(pos);

          if (chr === "[") {
            scope = classScope;
          } else if (chr === "]") {
            scope = defaultScope;
          }

          // Advance position by one character
          output.push(chr);
          ++pos;
        }
      }
    }

    return augment(new RegExp(output.join(""), flags.replace(/[^gimy]+/g, "")), tokenContext.hasNamedCapture ? tokenContext.captureNames : null);
  };

  /*--------------------------------------
   *  Public methods/properties
   *------------------------------------*/

  /**
   * Extends or changes npf.regExp syntax and allows custom flags. This is used internally and can be
   * used to create npf.regExp addons.
   * @param {RegExp} regex Regex object that matches the new token.
   * @param {Function} handler Function that returns a new pattern string (using native regex syntax) to
   *          replace the matched token within all future npf.regExp regexes. Has access to persistent
   *          properties of the regex being built, through `this`. Invoked with two arguments:
   *          <li>The match array, with named backreference properties.
   *          <li>The regex scope where the match was found.
   * @param {Object=} options Options object with optional properties:
   *          <li>`scope` {String} Scopes where the token applies: 'default', 'class', or 'all'.
   *          <li>`trigger` {Function} Function that returns `true` when the token should be
   *          applied; e.g., if a flag is set. If `false` is returned, the matched string can be
   *          matched by other tokens. Has access to persistent properties of the regex being built,
   *          through `this` (including function `this.hasFlag`).
   *          <li>`customFlags` {String} Nonnative flags used by the token's handler or trigger
   *          functions. Prevents npf.regExp from throwing an invalid flag error when the specified
   *          flags are used.
   *          @example
   *  // Basic usage: Adds \a for ALERT character
   * addToken(
   *   /\\a/,
   *   function () {return '\\x07';},
   *   {scope: 'all'}
   * );
   * npf.regExp('\\a[\\a-\\n]+').test('\x07\n\x07'); // -> true
   */
  addToken = function(regex, handler, options) {
    options = options || {};

    if (regex) {
      tokens.push({
        pattern : copy(regex, "g" + (hasNativeY ? "y" : "")),
        handler : handler,
        scope : options.scope || defaultScope,
        trigger : options.trigger || null
      });
    }

    // Providing `customFlags` with null `regex` and `handler` allows adding flags that do
    // nothing, but don't throw an error
    if (options.customFlags) {
      registeredFlags = (registeredFlags + options.customFlags).replace(duplicateFlags, "");
    }
  };

  /**
   * Escapes any regular expression metacharacters, for use when matching literal strings. The
   * result can safely be used at any point within a regex that uses any flags.
   * @param {string} str String to escape.
   * @return {string} String with regex metacharacters escaped.
   * @example
   * npf.regExp.escape('Escaped? <.>');
   * // -> 'Escaped\?\ <\.>'
   */
  self.escape = function(str) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  /**
   * Executes a regex search in a specified string. Returns a match array or `null`. If the provided
   * regex uses named capture, named backreference properties are included on the match array.
   * Optional `pos` and `sticky` arguments specify the search start position, and whether the match
   * must start at the specified position only. The `lastIndex` property of the provided regex is
   * not used, but is updated for compatibility. Also fixes browser bugs compared to the native
   * `RegExp.prototype.exec` and can be used reliably cross-browser.
   * @param {string} str String to search.
   * @param {RegExp} regex Regex to search with.
   * @param {number=} pos Zero-based index at which to start the search. Default is 0.
   * @param {boolean|string=} sticky Whether the match must start at the specified position only. The string
   *          `'sticky'` is accepted as an alternative to `true`. Default is 'false'.
   * @returns {Array} Match array with named backreference properties, or null.
   * @example
   * // Basic use, with named backreference
   * var match = npf.regExp.exec('U+2620', npf.regExp('U\\+(?<hex>[0-9A-F]{4})'));
   * match.hex; // -> '2620'
   * // With pos and sticky, in a loop
   * var pos = 2, result = [], match;
   * while (match = npf.regExp.exec('<1><2><3><4>5<6>', /<(\d)>/, pos, 'sticky')) {
   *   result.push(match[1]);
   *   pos = match.index + match[0].length;
   * }
   * // result -> ['2', '3', '4']
   */
  self.exec = function(str, regex, pos, sticky) {
    var r2 = copy(regex, "g" + (sticky && hasNativeY ? "y" : ""), (sticky === false ? "y" : ""));
    var match;
    r2.lastIndex = pos = pos || 0;
    match = fixed.exec.call(r2, str); // Fixed `exec` required for `lastIndex` fix, etc.

    if (sticky && match && match.index !== pos) {
      match = null;
    }

    if (regex.global) {
      regex.lastIndex = match ? r2.lastIndex : 0;
    }

    return match;
  };

  /**
   * Executes a provided function once per regex match.
   * @param {string} str String to search.
   * @param {RegExp} regex Regex to search with.
   * @param {Function} callback Function to execute for each match. Invoked with four arguments:
   *          <li>The match array, with named backreference properties.
   *          <li>The zero-based match index.
   *          <li>The string being traversed.
   *          <li>The regex object being used to traverse the string.
   * @param {Object=} context Object to use as `this` when executing `callback`.
   * @return {*} Provided `context` object.
   * @example
   *  // Extracts every other digit from a string
   * npf.regExp.forEach('1a2345', /\d/, function (match, i) {
   *   if (i % 2) this.push(+match[0]);
   * }, []);
   * // -> [2, 4]
   */
  self.forEach = function(str, regex, callback, context) {
    var pos = 0;
    var i = -1;
    var match;

    while ((match = self.exec(str, regex, pos))) {
      callback.call(context, match, ++i, str, regex);
      pos = match.index + (match[0].length || 1);
    }
    return context;
  };

  /**
   * Copies a regex object and adds flag `g`. The copy maintains special properties for named
   * capture, is augmented with `npf.regExp.prototype` methods, and has a fresh `lastIndex` property
   * (set to zero). Native regexes are not recompiled using npf.regExp syntax.
   * @param {RegExp} regex Regex to globalize.
   * @return {RegExp} Copy of the provided regex with flag `g` added.
   * @example
   *
   * var globalCopy = npf.regExp.globalize(/regex/);
   * globalCopy.global; // -> true
   */
  self.globalize = function(regex) {
    return copy(regex, "g");
  };

  /**
   * Returns `true` if an object is a regex; `false` if it isn't. This works correctly for regexes
   * created in another frame, when `instanceof` and `constructor` checks would fail.
   * @param {*} value Object to check.
   * @return {boolean} Whether the object is a `RegExp` object.
   * @example
   * npf.regExp.isRegExp('string'); // -> false
   * npf.regExp.isRegExp(/regex/i); // -> true
   * npf.regExp.isRegExp(RegExp('^', 'm')); // -> true
   * npf.regExp.isRegExp(npf.regExp('(?s).')); // -> true
   */
  self.isRegExp = function(value) {
    return isType(value, "regexp");
  };

  /**
   * Retrieves the matches from searching a string using a chain of regexes that successively search
   * within previous matches. The provided `chain` array can contain regexes and objects with
   * `regex` and `backref` properties. When a backreference is specified, the named or numbered
   * backreference is passed forward to the next regex or returned.
   * @param {string} str String to search.
   * @param {Array} chain Regexes that each search for matches within preceding results.
   * @return {Array} Matches by the last regex in the chain, or an empty array.
   * @example
   * // Basic usage; matches numbers within <b> tags
   * npf.regExp.matchChain('1 <b>2</b> 3 <b>4 a 56</b>', [
   *   npf.regExp('(?is)<b>.*?</b>'),
   *   /\d+/
   * ]);
   * // -> ['2', '4', '56']
   *  // Passing forward and returning specific backreferences
   * html = '<a href="http://xregexp.com/api/">XRegExp</a>\
   *         <a href="http://www.google.com/">Google</a>';
   * npf.regExp.matchChain(html, [
   *   {regex: /<a href="([^"]+)">/i, backref: 1},
   *   {regex: npf.regExp('(?i)^https?://(?<domain>[^/?#]+)'), backref: 'domain'}
   * ]);
   * // -> ['xregexp.com', 'www.google.com']
   */
  self.matchChain = function(str, chain) {
    return (function recurseChain(values, level) {
      var item = chain[level].regex ? chain[level] : {
        regex : chain[level]
      };
      var matches = [];
      var addMatch = function(match) {
        matches.push(item.backref ? (match[item.backref] || "") : match[0]);
      };

      for (var i = 0; i < values.length; ++i) {
        self.forEach(values[i], item.regex, addMatch);
      }

      return ((level === chain.length - 1) || !matches.length) ? matches : recurseChain(matches, level + 1);
    }([str], 0));
  };

  /**
   * Returns a new string with one or all matches of a pattern replaced. The pattern can be a string
   * or regex, and the replacement can be a string or a function to be called for each match. To
   * perform a global search and replace, use the optional `scope` argument or include flag `g` if
   * using a regex. Replacement strings can use `${n}` for named and numbered backreferences.
   * Replacement functions can use named backreferences via `arguments[0].name`. Also fixes browser
   * bugs compared to the native `String.prototype.replace` and can be used reliably cross-browser.
   * @param {string} str String to search.
   * @param {RegExp|string} search Search pattern to be replaced.
   * @param {string|Function} replacement Replacement string or a function invoked to create it. Replacement strings
   *          can include special replacement syntax:
   *          <li>$$ - Inserts a literal '$'.
   *          <li>$&, $0 - Inserts the matched substring.
   *          <li>$` - Inserts the string that precedes the matched substring (left context).
   *          <li>$' - Inserts the string that follows the matched substring (right context).
   *          <li>$n, $nn - Where n/nn are digits referencing an existent capturing group, inserts
   *          backreference n/nn.
   *          <li>${n} - Where n is a name or any number of digits that reference an existent
   *          capturing group, inserts backreference n. Replacement functions are invoked with three
   *          or more arguments:
   *          <li>The matched substring (corresponds to $& above). Named backreferences are
   *          accessible as properties of this first argument.
   *          <li>0..n arguments, one for each backreference (corresponding to $1, $2, etc. above).
   *          <li>The zero-based index of the match within the total search string.
   *          <li>The total string being searched.
   * @param {string} scope Use 'one' to replace the first match only, or 'all'. If not explicitly
   *          specified and using a regex with flag `g`, `scope` is 'all'. Default is 'one'.
   * @returns {string} New string with one or all matches replaced.
   * @example
   * // Regex search, using named backreferences in replacement string
   * var name = npf.regExp('(?<first>\\w+) (?<last>\\w+)');
   * npf.regExp.replace('John Smith', name, '${last}, ${first}');
   * // -> 'Smith, John'
   *  // Regex search, using named backreferences in replacement function
   * npf.regExp.replace('John Smith', name, function (match) {
   *   return match.last + ', ' + match.first;
   * });
   * // -> 'Smith, John'
   *  // Global string search/replacement
   * npf.regExp.replace('RegExp builds RegExps', 'RegExp', 'npf.regExp', 'all');
   * // -> 'npf.regExp builds npf.regExps'
   */
  self.replace = function(str, search, replacement, scope) {
    var isRegex = self.isRegExp(search);
    var search2 = search;

    if (isRegex) {
      if (!goog.isDef(scope) && search.global) {
        scope = "all"; // Follow flag g when `scope` isn't explicit
      }
      // Note that since a copy is used, `search`'s `lastIndex` isn't updated *during* replacement
      // iterations
      search2 = copy(/** @type {RegExp} */ (search), scope === "all" ? "g" : "", scope === "all" ? "" : "g");
    } else if (scope === "all") {
      search2 = new RegExp(self.escape(String(search)), "g");
    }

    var result = fixed.replace.call(String(str), search2, replacement); // Fixed `replace` required for named backreferences, etc.

    if (isRegex && search.global) {
      search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
    }

    return result;
  };

  /**
   * Splits a string into an array of strings using a regex or string separator. Matches of the
   * separator are not included in the result array. However, if `separator` is a regex that
   * contains capturing groups, backreferences are spliced into the result each time `separator` is
   * matched. Fixes browser bugs compared to the native `String.prototype.split` and can be used
   * reliably cross-browser.
   * @param {string} str String to split.
   * @param {RegExp|string} separator Regex or string to use for separating the string.
   * @param {number=} limit Maximum number of items to include in the result array.
   * @return {Array} Array of substrings.
   * @example
   * // Basic use
   * npf.regExp.split('a b c', ' ');
   * // -> ['a', 'b', 'c']
   *  // With limit
   * npf.regExp.split('a b c', ' ', 2);
   * // -> ['a', 'b']
   *  // Backreferences in result array
   * npf.regExp.split('..word1..', /([a-z]+)(\d+)/i);
   * // -> ['..', 'word', '1', '..']
   */
  self.split = function(str, separator, limit) {
    return fixed.split.call(str, separator, limit);
  };

  /**
   * Executes a regex search in a specified string. Returns `true` or `false`. Optional `pos` and
   * `sticky` arguments specify the search start position, and whether the match must start at the
   * specified position only. The `lastIndex` property of the provided regex is not used, but is
   * updated for compatibility. Also fixes browser bugs compared to the native
   * `RegExp.prototype.test` and can be used reliably cross-browser.
   * @param {string} str String to search.
   * @param {RegExp} regex Regex to search with.
   * @param {number=} pos Zero-based index at which to start the search. Default is 0.
   * @param {boolean|string=} sticky Whether the match must start at the specified position only. The string
   *          `'sticky'` is accepted as an alternative to `true`. Default is 'false'.
   * @return {boolean} Whether the regex matched the provided value.
   * @example
   *  // Basic use
   * npf.regExp.test('abc', /c/); // -> true
   *  // With pos and sticky
   * npf.regExp.test('abc', /c/, 0, 'sticky'); // -> false
   */
  self.test = function(str, regex, pos, sticky) {
    // Do this the easy way :-)
    return !!self.exec(str, regex, pos, sticky);
  };

  /**
   * Returns an npf.regExp object that is the union of the given patterns. Patterns can be provided as
   * regex objects or strings. Metacharacters are escaped in patterns provided as strings.
   * Backreferences in provided regex objects are automatically renumbered to work correctly. Native
   * flags used by provided regexes are ignored in favor of the `flags` argument.
   * @param {Array} patterns Regexes and strings to combine.
   * @param {string=} flags Any combination of npf.regExp flags.
   * @returns {RegExp} Union of the provided regexes and strings.
   * @example
   *
   * npf.regExp.union(['a+b*c', /(dogs)\1/, /(cats)\1/], 'i');
   * // -> /a\+b\*c|(dogs)\1|(cats)\2/i
   *
   * npf.regExp.union([npf.regExp('(?<pet>dogs)\\k<pet>'), npf.regExp('(?<pet>cats)\\k<pet>')]);
   * // -> npf.regExp('(?<pet>dogs)\\k<pet>|(?<pet>cats)\\k<pet>')
   */
  self.union = function(patterns, flags) {
    var parts = /(\()(?!\?)|\\([1-9]\d*)|\\[\s\S]|\[(?:[^\\\]]|\\[\s\S])*]/g;
    var numCaptures = 0;
    var numPriorCaptures;
    var captureNames;
    var rewrite = function(match, paren, backref) {
      var name = captureNames[numCaptures - numPriorCaptures];
      if (paren) { // Capturing group
        ++numCaptures;
        if (name) { // If the current capture has a name
          return "(?<" + name + ">";
        }
      } else if (backref) { // Backreference
        return "\\" + (+backref + numPriorCaptures);
      }
      return match;
    };
    var output = [];

    if (!(isType(patterns, "array") && patterns.length)) {
      throw new TypeError("patterns must be a nonempty array");
    }

    for (var i = 0; i < patterns.length; ++i) {
      var pattern = patterns[i];

      if (self.isRegExp(pattern)) {
        numPriorCaptures = numCaptures;
        captureNames = (pattern.xregexp && pattern.xregexp.captureNames) || [];
        // Rewrite backreferences. Passing to npf.regExp dies on octals and ensures patterns
        // are independently valid; helps keep this simple. Named captures are put back
        output.push(self(pattern.source).source.replace(parts, rewrite));
      } else {
        output.push(self.escape(pattern));
      }
    }

    return self(output.join("|"), flags);
  };

  /*--------------------------------------
   *  Fixed/extended native methods
   *------------------------------------*/

  /**
   * Adds named capture support (with backreferences returned as `result.name`), and fixes browser
   * bugs in the native `RegExp.prototype.exec`.
   * @param {string} str String to search.
   * @return {Array} Match array with named backreference properties, or null.
   * @private
   */
  fixed.exec = function(str) {
    var origLastIndex;

    if (!this.global) {
      origLastIndex = this.lastIndex;
    }

    var match = this.exec(str);

    if (match) {
      // Fix browsers whose `exec` methods don't consistently return `undefined` for
      // nonparticipating capturing groups
      if (!compliantExecNpcg && match.length > 1 && goog.array.lastIndexOf(match, "") > -1) {
        var r2 = new RegExp(this.source, getNativeFlags(this).replace("g", ""));

        // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
        // matching due to characters outside the match
        String(str).slice(match.index).replace(r2, function() {
          for (var i = 1; i < arguments.length - 2; ++i) {
            if (!goog.isDef(arguments[i])) {
              match[i] = undefined;
            }
          }
        });
      }

      // Attach named capture properties
      if (this.xregexp && this.xregexp.captureNames) {
        for (var i = 1; i < match.length; ++i) {
          var name = this.xregexp.captureNames[i - 1];

          if (name) {
            match[name] = match[i];
          }
        }
      }
      // Fix browsers that increment `lastIndex` after zero-length matches
      if (this.global && !match[0].length && (this.lastIndex > match.index)) {
        this.lastIndex = match.index;
      }
    }

    if (!this.global) {
      this.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
    }

    return match;
  };

  /**
   * Fixes browser bugs in the native `RegExp.prototype.test`.
   * @param {string} str String to search.
   * @return {boolean} Whether the regex matched the provided value.
   * @private
   */
  fixed.test = function(str) {
    // Do this the easy way :-)
    return !!fixed.exec.call(this, str);
  };

  /**
   * Adds named capture support (with backreferences returned as `result.name`).
   * @param {RegExp} regex Regex to search with.
   * @return {Array} If `regex` uses flag g, an array of match strings or null. Without flag g, the
   *          result of calling `regex.exec(this)`.
   * @private
   */
  fixed.match = function(regex) {
    if (!self.isRegExp(regex)) {
      regex = new RegExp(regex); // Use native `RegExp`
    } else if (regex.global) {
      var result = this.match(regex);
      regex.lastIndex = 0; // Fixes IE bug

      return result;
    }

    return fixed.exec.call(regex, this);
  };

  /**
   * Adds support for `${n}` tokens for named and numbered backreferences in replacement text, and
   * provides named backreferences to replacement functions as `arguments[0].name`. Also fixes
   * browser bugs in replacement text syntax when performing a replacement using a nonregex search
   * value, and the value of a replacement regex's `lastIndex` property during replacement
   * iterations and upon completion. Note that this doesn't support SpiderMonkey's proprietary third
   * (`flags`) argument.
   * @param {RegExp|string} search Search pattern to be replaced.
   * @param {string|Function} replacement Replacement string or a function invoked to create it.
   * @return {string} New string with one or all matches replaced.
   * @private
   */
  fixed.replace = function(search, replacement) {
    var isRegex = self.isRegExp(search);
    var captureNames;
    var result;
    var str;
    var origLastIndex;

    if (isRegex) {
      if (search.xregexp) {
        captureNames = search.xregexp.captureNames;
      }

      if (!search.global) {
        origLastIndex = search.lastIndex;
      }
    } else {
      search += "";
    }

    if (isType(replacement, "function")) {
      result = String(this).replace(search, function() {
        var args = arguments;

        if (captureNames) {
          // Change the `arguments[0]` string primitive to a `String` object that can store properties
          args[0] = new String(args[0]);

          // Store named backreferences on the first argument
          for (var i = 0; i < captureNames.length; ++i) {
            if (captureNames[i]) {
              args[0][captureNames[i]] = args[i + 1];
            }
          }
        }

        // Update `lastIndex` before calling `replacement`.
        // Fixes IE, Chrome, Firefox, Safari bug (last tested IE 9, Chrome 17, Firefox 11,
        // Safari 5.1)
        if (isRegex && search.global) {
          search.lastIndex = args[args.length - 2] + args[0].length;
        }

        return replacement.apply(null, args);
      });
    } else {
      str = String(this); // Ensure `args[args.length - 1]` will be a string when given nonstring `this`
      result = str.replace(search, function() {
        var args = arguments; // Keep this function's `arguments` available through closure

        return String(replacement).replace(replacementToken, function($0, $1, $2) {
          // Named or numbered backreference with curly brackets
          if ($1) {
            /*
             * npf.regExp behavior for `${n}`: 1. Backreference to numbered capture, where `n`
             * is 1+ digits. `0`, `00`, etc. is the entire match. 2. Backreference to named
             * capture `n`, if it exists and is not a number overridden by numbered capture.
             * 3. Otherwise, it's an error.
             */
            var n = +$1; // Type-convert; drop leading zeros

            if (n <= args.length - 3) {
              return args[n] || "";
            }

            n = captureNames ? goog.array.lastIndexOf(captureNames, $1) : -1;

            if (n < 0) {
              throw new SyntaxError("backreference to undefined group " + $0);
            }

            return args[n + 1] || "";
          }

          // Else, special variable or numbered backreference (without curly brackets)
          if ($2 === "$") return "$";
          if ($2 === "&" || +$2 === 0) return args[0]; // $&, $0 (not followed by 1-9), $00
          if ($2 === "`") return args[args.length - 1].slice(0, args[args.length - 2]);
          if ($2 === "'") return args[args.length - 1].slice(args[args.length - 2] + args[0].length);
          // Else, numbered backreference (without curly brackets)
          $2 = +$2; // Type-convert; drop leading zero
          /*
           * npf.regExp behavior: - Backreferences without curly brackets end after 1 or 2
           * digits. Use `${..}` for more digits. - `$1` is an error if there are no
           * capturing groups. - `$10` is an error if there are less than 10 capturing
           * groups. Use `${1}0` instead. - `$01` is equivalent to `$1` if a capturing group
           * exists, otherwise it's an error. - `$0` (not followed by 1-9), `$00`, and `$&`
           * are the entire match. Native behavior, for comparison: - Backreferences end
           * after 1 or 2 digits. Cannot use backreference to capturing group 100+. - `$1`
           * is a literal `$1` if there are no capturing groups. - `$10` is `$1` followed by
           * a literal `0` if there are less than 10 capturing groups. - `$01` is equivalent
           * to `$1` if a capturing group exists, otherwise it's a literal `$01`. - `$0` is
           * a literal `$0`. `$&` is the entire match.
           */
          if (!isNaN($2)) {
            if ($2 > args.length - 3) {
              throw new SyntaxError("backreference to undefined group " + $0);
            }

            return args[$2] || "";
          }

          throw new SyntaxError("invalid token " + $0);
        });
      });
    }

    if (isRegex) {
      if (search.global) {
        search.lastIndex = 0; // Fixes IE, Safari bug (last tested IE 9, Safari 5.1)
      } else {
        search.lastIndex = origLastIndex; // Fixes IE, Opera bug (last tested IE 9, Opera 11.6)
      }
    }

    return result;
  };

  /**
   * Fixes browser bugs in the native `String.prototype.split`.
   * @param {RegExp|string} separator Regex or string to use for separating the string.
   * @param {number=} limit Maximum number of items to include in the result array.
   * @return {Array} Array of substrings.
   * @private
   */
  fixed.split = function(separator, limit) {
    if (!self.isRegExp(separator)) {
      return this.split(separator, limit); // use faster native method
    }

    var str = String(this);
    var origLastIndex = separator.lastIndex;
    var output = [];
    var lastLastIndex = 0;
    var lastLength;

    /*
     * Values for `limit`, per the spec: If undefined: pow(2,32) - 1 If 0, Infinity, or NaN: 0 If
     * positive number: limit = floor(limit); if (limit >= pow(2,32)) limit -= pow(2,32); If
     * negative number: pow(2,32) - floor(abs(limit)) If other: Type-convert, then use the above
     * rules
     */
    limit = (goog.isDef(limit) ? limit : -1) >>> 0;

    self.forEach(str, /** @type {RegExp} */ (separator), function(match) {
      if ((match.index + match[0].length) > lastLastIndex) { // != `if (match[0].length)`
        output.push(str.slice(lastLastIndex, match.index));
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = match.index + lastLength;
      }
    });

    if (lastLastIndex === str.length) {
      if (!separator.test("") || lastLength) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }

    separator.lastIndex = origLastIndex;

    return output.length > limit ? output.slice(0, limit) : output;
  };

  /*--------------------------------------
   *  Built-in tokens
   *------------------------------------*/

  /*
   * Letter identity escapes that natively match literal characters: \p, \P, etc. Should be
   * SyntaxErrors but are allowed in web reality. npf.regExp makes them errors for cross-browser
   * consistency and to reserve their syntax, but lets them be superseded by npf.regExp addons.
   */
  addToken( /\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4})|x(?![\dA-Fa-f]{2}))/, function(match, scope) {
    // \B is allowed in default scope only
    if (match[1] === "B" && scope === defaultScope) {
      return match[0];
    }

    throw new SyntaxError("invalid escape " + match[0]);
  }, {
    scope : "all"
  });

  /*
   * Empty character class: [] or [^] Fixes a critical cross-browser syntax inconsistency. Unless
   * this is standardized (per the spec), regex syntax can't be accurately parsed because character
   * class endings can't be determined.
   */
  addToken(/\[(\^?)]/, function(match) {
    // For cross-browser compatibility with ES3, convert [] to \b\B and [^] to [\s\S].
    // (?!) should work like \b\B, but is unreliable in Firefox
    return match[1] ? "[\\s\\S]" : "\\b\\B";
  });

  /*
   * Comment pattern: (?# ) Inline comments are an alternative to the line comments allowed in
   * free-spacing mode (flag x).
   */
  addToken(/(?:\(\?#[^)]*\))+/, function(match) {
    // Keep tokens separated unless the following token is a quantifier
    return quantifier.test(match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
  });

  /*
   * Named backreference: \k<name> Backreference names can use the characters A-Z, a-z, 0-9, _, and $
   * only.
   */
  addToken(/\\k<([\w$]+)>/, function(match) {
    var index = isNaN(match[1]) ? (goog.array.lastIndexOf(this.captureNames, match[1]) + 1) : +match[1], endIndex = match.index + match[0].length;

    if (!index || index > this.captureNames.length) {
      throw new SyntaxError("backreference to undefined group " + match[0]);
    }

    // Keep backreferences separate from subsequent literal numbers
    return "\\" + index + (endIndex === match.input.length || isNaN(match.input.charAt(endIndex)) ? "" : "(?:)");
  });

  /*
   * Whitespace and line comments, in free-spacing mode (aka extended mode, flag x) only.
   */
  addToken(/(?:\s+|#.*)+/, function(match) {
    // Keep tokens separated unless the following token is a quantifier
    return quantifier.test(match.input.slice(match.index + match[0].length)) ? "" : "(?:)";
  }, {
    trigger : function() {
      return this.hasFlag("x");
    },
    customFlags : "x"
  });

  /*
   * Dot, in dotall mode (aka singleline mode, flag s) only.
   */
  addToken(/\./, function() {
    return "[\\s\\S]";
  }, {
    trigger : function() {
      return this.hasFlag("s");
    },
    customFlags : "s"
  });

  /*
   * Named capturing group; match the opening delimiter only: (?<name> Capture names can use the
   * characters A-Z, a-z, 0-9, _, and $ only. Names can't be integers. Supports Python-style (?P<name>
   * as an alternate syntax to avoid issues in recent Opera (which natively supports the
   * Python-style syntax). Otherwise, npf.regExp might treat numbered backreferences to Python-style
   * named capture as octals.
   */
  addToken(/\(\?P?<([\w$]+)>/, function(match) {
    if (!isNaN(match[1])) {
      // Avoid incorrect lookups, since named backreferences are added to match arrays
      throw new SyntaxError("can't use integer as capture name " + match[0]);
    }
    this.captureNames.push(match[1]);
    this.hasNamedCapture = true;
    return "(";
  });

  /*
   * Numbered backreference or octal, plus any following digits: \0, \11, etc. Octals except \0 not
   * followed by 0-9 and backreferences to unopened capture groups throw an error. Other matches are
   * returned unaltered. IE <= 8 doesn't support backreferences greater than \99 in regex syntax.
   */
  addToken(/\\(\d+)/, function(match, scope) {
    if (!(scope === defaultScope && /^[1-9]/.test(match[1]) && +match[1] <= this.captureNames.length) && match[1] !== "0") {
      throw new SyntaxError("can't use octal escape or backreference to undefined group " + match[0]);
    }

    return match[0];
  }, {
    scope : "all"
  });

  /*
   * Capturing group; match the opening parenthesis only. Required for support of named capturing
   * groups. Also adds explicit capture mode (flag n).
   */
  addToken(/\((?!\?)/, function() {
    if (this.hasFlag("n")) {
      return "(?:";
    }
    this.captureNames.push(null);
    return "(";
  }, {
    customFlags : "n"
  });

  return self;
}());
