import Tab from '../interfaces/Tab'
const { v4 } = require('uuid')

export const state = () => ({
  tabs: [
    {
      active: true,
      text: 'Today',
      page: '',
    },
    {
      active: false,
      text: 'Week',
      page: '',
    },
    {
      active: false,
      text: 'Month',
      page: '',
    },
  ],
  settingsTabs: [
    {
      active: true,
      id: v4(),
      page: '',
      text: 'Restaurant Settings',
    },
    {
      active: false,
      id: v4(),
      page: '',
      text: 'Front Office Settings',
    },
    {
      active: false,
      id: v4(),
      page: '',
      text: 'Store Settings',
    },
    {
      active: false,
      id: v4(),
      page: '',
      text: 'Billing Settings',
    },
  ] as Array<Tab>,
})
export const mutations = {
  SELECT_TAB(state: any, selectedTabId: string) {
    state.settingsTabs.forEach((tab: Tab) => {
      tab.active = selectedTabId === tab.id
    })
  },
}
export const actions = {
  selectTab(store: any, tabId: string) {
    store.commit('SELECT_TAB', tabId)
  },
}

export const getters = {
  settingsTabs(store: any) {
    return store.settingsTabs
  },
}
