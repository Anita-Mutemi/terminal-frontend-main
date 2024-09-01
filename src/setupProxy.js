const proxy = require('http-proxy-middleware').createProxyMiddleware;

module.exports = function (app) {
  app.use(
    [
      '/v1/feed',
      '/token',
      '/users/me',
      '/v1/feed/history',
      '/v1/projects',
      '/v1/projects/favourites',
      '/v1/projects/rating',
      '/v1/projects/:id/comments',
    ],
    proxy({
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
    }),
  );
};
