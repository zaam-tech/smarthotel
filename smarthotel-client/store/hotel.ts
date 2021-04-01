import Api from '../services/apiService'
export const state = () => ({
  imagePath: '/img_avatar.png',
})
export const mutations = {
  SET_HOTEL: (store: any, hotel: any) => {
    localStorage.setItem('hotel', JSON.stringify(hotel))
  },
  SET_IMAGE_PATH: (store: any, imagePath: string) => {
    store.imagePath = imagePath
  },
  UPDATE_HOTEL: (store: any, hotelData: any) => {
    const temp: any = localStorage.getItem('hotel')
    const hotel = JSON.parse(temp)
    hotel.hotelName = hotelData.hotelName
    hotel.homeDelivery = hotelData.homeDelivery
    hotel.address = hotelData.address
    localStorage.setItem('hotel', JSON.stringify(hotel))
  },
}
export const actions = {
  async getHotel(store: any) {
    try {
      const query = `
            {
            hotelDetails{
                _id
                hotelName
                hotelPhoneNumber
                logoUrl
                hotelDescription
                businessInfo{
                  _id
                }
                creator{
                  _id
                }
            }
        }
            `
      const request: any = await Api.makeQuery(query)
      if (request.data) {
        const {
          data: {
            data: { hotelDetails },
          },
        } = request
        store.commit('SET_HOTEL', hotelDetails)
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
  async getHotelById(store: any) {
    const temp: any = localStorage.getItem('user')
    const hotel = JSON.parse(temp).hotelName
    try {
      const query = `
            {
            hotel(id:"${hotel?.id}"){
                _id
                hotelName
            }
        }
            `
      const request: any = await Api.makeQuery(query)
      if (request.data) {
        const {
          data: {
            data: { hotel },
          },
        } = request
        if (hotel) {
          store.commit('SET_HOTEL', hotel)
        } else {
          throw new Error("Couldn't process your request. Try again later")
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
  async updateBusiness(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel.businessInfo._id
      if (id) {
        const query = `
            mutation {
                updateBusiness (id:"${id}",businessInput: {
                  address:{
                    address1:"${data.address1}",
                    address2:"${data.address2}",
                    country:"${data.country}",
                    city:"${data.city}",
                    postalCode:"${data.postalCode}"
                    region:"${data.region}"
                  }
                  phoneNumber: "${data.phoneNumber}",
                  regNo: "${data.regNo}",
                }) {
                  _id
                  regNo
                  phoneNumber
                  address {
                      country
                      postalCode
                      region
                      city
                      address1
                      address2
                  }
            }
          }`
        const request: any = await Api.makeQuery(query)
        if (request.response) {
          const errors = request.response.data.errors
          if (errors && errors.length) {
            const error = errors[0]
            throw error
          }
        } else if (request.data) {
          const {
            data: {
              data: { updateBusiness },
            },
          } = request
          if (!updateBusiness) {
            throw new Error("Couldn't process your request. Try again later")
          }
        } else {
          throw new Error('Network Error')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async updateBusinessInfo(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel.businessInfo._id
      if (id) {
        const query = `
            mutation {
                updateBusiness (id:"${id}",businessInput: {                  
                  regNo: "${data.regNo}",
                }) {
                  _id
                  regNo                  
            }
          }`
        const request: any = await Api.makeQuery(query)
        if (request.response) {
          const errors = request.response.data.errors
          if (errors && errors.length) {
            const error = errors[0]
            throw error
          }
        } else if (request.data) {
          const {
            data: {
              data: { updateBusiness },
            },
          } = request
          if (updateBusiness) {
            store.commit('UPDATE_BUSINESS', updateBusiness)
          } else {
            throw new Error("Couldn't process your request. Try again later")
          }
        } else {
          throw new Error('Network Error')
        }
      }
    } catch (error) {
      throw error
    }
  },
  // async uploadImage(store: any, formData: any) {
  //   try {
  //     const response = await Api.uploadImage(formData)
  //     if (!response?.url) {
  //       throw new Error('Upload wasnt successful')
  //     } else {
  //       store.commit('SET_IMAGE_PATH', response.url)
  //     }
  //   } catch (error) {
  //     throw new Error('Upload wasnt successful')
  //   }
  // },
  async uploadImage(store: any, formData: any) {
    try {
      const response = await Api.uploadImage(formData)
      if (!response?.filePath) {
        throw new Error('Upload wasnt successful')
      } else {
        store.commit('SET_IMAGE_PATH', response.filePath)
      }
    } catch (error) {
      throw new Error('Upload wasnt successful')
    }
  },
  async updateHotelInfo(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      if (id) {
        const query = `
        mutation {
          updateHotelInfo (id: "${id}", hotelInput: {
            hotelName:"${data.hotelName}"
            homeDelivery:"${data.delivery}"
            address:"${data.address}"
          }) {
              hotelName
              homeDelivery
              address
            }
        }`
        const request: any = await Api.makeQuery(query)
        if (request.response) {
          const errors = request.response.data.errors
          if (errors && errors.length) {
            const error = errors[0]
            throw error
          }
        } else if (request.data) {
          const {
            data: {
              data: { updateHotelInfo },
            },
          } = request
          if (updateHotelInfo) {
            store.commit('UPDATE_HOTEL', updateHotelInfo)
          } else {
            throw new Error("Couldn't process your request. Try again later")
          }
        } else {
          throw new Error('Network Error')
        }
      } else {
      }
    } catch (error) {
      throw error
    }
  },
  async updateHotel(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      if (id) {
        const query = `
        mutation {
          updateHotel (id: "${id}", hotelInput: {
            hotelName:"${data.hotelName}"
            homeDelivery:"${data.delivery}"
            hotelEmail:"${data.email}"
            hotelPhoneNumber:"${data.phone}"
            hotelWebSite:"${data.website}"
            address:"${data.address}"
            businessType:"${data.businessType}"
            businessName:"${data.businessName}"
            country:"${data.location}"
            description:"${data.description}"
            logoUrl:"${data.image}"
          }) {
              address
              businessName
              businessType
              country
              description
              hotelName
              homeDelivery
              hotelEmail
              hotelPhoneNumber
              hotelWebSite
              logoUrl
            }
        }`
        const request: any = await Api.makeQuery(query)
        if (request.response) {
          const errors = request.response.data.errors
          if (errors && errors.length) {
            const error = errors[0]
            throw error
          }
        } else if (request.data) {
          const {
            data: {
              data: { updateHotel },
            },
          } = request
          if (updateHotel) {
            store.commit('UPDATE_HOTEL', updateHotel)
            store.commit('SET_IMAGE_PATH', updateHotel.logoUrl)
          } else {
            throw new Error("Couldn't process your request. Try again later")
          }
        } else {
          throw new Error('Network Error')
        }
      } else {
      }
    } catch (error) {
      throw error
    }
  },
  async setImagePath(store: any, imagePath: string) {
    store.commit('SET_IMAGE_PATH', imagePath)
  },
}

export const getters = {
  image: (store: any) => {
    return store.imagePath
  },
}
