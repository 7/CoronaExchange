const DatabaseService = require('./src/database.service');
const UserService = require('./src/user.service');

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const userService = new UserService()

const init = async () => {
  await DatabaseService.init()

  express()
    .use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => res.render('pages/index'))
    .get('/api/user', async (req, res) => res.send(await userService.getUsers()))
    .post('/api/user', async (req, res) => {
      await userService.addUser({username: Math.random()+'', password: 'secret', email: 'test@test.local'})
      return res.send({message: 'User added'})
    })
    .listen(PORT, () => console.log(`Listening on ${PORT}`))
}

init();
