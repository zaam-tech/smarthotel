const v4 = require('uuid').v4
export const state = () => ({
  types: [
    {
      id: v4(),
      text: 'Private Limited',
    },
    {
      id: v4(),
      text: 'Public Limited',
    },
    {
      id: v4(),
      text: 'Limited Liability Partnership',
    },
    {
      id: v4(),
      text: 'Limited by Guarantee',
    },
  ],
})

export const getters = {
  types(store: any) {
    return store.types
  },
}
