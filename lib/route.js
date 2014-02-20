"use strict";
/* -------------------------------------------------------------------
 * Require Statements << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

var allMethods = require('./all-methods.js');

/* =============================================================================
 * 
 * Route Class
 *  
 * ========================================================================== */

var _paramRegex = /:[^\/]+/g;

module.exports = Route;

function Route (methods, name, pattern, handlers) {
  /* -------------------------------------------------------------------
   * Private Members Declaration << no methods >>
   * ---------------------------------------------------------------- */
  
  var _this = this;
  var _origPattern = pattern instanceof RegExp ? pattern : String(pattern);

  /* -------------------------------------------------------------------
   * Public Members Declaration << no methods >>
   * ---------------------------------------------------------------- */
  
  this.name = name;
  this.methods = {};
  this.pattern = null;
  this.params = [];
  this.handlers = handlers;

  /* -------------------------------------------------------------------
   * Public Methods << Keep in alphabetical order >>
   * ---------------------------------------------------------------- */
  
  if (_origPattern instanceof RegExp) {
    this.buildPath = function () { throw new Error('Cannot generate path. Original path was a regular expression.'); };
  }
  else {
    this.buildPath = function (params) {
      if (!params || typeof params !== 'object')
        params = Array.prototype.slice.call(arguments);
      
      var arr = params instanceof Array;
      var i = 0;
      var key;
      return _origPattern.replace(_paramRegex, function (match) {
        key = arr ? i : match.substr(1);
        if (!(key in params))
          throw new Error('Cannot generate path. Missing param ' + match.substr(1));

        i++;
        return encodeURIComponent(params[key]);
      });
    };
  }
  
  /* -------------------------------------------------------------------
   * Initialization
   * ---------------------------------------------------------------- */

  // build the verb matching pattern
  var m;
  for (var i in methods) {
    m = methods[i].toUpperCase();
    if (m === 'ALL' || m === '*') {
      this.methods = allMethods.copy();
      break;
    }
    this.methods[m] = true;
  }

  // build url matching pattern
  if (!(pattern instanceof RegExp)) {
    pattern = regEscape(pattern).replace(_paramRegex, function (param) {
      _this.params.push(param.substr(1));
      return '([^\\/]+)';
    });

    pattern = new RegExp('^' + pattern + '$', 'i');
  }

  this.pattern = pattern;
}

/* -------------------------------------------------------------------
 * Public Prototype Methods << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

Route.prototype.matchMethod = function (method) {
  return this.methods[method] || false;
};

Route.prototype.matchPath = function (path) {
  var match = this.pattern.exec(path);
  if (!match)
    return false;
  
  var params = {};
  var name;
  for (var i = 0; i + 1 < match.length; i++) {
    name = i in this.params ? this.params[i] : i;
    params[name] = decodeURIComponent(match[i + 1]);
  }
  
  return params;
};

/* -------------------------------------------------------------------
 * Helper Methods << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

function regEscape(str) {
  // essentially stolen from https://github.com/component/escape-regexp with a modified replacer
  return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, function (match, paren, index, orig) {
    if (match === ':' && orig[index + 1] !== '/')
      return match;
    
    // if star, it's a wildcard if only enclosed by forward slashes (or at start or end of string)
    if (match === '*' && (index === 0 || orig[index - 1] === '/') && (index + 1 === orig.length || orig[index + 1] === '/'))
      return '.*';
    
    return '\\' + match;
  });
}
