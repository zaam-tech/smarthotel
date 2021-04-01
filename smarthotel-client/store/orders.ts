import Order from '../interfaces/Order'
import moment from 'moment'
const { v4 } = require('uuid')
export const state = () => ({
  orders: ([
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: true,
      tableNumber: 'AD3',
      status: 'complete',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: true,
      tableNumber: 'AD3',
      status: 'complete',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: true,
      tableNumber: 'AD3',
      status: 'complete',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: true,
      tableNumber: 'AD3',
      status: 'complete',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: true,
      tableNumber: 'AD3',
      status: 'complete',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: false,
      tableNumber: 'AD3',
      status: 'pending',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: false,
      tableNumber: 'AD3',
      status: 'pending',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: false,
      tableNumber: 'AD3',
      status: 'pending',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: false,
      tableNumber: 'AD3',
      status: 'pending',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: false,
      tableNumber: 'AD3',
      status: 'pending',
      paidDate: moment(new Date()).format('l'),
    },
    {
      id: v4(),
      orderNumber: Math.random().toString().slice(2, 7),
      amount: '2,500 Kes',
      date: moment(new Date()).format('l'),
      payment: false,
      tableNumber: 'AD3',
      status: 'pending',
      paidDate: moment(new Date()).format('l'),
    },
  ] as unknown) as Array<Partial<Order>>,
  monthlyStats: [
    {
      date: moment(new Date(), 'YYYYMMDD').subtract(4, 'months').format('MMM'),
      month: 'Jan',
      total: 50,
    },
    {
      date: moment(new Date(), 'YYYYMMDD').subtract(3, 'months').format('MMM'),
      month: 'Feb',
      total: 350,
    },
    {
      date: moment(new Date(), 'YYYYMMDD').subtract(2, 'months').format('MMM'),
      month: 'Mar',
      total: 450,
    },
    {
      date: moment(new Date(), 'YYYYMMDD').subtract(1, 'months').format('MMM'),
      month: 'April',
      total: 1000,
    },
  ],
  orderId: null,
})

export const mutations = {
  SET_ORDER_ID(state: any, orderId: string) {
    state.orderId = orderId
  },
}
export const actions = {
  setOrderId(store: any, orderId: string) {
    store.commit('SET_ORDER_ID', orderId)
  },
}
export const getters = {
  allOrders(store: any) {
    return store.orders
  },
  completedOrders: (store: any) =>
    store.orders.filter((order: Order) => order.status === 'complete'),
  pendingOrders: (store: any) =>
    store.orders.filter((order: Order) => order.status === 'pending'),
  showGlobalObject: (store: any) => 'state',
}
