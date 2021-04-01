const v4 = require('uuid').v4
import Country from '@/interfaces/Country'
import apiService from '@/services/apiService'
export const state = () => ({
  countries: [
    {
      id: v4(),
      name: 'Burundi',
    },
    {
      id: v4(),
      name: 'Comoros',
    },
    {
      id: v4(),
      name: 'Djibouti',
    },
    {
      id: v4(),
      name: 'Ethiopia',
    },
    {
      id: v4(),
      name: 'Eritrea',
    },
    {
      id: v4(),
      name: 'Kenya',
    },
    {
      id: v4(),
      name: 'Mauritius',
    },
    {
      id: v4(),
      name: 'Madagascar',
    },
    {
      id: v4(),
      name: 'Malawi',
    },
    {
      id: v4(),
      name: 'Mozambique',
    },
    {
      id: v4(),
      name: 'Reunion',
    },
    {
      id: v4(),
      name: 'Rwanda',
    },
    {
      id: v4(),
      name: 'Seychelles',
    },
    {
      id: v4(),
      name: 'Somalia',
    },
    {
      id: v4(),
      name: 'Somaliland',
    },
    {
      id: v4(),
      name: 'Tanzania',
    },
    {
      id: v4(),
      name: 'Uganda',
    },
    {
      id: v4(),
      name: 'Zambia',
    },
    {
      id: v4(),
      name: 'Zimbabwe',
    },
  ],
})

export const mutations = {
  SET_COUNTRIES:(state:any,countries:Array<Country>) => {
    state.countries = countries
  }
}

export const getters = {
  countries(store: any) {
    return store.countries
  },
}

export const actions = {
  async getCountries(store:any){
    try {
      const response = await apiService.getCountryData()
      if(response.data){
        const { data:{ countries }} = response
        const countryData = countries.map((country:any) => ({
          ...country,
          id: v4()
        }))
        store.commit('SET_COUNTRIES',countryData)
      }
    } catch (error) {
      throw error
    }
  }
}
