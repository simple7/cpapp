import React, {Component} from 'react'
import {NavBar} from 'antd-mobile'
import {hashHistory} from 'react-router'
import moment from 'moment'
import utils from '../../common/utils'
import '../../Style/My/MyRed.css'

function computeRed(deadDate) {
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  return Math.ceil((moment(deadDate) - moment()) / dayMilliseconds);
}

/* 使用红包 */
class UseRed extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight: ''
    }
  }

  componentDidUpdate() {
    let noUseRedBtn = document.getElementsByClassName('noUseRedBtn')[0];
    if (noUseRedBtn.offsetHeight !== 0 && this.state.listHeight === '') {
      this.setState({
        listHeight: utils.setHeight() - noUseRedBtn.offsetHeight
      })
    }

  }

  render() {
    let _this = this
    return (
      <div>
        <NavBar
          className="myNav"
          mode="dark"
          onLeftClick={() => this.props.childBack('1')}
          rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
          style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
        >使用红包</NavBar>
        <div className="listDivView" style={{height: this.state.listHeight}}>
          {(this.props.canUseRed && this.props.canUseRed.length > 0) &&
          <div>
            <div className="useRedTitle">
              <span>可使用红包</span>
              <div className="questionBox questionBoxXin">
                <a onClick={() => this.props.childBack('3')} className="questionLink">红包说明</a>
              </div>
            </div>
            <div className="redList redList1">
              {this.props.canUseRed.map((item, index) => {
                let arr = item.scale.split('/');
                let money = parseInt(_this.props.imoney / arr[1]) * arr[0]
                return (
                  <a className="redBox" onClick={() => {
                    _this.props.clickRed(item)
                    _this.props.childBack('1')
                  }} key={`canuse_${index}`}>
                    <div className="redBox1 redBoxBg1">
                      <p className="p1">
                        <span>￥</span>{money < item.irmoney ? money : item.irmoney}
                      </p>
                      <p className="p2">本次可用</p>
                    </div>
                    <div className="redBox2">
                      <p className="p3">{item.crpname + (arr[0] ? ('(满' + arr[1] + '减' + arr[0] + ')') : '')}</p>
                      <p className="p4">{`有效期至${moment(item.cddate).format('YYYY-MM-DD')}`}</p>
                      <p className="p5">{`红包余额${item.irmoney}元`}</p>
                    </div>
                    {computeRed(item.cddate) <= 3 &&
                    <div className="redBox3">{computeRed(item.cddate)}天后过期</div>
                    }
                    {
                      _this.props.chooseRed.cptid === item.cptid ?
                        <div className="checkedIcon active"/>
                        :
                        <div className="checkedIcon"/>
                    }
                  </a>
                )
              })
              }
            </div>
          </div>
          }
          {(this.props.noCanUse && this.props.noCanUse.length > 0) &&
          <div>
            <div className="useRedTitle">
              <span>不可使用红包</span>
            </div>
            <div className="redList redList1">
              {
                this.props.noCanUse.map((item, index) => {
                  let arr = item.scale.split('/');
                  let money = parseInt(_this.props.imoney / arr[1]) * arr[0]
                  return (
                    <a className="redBox" key={`nouse_${index}`}>
                      <div className="redBox1 redBoxBg1">
                        <p className="p1">
                          <span>￥</span>{item.imoney}
                        </p>
                        <p className="p2">{'余额:'+item.irmoney}</p>
                      </div>
                      <div className="redBox2">
                        <p className="p3">{`${item.crpname}(满${arr[1]}减${arr[0]})`}</p>
                        <p className="p4">{`有效期至${moment(item.cddate).format('YYYY-MM-DD')}`}</p>
                        <p className="p5"></p>
                      </div>
                      {computeRed(item.cddate) <= 3 &&
                      <div className="redBox3">{computeRed(item.cddate)}天后过期</div>
                      }
                      <div className="redBox4"></div>
                    </a>
                  )
                })
              }

            </div>
          </div>
          }
        </div>
        <div className="noUseRedBtn" onClick={() => {
          _this.props.clickRed({})
          _this.props.childBack('1')
        }}>不使用红包
        </div>
      </div>
    )
  }
}

export default UseRed

