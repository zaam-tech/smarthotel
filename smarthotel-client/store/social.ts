import Social from '../interfaces/Social'
const { v4: uuidv4 } = require('uuid')
export const state = () => ({
  socials: [
    {
      alt: 'Facebook Icon',
      id: uuidv4(),
      icon: '/facebook.svg',
      url: 'http://www.facebook.com/smart-hotel'
    },
    {
      alt: 'Linkedin Icon',
      id: uuidv4(),
      icon: '/linkedin.svg',
      url: 'http://www.linkedin.com/in/smart-hotel'
    },
    {
      alt: 'Twitter Icon',
      id: uuidv4(),
      icon: '/twitter.svg',
      url: 'http://www.twitter.com/smart-hotel'
    }
  ] as Array<Social>
})
export const getters = {
  socials(state: any) {
    return state.socials
  }
}
