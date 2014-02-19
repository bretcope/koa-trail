"use strict";
/* -------------------------------------------------------------------
 * Require Statements << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

var methods = require('methods');

/* =============================================================================
 * 
 * Helper module for generating a hash of all HTTP methods
 *  
 * ========================================================================== */

var allMethods = module.exports = copy(true);

Object.defineProperty(allMethods, 'copy', { enumerable: false, writable: false, value: copy });
Object.freeze(allMethods);

function copy (lowerCase) {
  var all = {};
  for (var i in methods)
    all[lowerCase ? methods[i] : methods[i].toUpperCase()] = true;
  
  return all;
}
