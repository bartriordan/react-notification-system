import classnames from 'classnames'
import createReactClass from 'create-react-class'
import {PropTypes} from 'prop-types'

import closeIcon from './close.svg'
import constants from './constants'
import Helpers from './helpers'
import whichTransitionEvent from './whichTransitionEvent'


const NotificationItem = createReactClass({
  height: 0,
  _isMounted: false,
  noAnimation: null,
  notificationTimer: null,
  removeCount: 0,
  styles: {},
  propTypes: {
    allowHTML: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element
    ]),
    getStyles: PropTypes.object,
    noAnimation: PropTypes.bool,
    notification: PropTypes.object,
    onRemove: PropTypes.func
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
  componentDidMount() {
    let transitionEvent = whichTransitionEvent()

    this.height = this.refs.notificationItem.offsetHeight
    this._isMounted = true

    // Watch for transition end
    if (!this.noAnimation) {
      if (transitionEvent)
        this.refs.notificationItem.addEventListener(transitionEvent, this.onTransitionEnd)
      else
        this.noAnimation = true
    }

    if (this.props.notification.autoDismiss) {
      this.notificationTimer = new Helpers.Timer(
        () => this.hideNotification(),
        this.props.notification.autoDismiss * 1000
      )
    }

    this.showNotification()
  },
  componentWillUnmount() {
    this.refs.notificationItem.removeEventListener(whichTransitionEvent(), this.onTransitionEnd)
    this._isMounted = false
  },
  getCssPropertyByPosition() {
    let position = this.props.notification.position
    let css = {}

    switch (position) {
      case constants.positions.tl:
      case constants.positions.bl:
        css = {
          property: 'left',
          value: -200
        }
        break

      case constants.positions.tr:
      case constants.positions.br:
        css = {
          property: 'right',
          value: -200
        }
        break

      case constants.positions.tc:
        css = {
          property: 'top',
          value: -100
        }
        break

      case constants.positions.bc:
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
  dismiss() {
    if (this.props.notification.dismissible)
      this.hideNotification()
  },
  removeNotification() { this.props.onRemove(this.props.notification.uid) },
  showNotification() { setTimeout(() => this.setState({visible: true}), 50) },
  onTransitionEnd() {
    if (this.removeCount > 0)
      return

    if (this.state.removed) {
      this.removeCount++
      this.removeNotification()
    }
  },
  preventDisappearanceDuringMouseover() {
    if (this.props.notification.autoDismiss)
      this.notificationTimer.pause()
  },
  handleMouseLeave() {
    if (this.props.notification.autoDismiss)
      this.notificationTimer.resume()
  },
  allowHTML(string) { return {__html: string} },
  constructNotificationStyles(notificationStyle) {
    let cssByPosition = this.getCssPropertyByPosition()

    if (this.props.getStyles.overrideStyle) {
      notificationStyle.opacity = this.state.visible * 1

      if (!this.state.visible && !this.state.removed)
        notificationStyle[cssByPosition.property] = cssByPosition.value

      if (this.state.visible && !this.state.removed) {
        notificationStyle.height = this.height
        notificationStyle[cssByPosition.property] = 0
      }

      if (this.state.removed) {
        ['height', 'marginTop', 'paddingTop', 'paddingBottom'].forEach(attribute => notificationStyle[attribute] = 0)
        notificationStyle.overlay = 'hidden'
      }
    }
    return notificationStyle
  },
  dismissOnInnerClick(event) {
    if (event)
      event.stopPropagation() // Prevent dismissal on any click regardless of tag
    else
      return // Bail if there's no object

    // Only dismiss if a button or anchor inside the notification is clicked:
    if (this.props.tagsWhereClickDismisses.includes(event.target.tagName))
      this.dismiss()
  },

  render() {
    let notification = this.props.notification


    let additionalMessageProp = (this.props.allowHTML ? {dangerouslySetInnerHTML: this.allowHTML(notification.message)} : {children: notification.message})
    let className = classnames(
      'notification',
      `notification-${notification.level}`,
      {
        'notification-visible': this.state.visible,
        'notification-hidden': !this.state.visible,
        'notification-not-dismissible': !notification.dismissible
      }
    )

    return (
      <div className={className} onClick={this.dismissOnInnerClick} onMouseEnter={this.preventDisappearanceDuringMouseover} onMouseLeave={this.handleMouseLeave} ref='notificationItem' style={this.constructNotificationStyles({...this.styles.notification})}>
        {notification.dismissible && <img alt='Close notification icon' className='notification-dismiss' onClick={this.dismiss} src={closeIcon} />}
        {notification.children}
      </div>
    )
  }
})

NotificationItem.defaultProps = {
  tagsWhereClickDismisses: ['A', 'BUTTON']
}

NotificationItem.propTypes = {
  tagsWhereClickDismisses: PropTypes.arrayOf(PropTypes.string)
}

export default NotificationItem
