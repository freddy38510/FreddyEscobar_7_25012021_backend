const express = require('express');

const router = express.Router();

const routes = [
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
