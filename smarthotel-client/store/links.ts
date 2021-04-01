import Link from '../interfaces/Link'
const v4 = require('uuid').v4
export const state = (): object => {
  return {
    links: [
      {
        alias: 'home',
        active: true,
        icon: 'home',
        id: v4(),
        iconClass: 'material-icons',
        textClass: 'link-text',
        text: 'overview',
      },
      // {
      //   alias: 'sales',
      //   active: false,
      //   id: v4(),
      //   icon: 'attach_money',
      //   iconClass: 'material-icons',
      //   textClass: 'link-text',
      //   text: 'sales',
      // },
      {
        alias: 'menu',
        active: false,
        id: v4(),
        icon: 'restaurant_menu',
        iconClass: 'material-icons',
        textClass: 'link-text',
        text: 'the menu',
        subMenu: [
          {
            id: v4(),
            alias: 'catalogue',
            active: false,
            textClass: 'link-text',
            text: 'menu catalogue',
          },
          {
            id: v4(),
            alias: 'grid',
            active: false,
            textClass: 'link-text',
            text: 'menu grid',
          },
          {
            id: v4(),
            alias: 'list',
            active: false,
            textClass: 'link-text',
            text: 'menu list',
          },
          {
            id: v4(),
            alias: 'menus',
            active: false,
            textClass: 'link-text',
            text: 'add menus',
          },
        ],
      },
      {
        alias: 'orders',
        active: false,
        id: v4(),
        icon: 'shopping_basket',
        iconClass: 'material-icons',
        textClass: 'link-text',
        text: 'orders',
        subMenu: [
          {
            id: v4(),
            alias: 'order-list',
            active: false,
            textClass: 'link-text',
            text: 'orders',
          },
          // {
          //   id: v4(),
          //   alias: 'bill-order',
          //   active: false,
          //   textClass: 'link-text',
          //   text: 'bill order',
          // },
          // {
          //   id: v4(),
          //   alias: 'send-order',
          //   active: false,
          //   textClass: 'link-text',
          //   text: 'send order',
          // },
          {
            id: v4(),
            alias: 'completed-orders',
            active: false,
            textClass: 'link-text',
            text: 'completed orders',
          },
        ],
      },
      {
        alias: 'manage',
        active: false,
        id: v4(),
        icon: 'restaurant',
        iconClass: 'material-icons',
        textClass: 'link-text',
        text: 'manage hotel',
        subMenu: [
          // {
          //   id: v4(),
          //   alias: 'rooms',
          //   active: false,
          //   textClass: 'link-text',
          //   text: 'rooms',
          // },
          {
            id: v4(),
            alias: 'tables',
            active: false,
            textClass: 'link-text',
            text: 'tables',
          },
          {
            id: v4(),
            alias: 'cashiers',
            active: false,
            textClass: 'link-text',
            text: 'users and roles',
          },
        ],
      },
      // {
      //   alias: 'reservations',
      //   active: false,
      //   id: v4(),
      //   icon: 'local_hotel',
      //   iconClass: 'material-icons',
      //   textClass: 'link-text',
      //   text: 'reservations',
      //   subMenu: [
      //     {
      //       id: v4(),
      //       alias: 'room',
      //       active: false,
      //       textClass: 'link-text',
      //       text: 'room',
      //     },
      //     {
      //       id: v4(),
      //       alias: 'table',
      //       active: false,
      //       textClass: 'link-text',
      //       text: 'table',
      //     },
      //   ],
      // },
      // {
      //   alias: 'feedback',
      //   active: false,
      //   id: v4(),
      //   icon: 'chat',
      //   iconClass: 'material-icons',
      //   textClass: 'link-text',
      //   text: 'reporting',
      // },
      // {
      //   alias: 'analytics',
      //   active: false,
      //   id: v4(),
      //   icon: 'pie_chart',
      //   iconClass: 'material-icons',
      //   textClass: 'link-text',
      //   text: 'analytics',
      // },
      {
        alias: 'settings',
        active: false,
        id: v4(),
        icon: 'settings',
        iconClass: 'material-icons',
        textClass: 'link-text',
        text: 'settings',
        subMenu: [
          {
            id: v4(),
            alias: 'device',
            active: false,
            textClass: 'link-text',
            text: 'device & billing',
          },
          {
            id: v4(),
            alias: 'account',
            active: false,
            textClass: 'link-text',
            text: 'account and settings',
          },
          // {
          //   id: v4(),
          //   alias: 'billing',
          //   active: false,
          //   textClass: 'link-text',
          //   text: 'billing and subscription',
          // },
          // {
          //   id: v4(),
          //   alias: 'advanced',
          //   active: false,
          //   textClass: 'link-text',
          //   text: 'advanced',
          // },
        ],
      },
      // {
      //   alias: 'integration',
      //   active: false,
      //   id: v4(),
      //   icon: 'settings',
      //   iconClass: 'material-icons',
      //   textClass: 'link-text',
      //   text: 'integration',
      // },
      // {
      //   alias: 'help',
      //   active: false,
      //   id: v4(),
      //   icon: 'help',
      //   iconClass: 'material-icons',
      //   textClass: 'link-text',
      //   text: 'support & FAQs',
      // },
    ],
  }
}
export const getters = {
  links(state: any) {
    return state.links
  },
  getCashierLinks: (state: any) =>
    state.links.filter(
      (link: Link) =>
        link.alias === 'home' ||
        link.alias === 'menu' ||
        link.alias === 'orders' ||
        link.alias === 'manage' ||
        link.alias === 'reservations' ||
        link.alias === 'help'
    ),
}
export const mutations = {
  ACTIVATE_LINK(state: any, activeLink: Link) {
    state.links.forEach((link: Link) => {
      if (link.id === activeLink.id) {
        link.active = activeLink.text === link.text
      } else {
        link.active = false
        const temp = link.subMenu ? link.subMenu : []
        if (temp.length > 0) {
          temp.forEach((tempLink: any) => {
            tempLink.active = activeLink.id === tempLink.id
          })
        }
      }
    })
  },
}
export const actions = {
  activateLink(store: any, link: Link) {
    store.commit('ACTIVATE_LINK', link)
  },
}
