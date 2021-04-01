const { v4: uuidv4 } = require('uuid')
export const state = () => ({
  stats: [
    {
      icon: `md-biefcase-icon`,
      name: 'Earnings',
      number: 1250,
      alias: "Today's Earnings",
    },
    {
      icon: `md-cart-icon`,
      name: 'Orders',
      number: 1800,
      alias: "Today's Orders",
    },
  ],
  allStats: [
    {
      cssClass: 'red',
      id: uuidv4(),
      icon: 'ios-pie-icon',
      name: 'order received',
      total: 7000,
      size: '2.2em',
    },
    {
      cssClass: 'info',
      icon: 'ios-briefcase-icon',
      id: uuidv4(),
      name: "today's sales",
      total: 6500,
      size: '2.2em',
    },
    {
      cssClass: 'material-icons',
      icon: 'attach_money',
      id: uuidv4(),
      name: 'net earning',
      total: 1243,
      size: '2.2em',
    },
    {
      cssClass: 'orange',
      icon: 'ios-people-icon',
      id: uuidv4(),
      name: 'new customers',
      total: 250,
      size: '2.2em',
    },
  ],
})
export const mutations = {}
export const actions = {}
