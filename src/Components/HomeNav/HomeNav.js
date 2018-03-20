/**
 * Created by pc on 2017/8/2.
 */
import React, {Component} from 'react'
import {hashHistory, Link} from 'react-router';
import {HomeNavState} from "../../action/action.homenav"
import {connect} from 'react-redux'
import '../../Style/HomeNav/nav.less'
import utils from '../../common/utils'

class TabBarExample extends Component {
  constructor() {
    super(...arguments);
    this.RouteGo = this.RouteGo.bind(this)
    this.RouterState = this.RouterState.bind(this)
    this.baiduTongJi = this.baiduTongJi.bind(this)
    this.dispatchTab = this.dispatchTab.bind(this)
  }

  componentDidMount() {
    this.RouterState();
  }

  RouteGo(path) {
    hashHistory.push(path);
  }

  transform(type) {
    switch (type) {
      case 'home':
        return '首頁';
        break;
      case 'match':
        return '比赛';
        break;
      case 'find':
        return '发现';
        break;
      case 'my':
        return '我的';
        break;
    }
  }

  dispatchTab(type, route) {
    this.props.dispatch(HomeNavState(type));
    this.RouteGo(route)
  }

  baiduTongJi() {
    const {agoNavState, navState} = this.props;
    if (agoNavState && agoNavState != navState) {
      let agonav = this.transform(agoNavState);
      let nav = this.transform(navState);
      utils.baiduStatEventListen('', `${agonav}`, `${nav}`);
      return true;
    }
    return false;
  }

  RouterState() {
    this.props.dispatch(HomeNavState(this.props.navState));
  }

  render() {
    console.log()
    this.baiduTongJi();
    return (
      <div className="homeNavBar_fixed ">
        <div className="homeNavBar_h am-tab-bar-bar"></div>
        <div id="homeNavBar">
          <a onClick={() => {
            this.dispatchTab('home', '/index')
          }} className={this.props.navState === 'home' ? "homeNavBar_1 on" : "homeNavBar_1"}>首页</a>
          <a onClick={() => {
            this.dispatchTab('match', '/match')
          }} className={this.props.navState === 'match' ? "homeNavBar_2 on" : "homeNavBar_2"}>比赛</a>
          <a onClick={() => {
            this.dispatchTab('find', '/find')
          }} className={this.props.navState === 'find' ? "homeNavBar_3 on" : "homeNavBar_3"}>发现</a>
          <a onClick={() => {
            this.dispatchTab('my', '/my')
          }} className={this.props.navState === 'my' ? "homeNavBar_4 on" : "homeNavBar_4"}>我的</a>
        </div>
      </div>

    );
  }
}

function select(state) {
  return {
    navState: state.HomeNavReduce,
    agoNavState: state.HomeNavState
  }
}

export default connect(select)(TabBarExample)
