'use strict'
import React, {Component} from 'react'
import {NavBar, Tabs, Badge, List} from 'antd-mobile'
import {connect} from 'react-redux'
import {HomeNav} from '../../action/action.homenav'
import MatchWansai from './MatchComponent/MatchWansai'
import MatchJishi from './MatchComponent/MatchJishi'

import '../../Style/Find/lotteryResults.css'

const TabPane = Tabs.TabPane;

class Match extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      activeKey: '1'
    }
    this.changeView = this.changeView.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(HomeNav('match'))
  }

  changeView(key) {
    this.setState({
      activeKey: key
    })
  }

  render() {
    return (
      <div id="lotteryResults">
        <Tabs activeKey={this.state.activeKey} swipeable={false} onTabClick={this.changeView} animated={false}>
          <TabPane tab={<Badge>即时</Badge>} key="1">
              <MatchJishi/>
          </TabPane>
          <TabPane tab={<Badge>完赛</Badge>} key="2">
              <MatchWansai/>
          </TabPane>
        </Tabs>
      </div>

    )
  }
}



function select(state) {
  return {
    navState: state.HomeNav
  }
}

export default connect(select)(Match)
