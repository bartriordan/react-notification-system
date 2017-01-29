/* From Modernizr */
const whichTransitionEvent = () => {
  let element = document.createElement('fakeelement')
  let transition
  let transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }

  Object.keys(transitions).forEach(transitionKey => {
    if (element.style[transitionKey] !== undefined)
      transition = transitions[transitionKey]
  })

  return transition
}

export default whichTransitionEvent
