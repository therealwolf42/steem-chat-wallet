import lowdb from 'lowdb'
var fs = require('fs');
var dir = () => {
  let path = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
  path = path + '/steemmessenger'
  if(!fs.existsSync(path)) {
    fs.mkdirSync(path)
  }
  if (!fs.existsSync(path + '/db')){
    fs.mkdirSync(path + '/db')
  }
 return path + '/db/global.json'
}

const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync(dir())
const db = lowdb(adapter)
db.defaults({
  username: '',
  accounts:[],
  settings: {
    use_smartsteem_blacklist: true,
    default_currency: 'SBD',
    use_encrypt: true,
    decrypt: true,
    default_amount: 0.001,
    interval: 10,
    timeout: 60
  },
  agreedTerms:false,
  blacklist: [],
  smartsteem_blacklist: [],
  current_node: 'https://rpc.buildteam.io',
  version: '0.1.0'
}).write()

//db.get('transfers').reverse('time').value()


//db.set('user.memo', 'K5asdadsd2d')
//  .write()

export default db