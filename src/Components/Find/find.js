import React, {Component} from 'react'
import {connect} from 'react-redux'
import {newDiscover} from '../../Stubs/API'
import '../../Style/Find/find.less'
import {Link, hashHistory} from 'react-router'
import _ from 'lodash';
import commonConfig from '../../config/commonConfig'
import {KjAction} from "../../action/action.find"
import {HomeNav} from '../../action/action.homenav'
import { AppJiek } from '../../common/AppApi'

import findImg from "../../Img/MyIndex/find_img.png"

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routeGo: this.props.routeGo,
    }
    this.initialize = this.initialize.bind(this);
  }

  componentWillMount() {
    this.initialize()
  }

  initialize() {
    let type = 'noLoad'
    if (this.props.kjResult.flag === '1') {
      type = '';
    }
    newDiscover(type).then(result => {
      if (result.code === '0') {
        let rows = result.rows;
        console.log(rows)
        if (rows) {
          let row = rows[0].row
          //兼容iphone5
          if (_.isArray(row)) {
            row = row[0]
          }
          let lotteryCode = row.content
          let arr = lotteryCode.split('|');
          let red = arr[0].split(',');
          let blue = arr[1].split(',');
          let pid = row.subtitle;
          this.props.dispatch(KjAction({
            red,
            blue,
            pid,
          }))
        }

      }
    })
  }

  render() {
    return (
      <section className="margin_b25">
        <a className="clearfix header_find" onClick={() => hashHistory.push('/lotteryResults')}>
          <img src={findImg} className="findImg"/>
          <div className="header_div">
            <p className="p1">开奖结果</p>
            <p className="p2">{this.props.kjResult.pid}</p>
            <p className="p3 clearfix">
              {
                this.props.kjResult.red.map((item, index) => {
                  return (
                    <span className="ballRed" key={index}>{item}</span>
                  )
                })
              }
              {this.props.kjResult.blue.map((item, index) => {
                return (
                  <span className="ballBlue" key={index}>{item}</span>
                )

              })}

            </p>
          </div>
        </a>
      </section>
    )

  }
}

export class Foot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.checkLogin = this.checkLogin.bind(this);
  }

  checkLogin() {
    AppJiek.thirdAppLoginCheck(()=> {
      location.href = `${commonConfig.domain}sdjc/jcds.html`
    })
  }

  render() {
    // console.log(this.props)
    let that = this;
    return (
      <div className="">
        <section className="myhb_wrap margin_b25">
          <div><a className="hongbaoA" onClick={this.checkLogin}>
            <span className="span1 hongbaoIcon5">竞彩大神</span>
          </a></div>
          <div><a className="hongbaoA"
                  onClick={() => {
                    hashHistory.push({
                      pathname: 'linkPage',
                      query: {
                        url: commonConfig.domain+'activity/ttjx/index.html?from=app',
                        title: '天天推球'
                      }
                    })
                  }}
          >
            <span className="span1 hongbaoIcon6">天天推球</span>
          </a>
          </div>
        </section>
        <section className="myhb_wrap margin_b25">
          <div><a className="hongbaoA"
                  onClick={() => {
                    hashHistory.push({
                      pathname: 'linkPage',
                      query: {
                        url: commonConfig.domain+'zqzlk/?from=iosapp',
                        title: '足球资料库'
                      }
                    })
                  }}
          >
            <span className="span1 hongbaoIcon7">足球资料库</span>
          </a></div>
          <div><Link className="hongbaoA" to="forecast">
            <span className="span1 hongbaoIcon8">预测与分析</span>

          </Link></div>
          <div><Link className="hongbaoA" to='noticeList'>
            <span className="span1 hongbaoIcon9">消息公告</span>
          </Link></div>
        </section>
        <section className="myhb_wrap">
          <div><a className="hongbaoA" href="https://5.9188.com/activity/yxzx/index.html">
            <span className="span1 hongbaoIcon10">游戏中心</span>
            <span className="span3">礼包福利领不停</span>
          </a></div>
        </section>
      </div>
    )
  }
}

class Find extends Component {
  constructor(props) {
    super(props);
    this.routeGo = this.routeGo.bind(this)
  }

  routeGo(path) {
    hashHistory.push(path);
  }

  componentWillMount() {
    this.props.dispatch(HomeNav('find'))
  }

  render() {
    return (
      <div id="find">
        <Header routeGo={this.routeGo} dispatch={this.props.dispatch} kjResult={this.props.kjResult}/>
        <Foot routeGo={this.routeGo}/>
      </div>
    )
  }
}

function select(state) {
  return {
    kjResult: state.KjResult
  }
}

export default connect(select)(Find)
