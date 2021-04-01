const toggleOptions = (event: any, context: any) => {
  return {
    hideOptions() {
      const { target } = event
      if (
        !target.classList.contains('options-icon') &&
        !target.classList.contains('text') &&
        !target.classList.contains('material-icons')
      ) {
        context.removeClass()
      }
    },
    removeClass() {
      const tools = document.querySelectorAll('.tools.active')
      tools.forEach((tool) => {
        tool.classList.remove('active')
      })
    },
    showOptions() {
      const { target } = event
      context.removeClass()
      if (target.classList.contains('options-icon')) {
        target.nextElementSibling.classList.add('active')
      } else {
        target.parentElement.nextElementSibling.classList.add('active')
      }
    },
  }
}
export default toggleOptions
