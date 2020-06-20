const Router = require('koa-router');
const router = new Router;
const { index } = require('../controllers/home');
const fs = require('fs');




router.get('/', index);
router.get('/', )
//router.post('/upload', upload);

module.exports = router;