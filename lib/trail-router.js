"use strict";
/* -------------------------------------------------------------------
 * Require Statements << Keep in alphabetical order >>
 * ---------------------------------------------------------------- */

var allMethods = require('./all-methods.js');
var Route = require('./route.js');

/* =============================================================================
 * 
 * TrailRouter Class
 *  
 * ========================================================================== */

var UNKNOWN_PREFIX = '$unnamed-route-';

module.exports = TrailRouter;

function TrailRouter (app) {
  if (!(this instanceof TrailRouter))
    return new TrailRouter(app).handler;
  
  /* -------------------------------------------------------------------
   * Private Members Declaration << no methods >>
   * ---------------------------------------------------------------- */

  var _this = this;
  
  var _nextUnnamedId = 1;
  var _routes = {};
  var _routesOrder = [];

  /* -------------------------------------------------------------------
   * Public Members Declaration << no methods >>
   * ---------------------------------------------------------------- */

  //

  /* -------------------------------------------------------------------
   * Public Methods << Keep in alphabetical order >>
   * ---------------------------------------------------------------- */

  _this.handler = function *(next) {
//    console.log(this.path);
    
    yield dispatch(0, this);
    yield next;
  };
  
  _this.register = function (methods, name, pattern, handler /*, handler2, ... */) {
    // parse arguments
    if (!(methods instanceof Array))
      methods = [ methods ];

    var i = 3; // the latest index where handlers could start
    if (typeof pattern === 'function') {
      pattern = name;
      name = UNKNOWN_PREFIX + _nextUnnamedId++;
      i--;
    }
    
    var handlers = [];
    for (; i < arguments.length; i++) {
      if (typeof arguments[i] === 'function')
        handlers.push(arguments[i]);
    }
    
    var route = new Route(methods, name, pattern, handlers);
    if (_routes[name]) {
      var r = _routes[name];
      _routesOrder.splice(_routesOrder.indexOf(r), 1);
    }
    
    _routes[name] = route;
    _routesOrder.push(route);
  };

  /* -------------------------------------------------------------------
   * Private Methods << Keep in alphabetical order >>
   * ---------------------------------------------------------------- */

  function *dispatch (startingIndex, context) {
    var params, r;
    for (var i = startingIndex; i < _routesOrder.length; i++) {
      r = _routesOrder[i];
      
      if (r.matchMethod(context.method) && (params = r.matchPath(context.path))) {
        context.params = params;
        context.name = r.name;
        var invoked = [];
        var handlerInvoke = function *(index) {
//          console.log('invoke ' + r.name + ' ' + index);
          if (invoked.indexOf(index) !== -1)
            return;
          
          invoked.push(index);
          if (index < r.handlers.length) {
            yield r.handlers[index].call(context, function *() { yield handlerInvoke(index + 1); });
          }
          else {
            yield dispatch(i + 1, context);
          }
        };
        
        yield handlerInvoke(0);
        
        return;
      }
    }
  }

  /* -------------------------------------------------------------------
   * Initialization
   * ---------------------------------------------------------------- */

  // attach all HTTP methods
  var f;
  for (var m in allMethods) {
    f = _this.register.bind(null, m);
    
    _this[m] = f;
    if (app)
      app[m] = f;
  }
  
  f = _this.register.bind(null, 'all');
  _this.all = f;
  if (app) {
    app.all = f;
    app.register = _this.register;
  }
}