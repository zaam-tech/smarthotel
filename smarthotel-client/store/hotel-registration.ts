import Api from '@/services/apiService'
export const state = () => ({})
export const mutations = {
  ADD_BUSINESS: (state: any, business: any) => {
    const temp: any = localStorage.getItem('hotel')
    const hotel = JSON.parse(temp)
    const newHotel = {
      ...hotel,
      business: {
        ...business,
      },
    }
    localStorage.setItem('hotel', JSON.stringify(newHotel))
  },
  UPDATE_HOTEL: (state: any, data: any) => {
    const temp: any = localStorage.getItem('hotel')
    const hotel = JSON.parse(temp)
    const newHotel = {
      ...hotel,
      ...data,
    }
    localStorage.setItem('hotel', JSON.stringify(newHotel))
  },
  CREATE_HOTEL: (state: any, hotel: any) => {
    localStorage.setItem('hotel', JSON.stringify(hotel))
  },
  GET_HOTEL: (state: any, hotel: any) => {
    localStorage.setItem('hotel', hotel)
  },
  SET_HOTEL_ID: (state: any, id: string) => {
    localStorage.setItem('hotel_id', id)
  },
  UPDATE_ADMIN_USER: (state: any, data: any) => {
    const temp: any = localStorage.getItem('hotel')
    let hotel = JSON.parse(temp)
    const newHotel = {
      ...hotel,
      creator: {
        ...hotel.creator,
        ...data,
      },
    }
    localStorage.setItem('hotel', JSON.stringify(newHotel))
  },
}
export const actions = {
  async getHotelId(store?: any) {
    try {
      const query = `{
        hotelDetails{
          _id
          country
          businessType
          businessName
          creator{
            fullName
              email
              userType
              citizenShip
              birthCountry
              DOB
              identity
              identityDoc
              expiryDate
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
          pContact {
              firstName
              secondName
              lastName
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
            data: { hotelDetails },
          },
        } = request
        if (hotelDetails) {
          store.commit('GET_HOTEL', hotelDetails)
        } else {
          throw new Error("Couldn't process your request")
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
  async createHotel(store: any, data: any) {
    try {
      const query = `
          mutation {
            createHotel (hotelInput: {
              country:"${data.country}",
              businessName:"${data.businessName}",
              businessType:"${data.businessType}"
            }) {
              _id
              country
              businessType
              businessName
              creator{
                email
                fullName
              }
            }
          }
      `
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        const errors = request.response.data.errors
        if (errors && errors.length) {
          const error = errors[0]
          throw error
        }
      } else if (request.data) {
        console.log(request.data)
        const {
          data: {
            data: { createHotel },
          },
        } = request
        if (createHotel) {
          store.commit('CREATE_HOTEL', createHotel)
        } else {
          throw new Error("Couldn't process your request")
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
  async addBusiness(store: any, data: any) {
    try {
      const temp: any = localStorage.getItem('hotel')
      const hotel = JSON.parse(temp)
      const id = hotel._id
      if (id) {
        const query = `
            mutation {
                addBusiness (businessInput: {
                  address:{
                    address1:"${data.address.address1}",
                    address2:"${data.address.address2}",
                    country:"${data.address.country}",
                    city:"${data.address.city}",
                    postalCode:"${data.address.postalCode}"
                    region:"${data.address.region}"
                  }
                  phoneNumber: "${data.phoneNumber}",
                  regNo: "${data.regNo}",
                  pContact:{
                      firstName:"${data.pContact.firstName}",
                      secondName:"${data.pContact.middleName}",
                      lastName:"${data.pContact.lastName}",
                  }
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
                  pContact {
                      firstName
                      secondName
                      lastName
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
              data: { addBusiness },
            },
          } = request
          if (addBusiness) {
            store.commit('ADD_BUSINESS', addBusiness)
          } else {
            throw new Error("Couldn't process your request")
          }
        } else {
          throw new Error('Network Error')
        }
      } else {
        await this.getHotelId()
      }
    } catch (error) {
      throw error
    }
  },
  async updateAdminUser(store: any, user: any) {
    try {
      const query = `
        mutation {
          updateAdminUser (webUserInput:{
            citizenShip:"${user.citizenShip}",
            birthCountry:"${user.birthCountry}",
            DOB:"${user.DOB}",
            identity:"${user.identity}",
            identityDoc:"${user.identityDoc}",
            issueCountry:"${user.issueCountry}",
            expiryDate:"${user.expiryDate}",
            phoneNumber:"${user.phoneNumber}",
            address:{
                country:"${user.address.country}",
                postalCode:"${user.address.postalCode}",
                region:"${user.address.region}",
                city:"${user.address.city}",
                address1:"${user.address.address1}",
                address2:"${user.address.address2}"
            }
          }) {
              _id
              fullName
              email
              userType
              citizenShip
              birthCountry
              DOB
              identity
              identityDoc
              issueCountry
              expiryDate
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
            data: { updateAdminUser },
          },
        } = request
        if (!updateAdminUser) {
          throw new Error("Could'nt process request. Try again")
        } else {
          store.commit('UPDATE_ADMIN_USER', updateAdminUser)
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
}
