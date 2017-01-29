import React from 'react'
import ReactDOM from 'react-dom'
import Constants from './constants'
import Helpers from './helpers'
import classnames from 'classnames'

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


const NotificationItem = React.createClass({
  height: 0,
  _isMounted: false,
  noAnimation: null,
  notificationTimer: null,
  removeCount: 0,
  styles: {},
  propTypes: {
    allowHTML: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
    getStyles: React.PropTypes.object,
    noAnimation: React.PropTypes.bool,
    notification: React.PropTypes.object,
    onRemove: React.PropTypes.func
  },
  getDefaultProps() {
    return {
      allowHTML: false,
      noAnimation: false,
      onRemove() {}
    }
  },
  getInitialState() {
    return {
      removed: false,
      visible: false
    }
  },
  componentWillMount() {
    let getStyles = this.props.getStyles
    let level = this.props.notification.level

    this.noAnimation = this.props.noAnimation

    this.styles = {
      notification: getStyles.byElement('notification')(level),
      title: getStyles.byElement('title')(level),
      dismiss: getStyles.byElement('dismiss')(level),
      messageWrapper: getStyles.byElement('messageWrapper')(level),
      actionWrapper: getStyles.byElement('actionWrapper')(level),
      action: getStyles.byElement('action')(level)
    }

    if (!this.props.notification.dismissible)
      this.styles.notification.cursor = 'default'
  },
  getCssPropertyByPosition() {
    let position = this.props.notification.position
    let css = {}

    switch (position) {
      case Constants.positions.tl:
      case Constants.positions.bl:
        css = {
          property: 'left',
          value: -200
        }
        break

      case Constants.positions.tr:
      case Constants.positions.br:
        css = {
          property: 'right',
          value: -200
        }
        break

      case Constants.positions.tc:
        css = {
          property: 'top',
          value: -100
        }
        break

      case Constants.positions.bc:
        css = {
          property: 'bottom',
          value: -100
        }
        break

      default:
    }

    return css
  },

  defaultAction(event) {
    event.preventDefault()

    this.hideNotification()
    if (typeof this.props.notification.action.callback === 'function')
      this.props.notification.action.callback()
  },

  hideNotification() {
    if (this.notificationTimer)
      this.notificationTimer.clear()

    if (this._isMounted) {
      this.setState({
        removed: true,
        visible: false
      })
    }

    if (this.noAnimation)
      this.removeNotification()
  },
  removeNotification() { this.props.onRemove(this.props.notification.uid) },
  dismiss() {
    if (this.props.notification.dismissible)
      this.hideNotification()
  },
  showNotification() {
    setTimeout(() => this.setState({visible: true}), 50)
  },
  onTransitionEnd() {
    if (this.removeCount > 0)
      return

    if (this.state.removed) {
      this.removeCount++
      this.removeNotification()
    }
  },
  componentDidMount() {
    let transitionEvent = whichTransitionEvent()
    let notification = this.props.notification
    let element = ReactDOM.findDOMNode(this)

    this.height = element.offsetHeight
    this._isMounted = true

    // Watch for transition end
    if (!this.noAnimation) {
      if (transitionEvent)
        element.addEventListener(transitionEvent, this.onTransitionEnd)
      else
        this.noAnimation = true
    }

    if (notification.autoDismiss) {
      this.notificationTimer = new Helpers.Timer(
        () => this.hideNotification(),
        notification.autoDismiss * 1000
      )
    }

    this.showNotification()
  },
  handleMouseEnter() {
    if (this.props.notification.autoDismiss)
      this.notificationTimer.pause()
  },
  handleMouseLeave() {
    if (this.props.notification.autoDismiss)
      this.notificationTimer.resume()
  },
  componentWillUnmount() {
    let element = ReactDOM.findDOMNode(this)
    let transitionEvent = whichTransitionEvent()
    element.removeEventListener(transitionEvent, this.onTransitionEnd)
    this._isMounted = false
  },
  allowHTML(string) { return {__html: string} },

  render() {
    let notification = this.props.notification
    let notificationStyle = {...this.styles.notification}
    let cssByPos = this.getCssPropertyByPosition()
    let dismiss = null
    let actionButton = null
    let title = null
    let message = null

    let className = classnames(
      'notification',
      `notification-${notification.level}`,
      {
        'notification-visible': this.state.visible,
        'notification-hidden': !this.state.visible,
        'notification-not-dismissible': !notification.dismissible
      }
    )

    if (this.props.getStyles.overrideStyle) {
      if (!this.state.visible && !this.state.removed)
        notificationStyle[cssByPos.property] = cssByPos.value

      if (this.state.visible && !this.state.removed) {
        notificationStyle.height = this.height
        notificationStyle[cssByPos.property] = 0
      }

      if (this.state.removed) {
        notificationStyle.overlay = 'hidden'
        notificationStyle.height = 0
        notificationStyle.marginTop = 0
        notificationStyle.paddingTop = 0
        notificationStyle.paddingBottom = 0
      }
      notificationStyle.opacity = (
        this.state.visible ?
        this.styles.notification.isVisible.opacity :
        this.styles.notification.isHidden.opacity
      )
    }

    if (notification.title)
      title = <h4 className='notification-title' style={this.styles.title}>{notification.title}</h4>

    if (notification.message) {
      if (this.props.allowHTML)
        message = <div className='notification-message' style={this.styles.messageWrapper} dangerouslySetInnerHTML={this.allowHTML(notification.message)} />
      else
        message = <div className='notification-message' style={this.styles.messageWrapper}>{notification.message}</div>
    }

    if (notification.dismissible)
      dismiss = <span className='notification-dismiss' style={this.styles.dismiss}>&times;</span>

    if (notification.action) {
      actionButton = (
        <div className='notification-action-wrapper' style={this.styles.actionWrapper}>
          <button className='notification-action-button' onClick={this.defaultAction} style={this.styles.action}>
              {notification.action.label}
          </button>
        </div>
      )
    }

    if (notification.children)
      actionButton = notification.children

    return (
      <div className={className} onClick={this.dismiss} onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave} style={notificationStyle}>
        {title}
        {message}
        {dismiss}
        {actionButton}
      </div>
    )
  }
})

export default NotificationItem
