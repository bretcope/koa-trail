# koa-trail

* [Usage](#usage)
    * [Installation](#installation)
    * [Setup](#setup)
    * [Setup](#setup)
    * [Route Chaining](#route-chaining)
    * [Named Routes](#named-routes)
    * [Route Parameters](#route-parameters)
    * [Wildcard Routes](#wildcard-routes)
    * [Router Methods](#router-methods)
        * [register](#router-register)
        * [VERB](#router-verb)
        * [all](#router-all)
        * [url](#router-url)
        * [finally](#router-finally)
* [License](#license)

Trail is a router for [koa](https://github.com/koajs/koa) with the option to explicitly execute multiple routes on a single request (similar to express routing).

For example, assume we have an authenticate middleware function which should run on every `/api/*` route. Instead of:

```javascript
// chain the authenticate on every route 
app.get('/api/users', authenticate, apiController.getUsers);
app.get('/api/profile/:userId', authenticate, apiController.getProfile);
app.get('/api/page/:pageId', authenticate, apiController.getPage);
app.put('/api/:contentId/like', authenticate, apiController.likeContent);
```

We can simply apply the authentication handler once on a wildcard route:

```javascript
app.all('/api/*', authenticate);

// the above route will be called before of any of the below routes matching /api/*
// therefore, we don't need to explicitly chain it on each route.

app.get('/api/users', apiController.getUsers);
app.get('/api/profile/:userId', apiController.getProfile);
app.get('/api/page/:pageId', apiController.getPage);
app.put('/api/:contentId/like', apiController.likeContent);
```

This reduces chaining on individual routes, and may improve security since there is less likelihood of a developer forgetting to add important security middleware on certain routes.

This middleware is largely inspired by [koa-router](https://github.com/alexmingoia/koa-router). The reason for building a new router is that they [explicitly decided](https://github.com/alexmingoia/koa-router/pull/41) not to allow the route chaining behavior outlined above.

<a name="usage"></a>
## Usage

<a name="installation"></a>
### Installation

   npm install koa-trail

<a name="setup"></a>
### Setup

```javascript
var koa = require('koa');
var trail = require('koa-trail');

var app = koa();
app.use(trail(app));

//now we can attach routes
app.get('/users', function *(next) {
  // ...
});

app.post('/users', function *(next) {
  // ...
});
```


When `app` is passed as a parameter to trail, it creates a method on the `app` for [every http method](#router-verb) (get, post, put, delete, etc), plus [app.all](#router-all), [app.register](#router-register), and [app.url](#router-url). If you would prefer not to "pollute" the `app` object with these methods, you may initialize a router object without passing the app parameter.

```javascript
var koa = require('koa');
var trail = require('koa-trail');

var app = koa();
var router = new trail();

// pass the router.handler object, not the router object itself
app.use(router.handler); 

// now attach routes to the router object instead of app
router.get('/users', function *(next) {
  // ...
});

router.post('/users', function *(next) {
  // ...
});
```

<a name="route-chaining"></a>
### Route Chaining

<a name="named-routes"></a>
### Named Routes

Routes can be named which makes them 

<a name="route-parameters"></a>
### Route Parameters

<a name="wildcard-routes"></a>
### Wildcard Routes

<a name="router-methods"></a>
### Router Methods

<a name="router-register"></a>
#### register

<a name="router-verb"></a>
#### VERB

<a name="router-all"></a>
#### all

<a name="router-url"></a>
#### url

<a name="router-finally"></a>
#### finally

<a name="license"></a>
## License

[MIT](https://github.com/bretcope/koa-trail/raw/master/LICENSE.MIT)