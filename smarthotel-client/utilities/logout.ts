import redirect from './redirect'

const logout = () => {
  if (window && localStorage) {
    localStorage.removeItem('hotel')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    redirect('/')
  }
}
export default logout
