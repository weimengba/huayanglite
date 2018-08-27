import * as types from './mutations-types'
const mutations = {
  [types.SET_AUTH](state, auth) {
    state.auth = auth
  },
  [types.SET_ISAUTH](state, isAuth) {
    state.isAuth = isAuth
  },
  [types.SET_UID](state, uid) {
    state.uid = uid
  },
  [types.SET_ACTIVITY](state,activity) {
  	state.activity = activity
  },
  [types.SET_SIGNED](state,signed) {
    state.signed = signed
  },
  [types.SET_SIGNDAY](state,signDay) {
    state.signDay = signDay
  },
  [types.SET_FLOWERSALL](state,flowersAll) {
    state.flowersAll = flowersAll
  },
  [types.SET_FLOWERSTODAY](state,flowersToday) {
    state.flowersToday = flowersToday
  },
  [types.SET_CHANGEINFO](state,changeInfo) {
    state.changeInfo = changeInfo
  },
  [types.SET_AUID](state,auid) {
    state.auid = auid
  },
  [types.SET_INDEXINFO](state,indexInfo) {
    state.indexInfo = indexInfo
  },
  [types.SET_NEWCOMMENTLIST](state,newCommentList) {
    state.newCommentList = newCommentList
  },
  [types.SET_FIRSTIN](state,firstIn) {
    state.firstIn = firstIn
  },
  [types.SET_TOLIST](state,toList) {
    state.toList = toList
  },
  [types.SET_CODEAUID](state,codeAuid) {
    state.codeAuid = codeAuid
  }
}

export default mutations