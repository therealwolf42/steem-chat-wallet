import Vue from 'vue'
import db from '../../db'

const state = {
  showModal: false,
  agreedTerms: false,
  loading: true,
  newVersion: false
}

const actions = {
  unlock: async ({ commit, state, dispatch }, { key, key_auths }) => {
  }
}

const getters = {
  showModal: state => {
    return state.showModal
  },
  agreedTerms: state => {
    return state.agreedTerms
  },
  loading: state => {
    return state.loading
  },
  newVersion: state => {
    return state.newVersion
  }
}

const mutations = {
  setShowModal: (state, showModal) => {
    Vue.set(state, 'showModal', showModal)
  },
  setAgreedTerms: (state, agreedTerms) => {
    Vue.set(state, 'agreedTerms', agreedTerms)
  },
  setAgreedTermsDB: (state, agreedTerms) => {
    db.set('agreedTerms', agreedTerms).write()
  },
  setLoading: (state, loading) => {
    Vue.set(state, 'loading', loading)
  },
  newVersion: (state, newVersion) => {
    Vue.set(state, 'newVersion', newVersion)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}