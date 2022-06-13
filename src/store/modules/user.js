import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    user_id: '',
    phone: '',
    category: '',
    nname: '',
    permission_range: '',
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_USERID: (state, user_id) => {
    state.user_id = user_id
  },
  SET_NNAME: (state, nname) => {
    state.nname = nname
  },
  SET_CATEGORY: (state, category) => {
    state.category = category
  },
  SET_PERMISSIONRANGE: (state, permission_range) => {
    state.permission_range = permission_range
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ user_id: username.trim(), password: password }).then(response => {
        console.log()
        let data = response.data
        // data = JSON.parse(data)
        commit('SET_TOKEN', data.token)
        commit('SET_USERID', data.user_id)
        commit('SET_PHONE', data.phone)
        commit('SET_NNAME', data.nname)
        commit('SET_CATEGORY', data.category)
        commit('SET_PERMISSIONRANGE', data.permission_range)
        setToken(data.token)
        sessionStorage.setItem('user', JSON.stringify(data))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      resolve()

      // getInfo(state.token).then(response => {
      //   console.log('token', state.token)
      //   const { data } = response

      //   if (!data) {
      //     return reject('Verification failed, please Login again.')
      //   }

      //   const { name, avatar, phone, user_id } = data

      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   commit('SET_PHONE', phone)
      //   commit('SET_USERID', user_id)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      sessionStorage.clear()
      resolve()
      // logout(state.token).then(() => {
      //   removeToken() // must remove  token  first
      //   resetRouter()
      //   commit('RESET_STATE')
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
