import {Component} from 'react'
import {PropTypes} from 'prop-types'

import NotificationItem from './NotificationItem'


export default class NotificationContainer extends Component {
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
    if (['tc', 'tl', 'tr'].includes(this.props.position)) // Newest notifications on top when container is at the top
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
  allowHTML: PropTypes.bool,
  children: PropTypes.node,
  getStyles: PropTypes.object,
  noAnimation: PropTypes.bool,
  notifications: PropTypes.array.isRequired,
  onRemove: PropTypes.func,
  position: PropTypes.string.isRequired
}
