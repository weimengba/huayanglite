import * as types from './mutations-types'

export const setAuth = function({commit}, auth) {
  commit(types.SET_AUTH, auth)
}

export const setIsAuth = function({commit}, isAuth) {
  commit(types.SET_ISAUTH, isAuth)
}

export const setUid = function({commit}, uid) {
  commit(types.SET_UID, uid)
}

export const setActivity = function({commit}, activity) {
  commit(types.SET_ACTIVITY, activity)
}

export const setSigned = function({commit}, signed) {
  commit(types.SET_SIGNED, signed)
}

export const setSignDay = function({commit}, signDay) {
  commit(types.SET_SIGNDAY, signDay)
}

export const setFlowersAll = function({commit}, flowersAll) {
  commit(types.SET_FLOWERSALL, flowersAll)
}

export const setFlowersToday = function({commit}, flowersToday) {
  commit(types.SET_FLOWERSTODAY, flowersToday)
}

export const setChangeInfo = function({commit}, changeInfo) {
  commit(types.SET_CHANGEINFO, changeInfo)
}

export const setAuid = function({commit}, auid) {
  commit(types.SET_AUID, auid)
}

export const setIndexInfo = function({commit}, indexInfo) {
  commit(types.SET_INDEXINFO, indexInfo)
}

export const setNewComments = function({commit}, newCommentList) {
  commit(types.SET_NEWCOMMENTLIST, newCommentList)
}

export const setFirstIn = function({commit}, firstIn) {
  commit(types.SET_FIRSTIN, firstIn)
}

export const setToList = function({commit}, toList) {
  commit(types.SET_TOLIST, toList)
}

export const setCodeAuid = function({commit}, codeAuid) {
  commit(types.SET_CODEAUID, codeAuid)
}

