import lowdb from 'lowdb'
const fs = require('fs')
var dir = (name) => {
  let path = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
  path = path + '/steemmessenger'
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  if (!fs.existsSync(path + '/db/users')){
    fs.mkdirSync(path + '/db/users')
  }
 return `${path}/db/users/${name}.json`
}

import { remote } from 'electron'

const FileSync = require('lowdb/adapters/FileSync')


const db_user = (name) => {
  let adapter = new FileSync(dir(name))
  let db = lowdb(adapter)
  db.defaults({
    name,
    last_transfer_num: 0,
    memo_key: '',
    active_key: '',
    transfers: [],
    hidelist: [],
    global_last_transfer: 0,
    notifications: []
  }).write()
  return db
}

export default db_user