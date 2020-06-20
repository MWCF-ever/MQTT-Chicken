const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/user');
const { secret } = require('../config');

class UsersCtl {
    async create(ctx) {
      ctx.verifyParams({
        name: { type: 'string', required: true },
        password: { type: 'string', required: true },
      });
      const { name } = ctx.request.body;
      const repeatedUser = await User.findOne({ name });
      if (repeatedUser) {
        ctx.throw(409, 'user already exist');
      }
      const user = await new User(ctx.request.body).save();
      ctx.body = user;
    }
    async findById(ctx) {
      const user = await User.findById(ctx.params.id);
      if (!user) {ctx.throw(404, 'User not found');}
      ctx.body = user;
    }
    async checkOwner(ctx, next) {
      if (ctx.params.id !== ctx.state.user._id) { ctx.throw(403, '没有权限'); }
      await next();
    }
    // Get the user information 
    async getUserInfo(ctx) {
      const { name } = ctx.state.user;
      ctx.body = { name };
    }
  
    async login(ctx) {
      //verify the username and password
      ctx.verifyParams({
        name: { type: 'string', required: true },
        password: { type: 'string', required: true },
      });
       //find the first user match the requirment
      const user = await User.findOne(ctx.request.body);
      if (!user) {
        ctx.throw(401, 'name or password incorrect');
      }
      const { _id, name } = user;
      //use signature algorithm to get token
      const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' });
      ctx.body = { token, name };
    }
    async delete(ctx) {
      const user = await User.findByIdAndRemove(ctx.params.id);
      if ( ! user) { ctx.throw(404, 'User does not exits');}
      ctx.status = 204;
    }
  }
  
  module.exports = new UsersCtl();