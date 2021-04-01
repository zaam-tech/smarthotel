import formatDate from '~/utilities/formatDate'

export const state = () => {
  return {
    date: formatDate(new Date())
  }
}
export const mutations = {
  setDate(state: any, date: any) {
    // state.date = moment(date).format('dddd,MMMM d,YYYY')
  }
}
export const actions = {
  setDate(store: any, date: any) {
    store.commit('setDate', date)
  }
}
