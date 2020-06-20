//const jwt = require('koa-jwt');
const Router = require('koa-router');
const router = new Router({ prefix: '/users' });
const { create, login, getUserInfo, findById, delete: del } = require('../controllers/users');
//const { secret } = require('../config');

//get user's informatin from token
//const auth = jwt({ secret });

router.post('/', create); // register
router.post('/login', login); // login
router.get('/', findById);
//router.delete('/:id', auth, checkOwner, del)


module.exports = router;
