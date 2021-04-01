const redirect = (path: string) => {
  if (window && document) {
    document.location.pathname = path
  }
}
export default redirect
