const mongoose = require('mongoose')

class DatabaseService {
  static async init() {
    if (!DatabaseService._instance) {
      const url = this._getUrl()
      this._instance = await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    }
    return this._instance
  }

  static _getUrl() {
    const config = {
      DATABASE_USER: 'user',
      DATABASE_PASSWORD: 'password',
      DATABASE_PORT: 27017,
      DATABASE_NAME: 'corona_exchange'
    }
    return `mongodb://localhost:${config.DATABASE_PORT}/${config.DATABASE_NAME}`
  }
}

module.exports = DatabaseService
