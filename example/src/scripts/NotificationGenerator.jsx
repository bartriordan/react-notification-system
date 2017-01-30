import React from 'react'

import 'styles/generator'


export default class NotificationGenerator extends React.Component {
  constructor(props) {
    super(props)

    this.lastNotificationAdded = null
    this._notificationSystem = props.notifications || {addNotification() {}}
    this.state = {
      notification: {
        title: 'Default title',
        message: 'Default message',
        level: 'error',
        position: 'tr',
        autoDismiss: 5,
        dismissible: true,
        action: null,
        actionState: false
      },
      allowHTML: false
    }

    this.removeLastNotification = this.removeLastNotification.bind(this)
    this.notify = this.notify.bind(this)
    this._changedAllowHTML = this._changedAllowHTML.bind(this)
    this._changed = this._changed.bind(this)
    this.onRemove = this.onRemove.bind(this)
    this._changedDismissible = this._changedDismissible.bind(this)
    this._changedAction = this._changedAction.bind(this)
    this._changedActionLabel = this._changedActionLabel.bind(this)
  }
  componentDidMount() { this._notificationSystem = this.props.notifications }
  // componentWillReceiveProps(nextProps) {
  //   this._notificationSystem = nextProps.notifications
  // }
  // _notificationSystem() {
  //   console.log('*'.repeat(80))
  //   console.log({addNotification() {}})
  //   console.log('*'.repeat(80))
  //   return {addNotification() {}}
  // }
  notify(event) {
    event.preventDefault()
    let notification = this.state.notification

    notification.onRemove = this.onRemove

    console.log('Notification object', notification)
    this.lastNotificationAdded = this._notificationSystem().addNotification(notification)
    this.setState({})
  }
  removeLastNotification(event) {
    event.preventDefault()
    if (this.lastNotificationAdded)
      this._notificationSystem().removeNotification(this.lastNotificationAdded)
  }
  _changed(event) {
    let notification = this.state.notification
    let prop = event.target.name
    let value = event.target.value

    if (prop === 'autoDismiss')
      value = (value === '' ? 0 : parseInt(value, 10))

    notification[prop] = value

    this.setState({notification})
  }
  onRemove(notification) {
    if (this.lastNotificationAdded && notification.uid === this.lastNotificationAdded.uid)
      this.lastNotificationAdded = null

    this.setState({})
    console.log('%cNotification ' + notification.uid + ' was removed.', 'font-weight: bold color: #eb4d00')
  }
  _changedDismissible() {
    let notification = this.state.notification
    notification.dismissible = !notification.dismissible

    this.setState({notification})
  }
  _changedAllowHTML() {
    let state = this.state
    let allowHTML = !this.state.allowHTML

    if (allowHTML)
      state.notification.message += ' <strong>I\'m bold!</strong>'

    state.allowHTML = allowHTML
    this.setState(state)
    this.props.allowHTML(allowHTML)
  }
  _callbackForAction() { console.log('%cYou clicked an action button inside a notification!', 'font-weight: bold color: #008feb') }
  _changedAction() {
    let notification = this.state.notification
    notification.actionState = !notification.actionState

    if (notification.actionState) {
      notification.action = {
        label: 'I\'m a button',
        callback: this._callbackForAction
      }
    } else {
      notification.action = null
    }

    this.setState({notification})
  }
  _changedActionLabel(event) {
    let notification = this.state.notification
    notification.action.label = event.target.value
    this.setState({notification})
  }

  render() {
    let notification = this.state.notification
    let error = {
      position: 'hide',
      dismissible: 'hide',
      level: 'hide',
      action: 'hide'
    }
    let action = null
    let removeButton = null

    if (notification.actionState) {
      action = (
        <div className='form-group'>
          <label>Label:</label>
          <input className='form-control' name='label' onChange={this._changedActionLabel} type='text' value={notification.action.label} />
        </div>
      )
    }

    if (this.lastNotificationAdded) {
      removeButton = (
        <div className='form-group'>
          <button className='btn btn-block btn-danger' onClick={this.removeLastNotification}>Programmatically remove last notification!</button>
        </div>
      )
    }

    if (notification.position === 'in')
      error.position = 'text-danger'

    if (notification.level === 'in')
      error.level = 'text-danger'

    if (!notification.dismissible && !notification.actionState) {
      error.dismissible = 'text-danger'
      error.action = 'text-danger'
    }

    return (
      <div className='generator'>
        <h2>Notification generator</h2>
        <p>Open your console to see some logs from the component.</p>
        <div className='form-group'>
          <label>Title:</label>
          <input className='form-control' name='title' onChange={this._changed} type='text' value={notification.title} />
          <small>Leave empty to hide.</small>
        </div>
        <div className='form-group'>
          <label>Message:</label>
          <input className='form-control' name='message' onChange={this._changed} type='text' value={notification.message} />
            <small>
              <label>
                <input checked={this.state.allowHTML} onChange={this._changedAllowHTML} type='checkbox' /> Allow HTML in message?
              </label>
            </small>
        </div>
        <div className='form-group'>
          <label>Position:</label>
          <select className='form-control' name='position' onChange={this._changed} value={notification.position}>
            <option value='tl'>Top left (tl)</option>
            <option value='tr'>Top right (tr)</option>
            <option value='tc'>Top center (tc)</option>
            <option value='bl'>Bottom left (bl)</option>
            <option value='br'>Bottom right (br)</option>
            <option value='bc'>Bottom center (bc)</option>
            <option value='in'>Invalid position</option>
          </select>
          <small className={error.position}>Open console to see the error after creating a notification.</small>
        </div>
        <div className='form-group'>
          <label>Level:</label>
          <select className='form-control' name='level' onChange={this._changed} value={notification.level}>
            <option value='success'>Success (success)</option>
            <option value='error'>Error (error)</option>
            <option value='warning'>Warning (warning)</option>
            <option value='info'>Info (info)</option>
            <option value='in'>Invalid level</option>
          </select>
          <small className={error.level}>Open console to see the error after creating a notification.</small>
        </div>
        <div className='form-group'>
          <label>Auto Dismiss:</label>
          <input className='form-control' name='autoDismiss' onChange={this._changed} type='text' value={notification.autoDismiss} />
          <small>secs (0 means infinite)</small>
        </div>
        <div className='form-group'>
          <div className='checkbox'>
            <label>
              <input checked={notification.dismissible} onChange={this._changedDismissible} type='checkbox' /> Can user dismiss?
            </label>
          </div>
        </div>
        <div className='form-group'>
          <div className='checkbox'>
            <label>
              <input checked={notification.actionState} onChange={this._changedAction} type='checkbox' /> Set up an action?
            </label>
          </div>
          {action}
        </div>
        <small style={{marginLeft: 0}} className={error.dismissible}>This notification will be only dismissible programmatically or after "autoDismiss" timeout (if set).</small>
        {removeButton}
        <div className='form-group'>
          <button className='btn btn-primary btn-block btn-notify' onClick={this.notify}>Notify!</button>
        </div>
      </div>
    )
  }
}

NotificationGenerator.propTypes = {
  allowHTML: React.PropTypes.func,
  notifications: React.PropTypes.func.isRequired
}
