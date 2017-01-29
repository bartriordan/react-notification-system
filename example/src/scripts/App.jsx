import React from 'react'
import ReactDOM from 'react-dom'
import NotificationSystem from 'NotificationSystem'
import constants from 'constants'
import NotificationGenerator from './NotificationGenerator'
import CustomElement from './CustomElement'

import 'styles/base'

const EXAMPLE_NOTIFICATIONS = [
  {
    action: {
      label: 'Awesome!',
      callback() { console.log('Clicked') }
    },
    level: 'success',
    message: 'Now you can see how easy it is to use notifications in React!',
    position: 'tr',
    title: "Hey, it's good to see you!"
  },
  {
    children: (
      <div>
        <CustomElement name="I'm a prop" />
      </div>
    ),
    level: 'success',
    message: 'I come with custom content!',
    position: 'tr',
    title: 'Hey, it\'s good to see you!'
  },
  {
    autoDismiss: 0,
    level: 'success',
    message: 'Just kidding, you can click me.',
    position: 'tr',
    title: "I'll be here forever!"
  },
  {
    level: 'error',
    message: 'Four notification types: `success`, `error`, `warning` and `info`',
    position: 'tl',
    title: 'Bad things can happen too!'
  },
  {
    level: 'info',
    message: 'Showing all possible notifications works better on a larger screen',
    position: 'tc',
    title: 'Advise!'
  },
  {
    action: {
      label: 'Got it!'
    },
    level: 'warning',
    message: "It's not a good idea show all these notifications at the same time!",
    position: 'bc',
    title: 'Warning!'
  },
  {
    level: 'success',
    message: "I'm out of ideas",
    position: 'bl',
    title: 'Success!'
  },
  {
    autoDismiss: 0,
    level: 'error',
    message: 'Until you click me.',
    position: 'br',
    title: "I'm here forever..."
  }
]

const getRandomPosition = () => {
  let positions = Object.keys(constants.positions)
  return positions[Math.floor(Math.random() * ((positions.length - 1) + 1)) + 0]
}


class NotificationSystemExample extends React.Component {
  constructor() {
    super()

    this.magicCount = 0
    this.notificationSystem = null
  }
  getInitialState() { return { allowHTML: false, viewHeight: null} }
  componentWillMount() { this.setState({ viewHeight: window.innerHeight }) }
  componentDidMount() { this.notificationSystem = this.refs.notificationSystem }
  allowHTML(allow) { this.setState({allowHTML: allow}) }
  notificationSystemInstance() { return this.notificationSystem }
  showTheMagic() {
    EXAMPLE_NOTIFICATIONS.forEach(notification => {
      let clonedNotification = notification
      if (this.magicCount > 0)
        clonedNotification.position = getRandomPosition()

      this.notificationSystem.addNotification(clonedNotification)
    })
    this.magicCount++
  }

  render() {
    return (
      <div className='app-container'>
        <header style={{minHeight: this.state.viewHeight}} className='header gradient'>
          <div className='overlay' />
          <div className='content'>
            <h1 className='title'>React Notification System</h1>
            <h2 className='subtitle'>A complete and totally customizable component for notifications in React.</h2>
            <h3 className='versions'>(For React 15, 0.14 and 0.13)</h3>
            <div className='btn-show-magic-holder'>
              <button className='btn btn-outline btn-show-magic' onClick={this.showTheMagic}>
                Show me what it can do!
              </button>
              <span className='width-warning'>Better experience in larger screens</span>
              <small className='more-magic'>Click twice for more awesomeness!</small>
            </div>
            <div className='github-buttons'>
              <a className='github-button' href='https://github.com/igorprado/react-notification-system' data-style='mega' data-icon='octicon-star' data-count-href='/igorprado/react-notification-system/stargazers' data-count-api='/repos/igorprado/react-notification-system#stargazers_count' data-count-aria-label='# stargazers on GitHub' aria-label='Star igorprado/react-notification-system on GitHub'>Star</a>
              <a className='github-button' href='https://github.com/igorprado/react-notification-system/fork' data-style='mega' data-icon='octicon-repo-forked' data-count-href='/igorprado/react-notification-system/network' data-count-api='/repos/igorprado/react-notification-system#forks_count' data-count-aria-label='# forks on GitHub' aria-label='Fork igorprado/react-notification-system on GitHub'>Fork</a>
            </div>
          </div>
        </header>
        <div className='wrapper'>
          <NotificationGenerator notifications={this.notificationSystemInstance} allowHTML={this.allowHTML} />
        </div>
        <footer className='footer gradient'>
          <div className='overlay' />
          <div className='wrapper'>
            <p>Made in Brasília, Brazil by <a href='http://igorprado.com' target='_blank'>Igor Prado</a>.</p>
          </div>
        </footer>
        <NotificationSystem ref='notificationSystem' allowHTML={this.state.allowHTML} />
      </div>
    )
  }
}

ReactDOM.render(React.createElement(NotificationSystemExample), document.getElementById('app'))
