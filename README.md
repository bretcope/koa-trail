# koa-trail

Trail is a router for [koa](https://github.com/koajs/koa) with the option to explicitly execute multiple routes on a single request (similar to express routing).

For example, instead of:

```javascript
var koa = require('koa');
var trail = require('koa-trail');

var app = koa();
app.use(trail(app));

function authenticate *(next) {
  // ... authenticate the API token
  if (!user)
    this.throw(403, 'API Token Invalid');
  else
    yield next
}

// chain the authenticate on every route 
app.get('/api/users', authenticate, apiController.getUsers);
app.get('/api/profile/:userId', authenticate, apiController.getProfile);
app.get('/api/page/:pageId', authenticate, apiController.getPage);
app.put('/api/:contentId/like', authenticate, apiController.likeContent);

app.listen(3000);
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

_More documentation and features will be coming soon... this is a work in progress._