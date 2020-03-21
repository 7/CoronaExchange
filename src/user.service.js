const UserModel = require('./user.model')

class UserService {
  addUser(userDto) {
    const user = new UserModel(userDto)
    return user.save()
  }

  async getUsers() {
    const users = await UserModel.find();
    return users
      .map(user => user.toJSON())
  }
}

module.exports = UserService
