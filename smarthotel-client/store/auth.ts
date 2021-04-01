import Api from '@/services/apiService'
import User from '../interfaces/User'
import UserExtend from '../interfaces/UserExtend'
export const state = (): object => {
  return {
    user: {},
    users: [] as Array<UserExtend>,
  }
}
export const mutations = {
  DELETE_USER: (state: any, userId: string) => {
    state.users = state.users.filter((user: UserExtend) => user._id !== userId)
  },
  LOGIN: (state: any, data: any) => {
    localStorage.setItem('token', data.token)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('userId', data.userId)
  },
  LOGOUT: (state: any) => {
    localStorage.clear()
  },
  SIGNUP: (state: any, user: UserExtend) => {
    state.users.push(user)
  },
  SET_USER: (state: any, user: any) => {
    localStorage.setItem('user', JSON.stringify(user))
  },
  SET_USERS: (state: any, users: Array<UserExtend>) => {
    state.users = users.map((user: UserExtend) => ({
      ...user,
      email: user.email.toLowerCase(),
    }))
  },
  RESET_PASSWORD: (state: any, user: User) => {},
  UPDATE_ADMIN_USER: (state: any, user: User) => {},
  UPDATE_CASHIER: (state: any, data: UserExtend) => {
    state.users = state.users.map((user: UserExtend) => {
      if (user._id === data._id) {
        user = data
        return user
      } else {
        return user
      }
    })
  },
}
export const actions = {
  async createCashier(store: any, user: any) {
    try {
      const query = `
      mutation {
        createCashierUser (webUserInput: {
          email:"${user.email}",
          fullName:"${user.fullName}",
          userType:"${user.userType}",
          password:"${user.password}"
        }) {
            fullName
            email
            _id
            userType
            hotelName{
              _id
            }
        }
    }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { createCashierUser },
          } = request.data
          if (!createCashierUser) {
            throw new Error("Could'nt process request. Try again later")
          } else {
            store.commit('SIGNUP', createCashierUser)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async deleteCashier(store: any, userId: string) {
    try {
      const query = `
      mutation {
        deleteUser (cashierId:"${userId}")
    }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { deleteUser },
          } = request.data
          if (!deleteUser) {
            throw new Error("Could'nt process request. Try again later")
          } else {
            store.commit('DELETE_USER', userId)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async updateCashier(store: any, user: any) {
    try {
      const query = `
      mutation {
        updateCashierUser (id:"${user._id}",webUserInput: {
          email:"${user.email}",
          fullName:"${user.fullName}",
          userType:"${user.userType}",
          password:"${user.password}"
        }) {
            fullName
            email
            _id
            userType
            hotelName{
              _id
            }
        }
    }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { updateCashierUser },
          } = request.data
          if (!updateCashierUser) {
            throw new Error("Could'nt process request. Try again later")
          } else {
            store.commit('UPDATE_CASHIER', updateCashierUser)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async updateWebUser(store: any, user: any) {
    try {
      const query = `
        mutation {
          updateWebUser (webUserInput:{
            citizenShip:"${user.citizenShip}",
            birthCountry:"${user.birthCountry}",
            DOB:"${user.DOB}",
            identity:"${user.identity}",
            issueCountry:"${user.issueCountry}",
            expiryDate:"${user.expiryDate}",
            phoneNumber:"${user.phoneNumber}",
            fullName:"${user.fullName}"
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
            data: { updateWebUser },
          },
        } = request
        if (!updateWebUser) {
          throw new Error("Could'nt process request. Try again")
        } else {
          store.commit('UPDATE_ADMIN_USER', updateWebUser)
        }
      } else {
        throw new Error('Network Error')
      }
    } catch (error) {
      throw error
    }
  },
  async getOtpForPasswordReset(store: any, email: string) {
    try {
      const query = `{
        webUserPasswordResetCode(email:"${email}"){
          email
          _id
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { webUserPasswordResetCode },
          } = request.data

          if (!webUserPasswordResetCode) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('SET_USER', webUserPasswordResetCode)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async getUser(store: any, user: User) {
    try {
      const query = `{
        webUser{
          _id
          fullName
          email
          userType
          hotelName{
            _id
          }
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: { webUser },
        } = request.data
        if (!webUser) {
          throw new Error("Couldn't process request. Try again later")
        } else {
          store.commit('SET_USER', webUser)
        }
      } else {
        throw new Error('Network Error. Try again later')
      }
    } catch (error) {
      throw error
    }
  },
  async getUsers(store: any) {
    const temp: any = localStorage.getItem('hotel')
    const id = JSON.parse(temp)._id
    const query = `
      {
        webUsers(hotelId:"${id}"){
            webUsers{
              fullName
              email
              userType
              password
              _id
          }
        }
      }`

    try {
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: {
              webUsers: { webUsers },
            },
          } = request.data
          if (!webUsers) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('SET_USERS', [...webUsers])
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async loginUser(store: any, user: User) {
    try {
      const query = `mutation {
        webLogin (email: "${user.email}", password: "${user.password}") {
          token
          refreshToken
          userId
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: { webLogin },
        } = request.data
        if (webLogin) {
          store.commit('LOGIN', webLogin)
        } else {
          type newError = {
            message: string
            code: number
          }
          const error: newError = {
            code: 404,
            message: 'No such user found',
          }
          throw error
        }
      } else {
        throw new Error('Network Error. Try again later')
      }
    } catch (error) {
      throw error
    }
  },
  async logout(store: any) {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const query = `mutation {
        logout (refreshToken: "${refreshToken}")
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else if (request.data) {
        const {
          data: { logout },
        } = request.data
        if (!logout) {
          throw new Error("Couldn't process request. Try again later")
        } else {
          store.commit('LOGOUT')
        }
      } else {
        throw new Error('Network Error. Try again later')
      }
    } catch (error) {
      throw error
    }
  },
  async resetPassword(store: any, password: string) {
    const temp: any = localStorage.getItem('user')
    const id = JSON.parse(temp)
    try {
      const query = `mutation {
        webUserSetNewPassword(id:"${id}",password:${password}){
          email
          _id
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { webUserSetNewPassword },
          } = request.data
          if (!webUserSetNewPassword) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('SET_USER', webUserSetNewPassword)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async refreshToken(store: any) {
    const temp: any = localStorage.getItem('refreshToken')
    const refreshToken = JSON.parse(temp)
    try {
      const query = `mutation {
        refreshToken(refreshToken:"${refreshToken}"){
          email
          _id
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { refreshToken },
          } = request.data
          if (!refreshToken) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('LOGIN', refreshToken)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async resendOtpForEmailVerification(store: any) {
    const temp: any = localStorage.getItem('user')
    const id = JSON.parse(temp)
    try {
      const query = `mutation{
        webUserResendVerificationToken(id:"${id}"){
          email
          _id
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { webUserResendVerificationToken },
          } = request.data
          if (!webUserResendVerificationToken) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('SET_USER', webUserResendVerificationToken)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async resendOtpForPasswordReset(store: any) {
    const temp: any = localStorage.getItem('user')
    const id = JSON.parse(temp)
    try {
      const query = `mutation {
        webUserResendResetToken(id:"${id}"){
          email
          _id
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { webUserResendResetToken },
          } = request.data
          if (!webUserResendResetToken) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('SET_USER', webUserResendResetToken)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async signupUser(store: any, user: UserExtend) {
    try {
      const query = `
      mutation {
        createAdminUser (webUserInput: {
          email:"${user.email}",
          fullName:"${user.fullName}",
          password:"${user.password}"
        }) {
            fullName
            email
            password
            _id
        }
    }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { createAdminUser },
          } = request.data
          if (!createAdminUser) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('SIGNUP', createAdminUser)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async sendVerifyToken(store: any, email: string) {
    try {
      const query = `mutation{
        webUserSendGetPasswordResetCode(email:"${email}"){
          email
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { webUserSendGetPasswordResetCode },
          } = request.data
          if (!webUserSendGetPasswordResetCode) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('LOGIN', webUserSendGetPasswordResetCode)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async verifyOtpForPasswordReset(store: any, token: string) {
    try {
      const query = `{
        webUserResetTokenVerfication(token:"${token}"){
          email
          _id
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { webUserResetTokenVerfication },
          } = request.data
          if (!webUserResetTokenVerfication) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('SET_USER', webUserResetTokenVerfication)
          }
        } else {
          throw new Error('Network Error. Try again later')
        }
      }
    } catch (error) {
      throw error
    }
  },
  async verifyUser(store: any, verificationToken: string) {
    try {
      const query = `mutation {
        webUserVerification(verificationToken:"${verificationToken}"){
          token
          refreshToken
          userId
        }
      }`
      const request: any = await Api.makeQuery(query)
      if (request.response) {
        if (request.response.data.errors.length) {
          const error = request.response.data.errors[0]
          throw error
        }
      } else {
        if (request.data) {
          const {
            data: { webUserVerification },
          } = request.data
          if (!webUserVerification) {
            throw new Error("Couldn't process request. Try again later")
          } else {
            store.commit('LOGIN', webUserVerification)
          }
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
  user() {
    if (window && window.localStorage) {
      const user = window.localStorage.getItem('user')
      if (user) {
        return JSON.parse(user)
      } else {
        return user
      }
    }
  },
  users(store: any) {
    return store.users
  },
}
