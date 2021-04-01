import Api from '@/services/apiService'
export const state = () => ({
  qrcode: null,
})
export const mutations = {
  CREATE_QRCODE: (state: any, data: any) => {
    state.qrcode = data.url
  },
}
export const actions = {
  async generateCode(store: any, tableId: string) {
    try {
      const request = await Api.generateQr(tableId)
      if (request.status === 200) {
        store.commit('CREATE_QRCODE', request)
      } else if (request.status === 500) {
        throw new Error("Couldn't process your request. Try again")
      }
    } catch (error) {
      throw error
    }
  },
  setQrCode(store: any) {
    store.commit('CREATE_QRCODE', { url: null })
  },
}

export const getters = {
  qrcode: (state: any) => state.qrcode,
}
