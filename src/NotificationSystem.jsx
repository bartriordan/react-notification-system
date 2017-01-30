import React from 'react'
import NotificationContainer from './NotificationContainer'
import Constants from './constants'
import Styles from './styles'


const ELEMENT_TYPES = {
  notification: 'NotificationItem',
  title: 'Title',
  messageWrapper: 'MessageWrapper',
  dismiss: 'Dismiss',
  action: 'Action',
  actionWrapper: 'ActionWrapper'
}

const NotificationSystem = React.createClass({
  getInitialState() { return {notifications: []} },
  propTypes: {
    allowHTML: React.PropTypes.bool,
    noAnimation: React.PropTypes.bool,
    style: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.object
    ])
  },
  getDefaultProps() {
    return {
      allowHTML: false,
      noAnimation: false,
      style: {}
    }
  },
  componentDidMount() { this.getStyles.setOverrideStyle(this.props.style) },
  uid: 3400,
  getStyles: {
    overrideStyle: {},
    overrideWidth: null,
    setOverrideStyle(style) { this.overrideStyle = style },
    wrapper() {
      if (!this.overrideStyle)
        return {}
      return {...Styles.Wrapper, ...this.overrideStyle.Wrapper}
    },
    container(position) {
      if (!this.overrideStyle)
        return {}

      let override = this.overrideStyle.Containers || {}
      this.overrideWidth = Styles.Containers.DefaultStyle.width

      if (override.DefaultStyle && override.DefaultStyle.width)
        this.overrideWidth = override.DefaultStyle.width

      if (override[position] && override[position].width)
        this.overrideWidth = override[position].width

      return {
        ...Styles.Containers.DefaultStyle,
        ...Styles.Containers[position],
        ...override.DefaultStyle,
        ...override[position]
      }
    },
    byElement(elementKey) {
      return level => {
        if (!this.overrideStyle)
          return {}

        let element = ELEMENT_TYPES[elementKey]
        let override = this.overrideStyle[element] || {}
        return {
          ...Styles[element].DefaultStyle,
          ...Styles[element][level],
          ...override.DefaultStyle,
          ...override[level]
        }
      }
    }
  },
  didRemoveNotification(uid) {
    let notification
    let notifications = this.state.notifications.filter(candidateNotification => {
      if (candidateNotification.uid === uid)
        notification = candidateNotification

      return candidateNotification.uid !== uid
    })

    if (notification && notification.onRemove)
      notification.onRemove(notification)

    this.setState({notifications})
  },
  checkForErrorsOnAdd(notification) {
    if (!notification.level)
      throw new Error('notification level is required.')

    if (Object.keys(Constants.levels).indexOf(notification.level) === -1)
      throw new Error(`'${notification.level}' is not a valid level.`)

    if (isNaN(notification.autoDismiss))
      throw new Error("'autoDismiss' must be a number.")

    if (Object.keys(Constants.positions).indexOf(notification.position) === -1)
      throw new Error(`'${notification.position}' is not a valid position.`)
  },
  addNotification(notification) {
    let clonedNotification = {...Constants.notification, ...notification}
    let notifications = this.state.notifications

    this.checkForErrorsOnAdd(clonedNotification)

    clonedNotification.position = clonedNotification.position.toLowerCase()
    clonedNotification.level = clonedNotification.level.toLowerCase()
    clonedNotification.autoDismiss = parseInt(clonedNotification.autoDismiss, 10)
    clonedNotification.uid = clonedNotification.uid || this.uid
    clonedNotification.ref = `notification-${clonedNotification.uid}`
    this.uid += 1

    // Do not add if the notification already exists based on supplied UID:
    for (let index = 0; index < notifications.length; index++) {
      if (notifications[index].uid === clonedNotification.uid)
        return false
    }

    notifications.push(clonedNotification)

    if (typeof clonedNotification.onAdd === 'function')
      notification.onAdd(clonedNotification)

    this.setState({notifications})

    return clonedNotification
  },
  removeNotification(notification) {
    Object.keys(this.refs).forEach(container => {
      if (container.indexOf('container') > -1) {
        Object.keys(this.refs[container].refs).forEach(ref => {
          let uid = notification.uid ? notification.uid : notification
          if (ref === `notification-${uid}`)
            this.refs[container].refs[ref].hideNotification()
        })
      }
    })
  },
  clearNotifications() {
    Object.keys(this.refs).forEach(container => {
      if (container.indexOf('container') > -1)
        Object.keys(this.refs[container].refs).forEach(ref => this.refs[container].refs[ref].hideNotification())
    })
  },

  render() {
    let containers = null
    let allNotifications = this.state.notifications

    if (allNotifications.length) {
      containers = Object.keys(Constants.positions).map(position => {
        let notifications = allNotifications.filter(notification => position === notification.position)

        if (!notifications.length)
          return null

        return (
          <NotificationContainer
            allowHTML={this.props.allowHTML}
            getStyles={this.getStyles}
            key={position}
            noAnimation={this.props.noAnimation}
            notifications={notifications}
            onRemove={this.didRemoveNotification}
            position={position}
            ref={`container-${position}`}
          />
        )
      })
    }

    return (
      <div className='notifications-wrapper' style={this.getStyles.wrapper()}>
        {containers}
      </div>
    )
  }
})

export default NotificationSystem
