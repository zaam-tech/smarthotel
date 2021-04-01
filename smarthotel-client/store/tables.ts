import Api from '@/services/apiService'
import Table from '@/interfaces/Table'
export const state = () => ({
  tables: [],
  table: {},
})

export const mutations = {
  DELETE_TABLE: (state: any, tableId: string) => {
    state.tables = state.tables.filter((table: Table) => table._id !== tableId)
  },
  SET_TABLE: (state: any, table: Table) => {
    state.tables.push(table)
  },
  SET_TABLES: (state: any, tables: Array<Table>) => {
    state.tables = tables
  },
  UPDATE_TABLE: (state: any, data: Table) => {
    state.tables = state.tables.map((table: Table) => {
      if (table._id === data._id) {
        table = data
        return table
      } else {
        return table
      }
    })
  },
}

export const actions = {
  async createTable(store: any, tableData: Partial<Table>) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      const query = `
      mutation{
          createTable(hotelId:"${id}",tableInput:{
            tableName : "${tableData.tableName}",
            tableNumber: "${tableData.tableNumber}",
            tableType: "${tableData.tableType}",
            forReservation:"${tableData.forReservation}"
          }){
            _id
            hotelInfo{
              _id
              hotelName
            }
            tableName
            tableNumber
            tableType
            forReservation
          }
        }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        } else if (request.response.errors.length) {
          const error = request.response.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { createTable },
          } = request.data
          store.commit('SET_TABLE', createTable)
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async getTables(store: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      const query = `{
        tables(hotelId:"${id}"){
          tables{
            _id
            hotelInfo{
              _id
              hotelName
            }
            tableName
            tableNumber
            tableType
            forReservation
          }
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        } else if (request.response.errors.length) {
          const error = request.response.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { tables },
          } = request.data
          store.commit('SET_TABLES', tables.tables)
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async deleteTable(store: any, tableId: string) {
    try {
      const query = `
        mutation{
          deleteTable(tableId:"${tableId}")
      }
      `
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        } else if (request.response.errors.length) {
          const error = request.response.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const { deleteTable } = request.data.data

          if (deleteTable) {
            store.commit('DELETE_TABLE', tableId)
          } else {
            throw new Error('It didnt work. Try again later')
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async updateTable(store: any, tableData: any) {
    try {
      const query = `
      mutation{
          updateTable(tableId:"${tableData._id}",tableInput:{
            tableName : "${tableData.tableName}",
            tableNumber: "${tableData.tableNumber}",
            tableType: "${tableData.tableType}",
            forReservation: "${tableData.forReservation}"
          }){
            _id
            hotelInfo{
              _id
              hotelName
            }
            tableName
            tableNumber
            tableType
            forReservation
          }
        }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        } else if (request.response.errors.length) {
          const error = request.response.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { updateTable },
          } = request.data
          store.commit('UPDATE_TABLE', updateTable)
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
}

export const getters = {
  tableList: (store: any) => store.tables,
}
