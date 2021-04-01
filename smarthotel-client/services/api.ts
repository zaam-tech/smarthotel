import axios from 'axios'
export default axios.create({
  baseURL: `http://localhost:3000`,
  // baseURL: `https://smarthotelapi.herokuapp.com`,
  headers: {
    'Content-Type': 'application/json',
  },
})
