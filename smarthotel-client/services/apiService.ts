import api from '@/services/api'
import axios from 'axios'

export default {
  async makeQuery(payload: any) {
    try {
      const request = await api.post(
        '/graphql',
        {
          query: `${payload}`,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return request
    } catch (error) {
      return error
    }
  },
  async generateQr(tableId: string) {
    const api: any = axios.create({
      baseURL: `http://localhost:8080`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    return api
      .get(`/${tableId}/pdf`)
      .then(() => {
        return {
          url: `http://localhost:8080/${tableId}/pdf`,
          status: 200,
        }
      })
      .catch((error: any) => {
        if (error.isAxiosError) {
          return {
            status: 500,
          }
        }
      })
  },
  async uploadImage(payload: any) {
    let progress = 0
    try {
      const request: any = await fetch(
        'http://localhost:3000/smarthotel-web-single',
        {
          method: 'PUT',
          body: payload,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
      return request.json()
    } catch (error) {
      return error
    }
  },
  async getCountryData() {
    try {
      const request: any = await api.get('/get-countries')
      return request
    } catch (error) {
      return error
    }
  },
}
