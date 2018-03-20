import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {MoreLotteryRouter} from '../../common/lotteryRoute'
import {NavBar} from 'antd-mobile'
import {HomeMoreAction} from '../../action/action.home'
import '../../Style/HomeConent/LotteryHompage.css'


class More extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight: ''
    }
  }

  componentDidMount() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    let listHeight = w - 44
    this.setState({
      listHeight: listHeight
    })
  }

  render() {
    return (
      <div className="indexMore">
        <NavBar className="myNav"
                iconName="cross"
                mode="dark"
                onLeftClick={() => {
                  hashHistory.push('/')
                }}
                style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
        >更多彩种</NavBar>
        <div className="noMargin listDivView" style={{height: this.state.listHeight, zIndex:999}}>
          <div className="lottery_content">
            <div className="touzhuDiv clearfix">
              {
                MoreLotteryRouter.map((item, index) => {
                  return (
                    <div className="touzhuC" key={index} data-evid={item.evid}
                        onClick={() => {
                          hashHistory.push(item.route)
                        }}
                    >
                      <img src={item.imgUrl} alt=""/>
                      <p>{item.lotteryName}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function select(state) {
  return {
    showState: state.HomeMoreReduce,
    HomeBanner: state.HomeBannerReduce
  }
}

export default connect(select)(More)

