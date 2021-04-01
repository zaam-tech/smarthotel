const autoCompleteApi = (input: HTMLInputElement, google: any) => {
  let latInput = ''
  let longInput = ''
  let latitude = ''
  let longitude = ''
  const autoComplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode'],
  })

  google.maps.event.addListener(autoComplete, 'place_changed', () => {
    const nearPlace = autoComplete.getPlace()
    latInput = nearPlace.geometry.location.lat()
    longInput = nearPlace.geometry.location.lng()
    latitude = nearPlace.geometry.location.lat()
    longitude = nearPlace.geometry.location.lng()
  })
  input.addEventListener('change', () => {
    latInput = ''
    longInput = ''
    latitude = ''
    longitude = ''
  })
  return {
    latInput,
    longInput,
    latitude,
    longitude,
  }
}
export default autoCompleteApi
