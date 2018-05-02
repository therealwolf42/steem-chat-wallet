import Vue from 'vue'
import * as _ from 'lodash'
import { remote } from 'electron'
import * as axios from 'axios'

import db from '../../db'
import db_user from '../../db_user'
import * as moment from 'moment'
import Message from '../../components/_message'
const fs = require('fs')
import path from 'path'

import { WSAETIMEDOUT } from 'constants'
import { Store } from 'vuex'


const { version } = require('../../../../package.json')

var interval = null
var interval_lock = null

const steem = require('steem')
const dsteem = require('dsteem')
const nodes = ['https://rpc.buildteam.io', 'https://api.steemit.com', 'https://steemd.pevo.science', 'https://steemd.privex.io', 'https://gtg.steem.house:8090', 'https://steemd.minnowsupportproject.org', 'https://rpc.steemliberator.com', 'https://api.steem.house']
var current_node = nodes[0]

var client = (node, timeout = 10) => {
  node = !node ? current_node : node
  return new dsteem.Client(node, { timeout: timeout * 1000 })
}

var is_updating_transfers = false


const state = {
  accounts: [],
  username: '',
  settings: {
    use_smartsteem_blacklist: true,
    default_currency: 'SBD',
    use_encrypt: true,
    decrypt: true,
    default_amount: 0.001,
    interval: 10,
    timeout: 60
  },
  account: {},
  transfers: [],
  users: [],
  active_key: '',
  active_key_decrypted: '',
  memo_key: '',
  memo_key_decrypted: '',
  selected_user: {},
  blacklist: [],
  smartsteem_blacklist: [],
  hidelist: [],
  showSettings: false,
  current_node: nodes[0],
  nodes: nodes,
  unlocked: false,
  clicked_unlock: false,
  notifications: [],
  notifications_users: [], //main_user: STRING, count: INT
  global_last_transfer: 0
}

const actions = {
  unlock: async ({ commit, state, dispatch }, { key, key_auths }) => {
    let account = await dispatch('getSteemAccount', state.username)
    let memo_valid = true
    let active_valid = true
    if (state.memo) memo_valid = await dispatch('testKey', { key: state.memo, key_auths: [[account.memo_key, 1]] })

    if (this.active) active_valid = await dispatch('testKey', { key: this.active, key_auths: account.active.key_auths })

    if (active_valid && memo_valid) {

    }
  },
  testKey: async ({ commit, state }, { key, key_auths }) => {
    try {
      if (!key) return false

      let pub = steem.auth.wifToPublic(key)
      let filter = key_auths.filter(x => x[0] === pub)
      return filter.length > 0
    } catch (e) {
      console.error(e)
      this.clicked = false
      return false
    }
  },
  deleteUserDB: async ({ commit, state, dispatch }, name) => {
    let path = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
    path = `${path}/steemmessenger/db/users/${name}.json`
    if (fs.existsSync(path)) fs.unlinkSync(path)

  },
  initializeData: async ({ commit, state, dispatch }, payload) => {
    let global = db.value()
    let response = axios.get(`https://smartsteem.com/api/general/smartchat`)
      .then(response => {
        if (response) {
          let blacklist = response.data.blacklist
          let sm_version = response.data.version
          if (sm_version > version) commit('newVersion', true)
          commit('setSmartsteemBlacklist', blacklist)

        }
      })

    if (version > global.version) {
      Object.keys(state.settings).forEach(state_setting => {
        let is_new = true
        for (let db_setting in global.settings) {
          if (state_setting === db_setting) {
            is_new = false
            break
          }
        }
        if (is_new) global.settings[state_setting] = state.settings[state_setting]
      })
      commit('setVersion', version)
    }

    commit('setSettings', global.settings)
    commit('setBlacklist', global.blacklist)
    commit('setAgreedTerms', global.agreedTerms)
    commit('setCurrentNode', global.current_node)
  },
  initializeUser: async ({ commit, state, dispatch }, { first = false }) => {
    let user = db_user(state.username).value()
    commit('setUser', user)
    let transfers = user.transfers
    if (!transfers || transfers.length <= 0) {
      commit('setLastTransferNum', 0)
    } else {
      commit('setTransfersDB', transfers)
    }
    if (transfers.length > 0) {
      if (state.settings.use_smartsteem_blacklist) transfers = transfers.filter(x => !state.smartsteem_blacklist.includes(x.main_user))
      transfers = transfers.filter(x => !state.blacklist.includes(x.main_user))
    }

    await commit('setTransfers', { transfers, updating: false })
    await dispatch('updateTransfers', { first })
    commit('updateSelectedUser', state.selected_user)
    commit('removeNotification', { main_user: state.selected_user.main_user })
    commit('setBadge')

    clearInterval(interval)
    let interval_number = !state.settings.interval || state.settings.interval < 1 ? 2 : state.settings.interval

    interval = setInterval(async function () {
      if (!is_updating_transfers) {
        await dispatch('updateTransfers', { first })
        commit('updateSelectedUser', state.selected_user)
      }
    }, 1000 * 60 * interval_number)

  },
  changeUser: async ({ commit, state, dispatch }, { name }) => {
    try {
      commit('setUnlocked', false)
      commit('setClickedUnlock', false)
      if (name) {
        dispatch('initializeUser', { first: true })
      }

      return true
    } catch (e) {
      Message.error(e.message)
      return false
    }
  },
  transfer: async ({ commit, state }, payload) => {
    try {
      let { amount, asset, memo } = payload
      amount = dsteem.Asset.from(amount, asset)
      let from = state.username
      let to = state.selected_user.main_user
      let active_key = dsteem.PrivateKey.from(state.active_key_decrypted)
      await client(state.current_node, 60).broadcast.transfer({ from, to, amount, memo }, active_key)
      Message.success('Send Message')
      return true
    } catch (error) {
      Message.error(error.message)
      return false
    }
  },
  decodeAllTransfers: async ({ commit, state, dispatch }, memo) => {
    console.log('decoding all transfers')
    let transfers = state.transfers
    if (!state.selected_user || state.selected_user.transfers.length <= 0) return
    commit('decodeAllTransfers', transfers)
    commit('setTransfersDB', state.transfers)
    commit('setTransfers', { transfers: state.transfers, updating: false })
  },
  decode: async ({ commit, state, dispatch }, memo) => {
    //let memo_key = state.account.memo_key#
    try {
      if (!memo) return ''
      if (!state.memo_key_decrypted) return memo
      let decoded = memo.substring(0, 1) === '#' && memo.length > 80 && !memo.substring(0, 50).includes(' ') ? steem.memo.decode(state.memo_key_decrypted, memo) : ''
      return decoded
    } catch (e) {
      console.error(`Decoding`, e)
      return ''
    }
  },
  getSteemAccount: async ({ commit, state, dispatch }, name) => {
    try {
      if (name.length < 3 && name.length > 0) { return false }
      let acc = await client(state.current_node).database.getAccounts([name])
      return acc[0]
    } catch (error) {
      console.error('getSteemAccount', error)
      return {}
    }
  },

  updateTransfers: async ({ commit, state, getters, dispatch }, { first, retries = 0, whole_history = false }) => {
    try {
      if (!state.username) return []
      if (is_updating_transfers) return []
      is_updating_transfers = true
      let transfers = []
      let last_transfer_num = state.last_transfer_num | 0

      let transactions = []
      
      // Recursive transfer fetching not yet working
      /*if (whole_history && (last_transfer_num > 0 && last_transfer_num > 10000)) {
        let fetched_all = false
        let start = last_transfer_num
        while (!fetched_all) {
          let new_trans = await client(state.current_node).database.call('get_account_history', [state.username, start, start >= 10000 ? 10000 : start])
          transactions = transactions.concat(new_trans)
          start -= 10000
          if (start <= 0 || new_trans.length < 10000) {
            console.log('start at 0 or length under 10000')
            fetched_all = true
            break
          }

        }
        console.log(transactions)
      } else {*/
      transactions = await client(state.current_node).database.call('get_account_history', [state.username, -1, first ? 10000 : 2000])
      //}

      if (transactions.length <= 0) return state.transfers

      transactions = _.orderBy(transactions, [0], ['desc'])
      let notifications = state.notifications
      let notif_count = 0

      let last_num = transactions[transactions.length - 1][0]

      let win = remote.getCurrentWindow()
      let dock = remote.app.dock // Badge works only on Mac

      let window_visible = true
      if (process.platform === 'darwin') {
        window_visible = dock && win.isFocused()
      } else {
        window_visible = document.visibilityState !== 'hidden'
      }

      for await (const trx of transactions) {
        if (trx[0] <= last_transfer_num && !whole_history) {
          break
        }
        let type = trx[1].op[0]
        let data = trx[1].op[1]

        if (type === 'transfer' && (trx[0] > last_transfer_num || whole_history)) {
          if (state.transfers.filter(x => x.number === trx[0]).length > 0) continue

          let amount_arr = data.amount.split(" ")

          let time_value = moment.utc(trx[1].timestamp).valueOf()
          let main_user = data.from === state.username ? data.to : data.from

          let decoded = await dispatch('decode', data.memo)
          let transfer = { number: trx[0], id: trx[1].trx_id, time: trx[1].timestamp, time_value, main_user, from: data.from, to: data.to, amount: amount_arr[0], asset: amount_arr[1], memo: data.memo, decoded }
          transfers.push(transfer)

          if (!first && data.from !== state.username
            && !(state.selected_user.main_user === data.from && window_visible)
            && state.blacklist.indexOf(data.from) === -1
            && state.smartsteem_blacklist.indexOf(data.from) === -1) {
            notif_count += 1
            commit('addNotification', { main_user: data.from })
          }

          if (state.hidelist.indexOf(main_user) > -1) {
            commit('removeHidelistUser', main_user)
          }
        }
      }

      if (last_num > last_transfer_num) {
        last_transfer_num = last_num
      } else {
        last_transfer_num = transactions[0][0]
      }

      commit('addTransfers', transfers)
      commit('setTransfersDB', state.transfers)
      commit('setTransfers', { transfers: state.transfers, updating: true })

      commit('setLastTransferNum', last_transfer_num)
      commit('setBadge')
      is_updating_transfers = false
      if (!first) Message.success('Updated Transfers')
      return state.transfers
    } catch (e) {
      Message.error(e.message)
      console.error(e)
      if (e.message.includes('timeout')) {
        retries += 1
        if (retries > 3) {
          is_updating_transfers = false
          return []
        }
        Message.info(`Retrying to update transfers`)
        await dispatch('updateTransfers', { first, retries: retries })
      }
    }
  }
}

const getters = {
  clickedUnlock: state => {
    return state.clicked_unlock
  },
  Unlocked: state => {
    return state.unlocked
  },
  Accounts: state => {
    return state.accounts
  },
  User: state => {
    return state.user
  },
  Username: state => {
    return state.username
  },
  currentAccount: state => {
    return state.account
  },
  currentTransfers: state => {
    return state.transfers
  },
  users: state => {
    return state.users
  },
  selectedUser: state => {
    return state.selected_user
  },
  hidelist: state => {
    return state.hidelist
  },
  blacklist: state => {
    return state.blacklist
  },
  smartsteem_blacklist: state => {
    return state.smartsteem_blacklist
  },
  settings: state => {
    return state.settings
  },
  showSettings: state => {
    return state.showSettings
  },
  memo_key: state => {
    return state.memo_key
  },
  memo_key_decrypted: state => {
    return state.memo_key_decrypted
  },
  active_key: state => {
    return state.active_key
  },
  active_key_decrypted: state => {
    return state.active_key_decrypted
  },
  currentNode: state => {
    return state.current_node
  },
  nodes: state => {
    return state.nodes
  },
  notifications: state => {
    return state.notifications
  },
  global_last_transfer: state => {
    return state.global_last_transfer
  }
}

const mutations = {
  setVersion: (state, version) => {
    db.set('version', version).write()
  },
  setGlobalLastTransfer: (state, last_transfer) => {
    Vue.set(state, 'global_last_transfer', last_transfer)
  },
  setGlobalLastTransferDB: (state, last_transfer) => {
    db_user(state.username).set('global_last_transfer', last_transfer).write()
  },
  setBadge: (state) => {
    let notifications = state.notifications
    if (process.platform === 'win32') {
      let win = remote.getCurrentWindow()
      if (notifications.length <= 0) {
        win.setOverlayIcon(null, '')
      } else {
        notifications = notifications.map(x => x.count).reduce((prev, next) => prev + next);
        if (notifications > 0) {
          let image_path = getImagePath(notifications)
          win.setOverlayIcon(image_path, `${notifications} Notifications`)
        } else {
          win.setOverlayIcon(null, '')
        }
      }
    } else {
      //let dock =  remote.app.dock // Badge works only on Mac
      let app = remote.app
      if (!app) return
      if (notifications.length <= 0) {
        app.setBadgeCount(0)
      } else {
        notifications = notifications.map(x => x.count).reduce((prev, next) => prev + next);
        if (notifications <= 0) {
          app.setBadgeCount(0)
        } else {
          app.setBadgeCount(notifications)
        }
      }


    }
  },
  addNotification: (state, { main_user }) => {
    let index = state.notifications.map(x => x.main_user).indexOf(main_user) //notifications.filter(x => x.main_user === main_user)
    if (index > -1) {
      state.notifications[index].count += 1
    } else {
      state.notifications.push({ main_user, count: 1 })
    }
    Vue.set(state, 'notifications', state.notifications)
    db_user(state.username).set('notifications', state.notifications).write()
  },
  removeNotification: (state, { main_user }) => {
    let index = state.notifications.map(x => x.main_user).indexOf(main_user) //notifications.filter(x => x.main_user === main_user)
    if (index > -1) {
      state.notifications.splice(index, 1)
      Vue.set(state, 'notifications', state.notifications)
      db_user(state.username).set('notifications', state.notifications).write()
    }
  },
  setNotifications: (state, notifications) => {
    Vue.set(state, 'notifications', notifications)
    db_user(state.username).set('notifications', notifications).write()
  },
  addAccount: (state, account) => {
    let found = false
    for (let i = 0; i < state.accounts.length; i++) {
      if (state.accounts[i].name === account.name) {
        state.accounts[i] = account
        found = true
        break
      }
    }

    if (!found) state.accounts.push(account)

    Vue.set(state, 'accounts', state.accounts)
    db.set('accounts', state.accounts).write()
  },
  removeAccount: (state, name) => {
    if (state.username === name) clearInterval(interval)
    let accounts = state.accounts
    let index = -1
    for (let acc of accounts) {
      if (acc.name === name) index = accounts.indexOf(acc)
    }
    if (index > -1) accounts.splice(index, 1)
    Vue.set(state, 'accounts', accounts)
    db.set('accounts', accounts).write()
  },
  setAccounts: (state, accounts) => {
    state.accounts.concat(accounts)
    Vue.set(state, 'accounts', accounts)
  },
  setClickedUnlock: (state, clicked) => {
    if (clicked) clicked = !state.clicked_unlock
    Vue.set(state, 'clicked_unlock', clicked)
  },
  setUnlocked: async (state, unlocked) => {
    Vue.set(state, 'unlocked', unlocked)
  },
  decodeAllTransfers: (state, transfers) => {
    if (!state.memo_key_decrypted) return transfers
    for (let transfer of transfers) {
      try {
        if (!transfer.memo) continue
        let decoded = transfer.memo.substring(0, 1) === '#' && transfer.memo.length > 80 && !transfer.memo.substring(0, 50).includes(' ') ? steem.memo.decode(state.memo_key_decrypted, transfer.memo) : ''
        transfer.decoded = decoded
      } catch (e) {
        console.error(`Decoding`, e.message)
        console.log(transfer.memo)
      }
    }
    Vue.set(state, 'transfers', transfers)
  },
  setUserName: (state, username) => {
    db.set('username', username).write()
    Vue.set(state, 'username', username)
  },
  setCurrentNode: (state, node) => {
    Vue.set(state, 'current_node', node)
  },
  setCurrentNodeDB: (state, node) => {
    db.set('current_node', node).write()
  },
  setHidelist: (state, hidelist) => {
    Vue.set(state, 'hidelist', hidelist)
  },
  setLastTransferNum: (state, last_transfer_num) => {
    db_user(state.username).set('last_transfer_num', last_transfer_num).write()
    Vue.set(state, 'last_transfer_num', last_transfer_num)
  },
  setKeyDecrypted: (state, { key_type, key }) => {
    Vue.set(state, `${key_type}_decrypted`, key)
  },
  setKey: (state, { key_type, key }) => {
    Vue.set(state, key_type, key)
    db_user(state.username).set(key_type, key).write()
  },
  setShowSettings: (state, settings) => {
    Vue.set(state, 'showSettings', !state.showSettings)
  },
  setSetting: (state, { key, value }) => {
    let settings = state.settings
    settings[key] = value
    Vue.set(state, 'settings', settings)
    db.set('settings', settings).write()
  },
  updateSettings: (state, payload) => {
    let settings = state.settings
    Object.keys(payload).forEach(key => {
      settings[key] = payload[key]
    })
    Vue.set(state, 'settings', settings)
    db.set('settings', settings).write()
  },
  setSettings: (state, settings) => {
    Vue.set(state, 'settings', settings)
    db.set('settings', settings).write()
  },
  hideUser: (state, main_user) => {
    let hidelist = db_user(state.username).get('hidelist').value()
    if (hidelist.indexOf(main_user) === -1) {
      hidelist.push(main_user)
      db_user(state.username).set('hidelist', hidelist).write()
      Vue.set(state, 'hidelist', hidelist)
      if (state.users.length > 1) {
        let users = state.users.filter(x => !state.hidelist.includes(x.main_user))
        Vue.set(state, 'users', users)
        let new_selected_user = state.users[0].main_user === main_user ? state.users[1] : state.users[0]
        Vue.set(state, 'selected_user', new_selected_user)
      } else {
        Vue.set(state, 'selected_user', {})
      }
    }
  },
  ignoreUser: (state, main_user) => {
    let blacklist = db.get('blacklist').value()
    if (blacklist.indexOf(main_user) === -1) {
      blacklist.push(main_user)
      db.set('blacklist', blacklist).write()
      Vue.set(state, 'blacklist', blacklist)
      if (state.users.length > 1) {
        let users = state.users.filter(x => !state.blacklist.includes(x.main_user))
        Vue.set(state, 'users', users)
        let new_selected_user = state.users[0].main_user === main_user ? state.users[1] : state.users[0]
        Vue.set(state, 'selected_user', new_selected_user)
      } else {
        Vue.set(state, 'selected_user', {})
      }
    }
  },
  removeHidelistUser: (state, user) => {
    let hidelist = state.hidelist
    let index = hidelist.indexOf(user)
    if (index > -1) {
      hidelist.splice(index, 1)
      Vue.set(state, 'hidelist', hidelist)
      db_user(state.username).set('hidelist', hidelist).write()
    }
  },
  removeBlacklistUser: (state, user) => {
    let blacklist = state.blacklist
    let index = blacklist.indexOf(user)
    if (index > -1) {
      blacklist.splice(index, 1)
      Vue.set(state, 'blacklist', blacklist)
    }
  },
  setBlacklistDB: (state, blacklist) => {
    blacklist = blacklist ? blacklist : state.blacklist
    db.set('blacklist', blacklist).write()
  },
  setBlacklist: (state, blacklist) => {
    Vue.set(state, 'blacklist', blacklist)
  },
  setSmartsteemBlacklist: (state, blacklist) => {
    Vue.set(state, 'smartsteem_blacklist', blacklist)
  },
  resetTransfers: (state) => {
    db_user(state.username).set('transfers', []).write()
    Vue.set(state, 'transfers', [])
    db_user(state.username).set('last_transfer_num', 0).write()
    Vue.set(state, 'last_transfer_num', 0)
    db_user(state.username).set('user', user).write()
    Vue.set(state, 'user', user)
  },
  resetUser: (state) => {
    Vue.set(state, 'username', '')
    Vue.set(state, 'last_transfer_num', 0)
    Vue.set(state, 'memo_key', '')
    Vue.set(state, 'memo_key_decrypted', '')
    Vue.set(state, 'active_key', '')
    Vue.set(state, 'active_key_decrypted', '')
    Vue.set(state, 'transfers', [])
    Vue.set(state, 'hidelist', [])
    Vue.set(state, 'users', [])
    Vue.set(state, 'selected_user', {})
  },
  updateSelectedUser: (state, selected_user) => {
    if (!selected_user) {
      selected_user = state.users.length > 0 ? state.users[0] : {}
    } else {
      selected_user = state.users.filter(x => x.main_user === selected_user.main_user)[0]
    }
    Vue.set(state, 'selected_user', selected_user)
  },
  setSelectedUser: (state, selected_user) => {
    Vue.set(state, 'selected_user', selected_user)
  },
  setUserDB: (state, user) => {
    db_user(state.username).set('user', user).write()
  },
  setTransfersDB: (state, transfers) => {
    db_user(state.username).set('transfers', transfers).write()
  },
  setUser: (state, { username, last_transfer_num, memo_key, active_key, transfers, hidelist, notifications }) => {
    Vue.set(state, 'last_transfer_num', last_transfer_num)
    Vue.set(state, 'memo_key', memo_key)
    Vue.set(state, 'active_key', active_key)
    Vue.set(state, 'transfers', transfers)
    Vue.set(state, 'hidelist', hidelist)
    Vue.set(state, 'notifications', notifications)
  },
  setAccount: (state, { account }) => {
    Vue.set(state, 'account', account)
  },
  addTransfers: (state, transfers) => {
    transfers = state.transfers.concat(transfers)
    Vue.set(state, 'transfers', transfers)
  },
  setTransfers: async (state, { transfers, updating }) => {
    transfers = _.orderBy(transfers, ['time_value'], ['desc'])
    let users = _(transfers)
      .sortBy(['time_value'], ['asc'])
      .groupBy('main_user')
      .toPairs()
      .map((arr) => {
        let i = arr[1].length; return {
          main_user: arr[1][0]['main_user'],
          last_transfer: arr[1][i - 1]['time_value'],
          transfers: arr[1],
          notifications: filter_last_transfer(arr[1], arr[1][0]['main_user'])
        }
      })
      .orderBy(['last_transfer'], ['desc'])
      .value()

    users = users.filter(x => !state.hidelist.includes(x.main_user))
    if (state.settings.use_smartsteem_blacklist) users = users.filter(x => !state.smartsteem_blacklist.includes(x.main_user))
    users = users.filter(x => !state.blacklist.includes(x.main_user))
    Vue.set(state, 'users', users)
    let selected_user = state.selected_user
    if (!selected_user && users.length > 0) {
      selected_user = users[0]
    } else if (!selected_user.main_user && users.length > 0) {
      selected_user = users[0]
    } else {
      selected_user = users.filter(x => x.main_user === selected_user.main_user)[0]
    }

    Vue.set(state, 'selected_user', selected_user)
    Vue.set(state, 'transfers', transfers)
  }
}

let filter_last_transfer = (arr, main_user) => {
  let count = arr.filter(x => x.time_value > state.global_last_transfer).length
  return count
}

let getImagePath = (notifications) => {
  notifications = notifications > 9 ? `9+` : notifications
  return `${__static}/badges/badge_${notifications}.png`
}

let filter_duplictes = (transfers) => {
  let duplicates = transfers.filter(i => transfers.filter((ii) => ii.number === i.number).length > 1)
  if (duplicates.length > 0) {
    let list = []
    for (let dup of duplicates) {
      if (list.indexOf(dup.number === -1)) {
        //transfers.indexOf(dup)
      }
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}