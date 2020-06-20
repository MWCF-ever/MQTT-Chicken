const path = require('path');
const fs = require('fs');

class HomeCtl {
    async index(ctx) {
        const template = fs.readFileSync(path.resolve(__dirname, '../views/test.html'))
        ctx.type = 'html'
        ctx.body = template
  }
}

module.exports = new HomeCtl();
