import React from 'react'
import NotificationItem from './NotificationItem'


export default class NotificationContainer extends React.Component {
  constructor() {
    super()

    this.style = {}
  }
  componentWillMount() {
    // Fix position if width is overridden:
    this.style = this.props.getStyles.container(this.props.position)

    if (this.props.getStyles.overrideWidth && ['bc', 'tc'].includes(this.props.position))
      this.style.marginLeft = -(this.props.getStyles.overrideWidth / 2)
  }

  render() {
    if (['bc', 'bl', 'br'].includes(this.props.position))
      this.props.notifications.reverse()

    return (
      <div className={`notifications-${this.props.position}`} style={this.style}>
        {
          this.props.notifications.map(notification => {
            return (
              <NotificationItem
                allowHTML={this.props.allowHTML}
                children={this.props.children}
                getStyles={this.props.getStyles}
                key={notification.uid}
                noAnimation={this.props.noAnimation}
                notification={notification}
                onRemove={this.props.onRemove}
                ref={`notification-${notification.uid}`}
              />
            )
          })
        }
      </div>
    )
  }
}

NotificationContainer.propTypes = {
  allowHTML: React.PropTypes.bool,
  children: React.PropTypes.node,
  getStyles: React.PropTypes.object,
  noAnimation: React.PropTypes.bool,
  notifications: React.PropTypes.array.isRequired,
  onRemove: React.PropTypes.func,
  position: React.PropTypes.string.isRequired
}
