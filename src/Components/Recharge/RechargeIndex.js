'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import {List, Flex, InputItem, Popup} from 'antd-mobile'
import commonConfig from '../../config/commonConfig'
import {createForm} from 'rc-form';
import RechargeCommon from './RechargeCommon'
import {rechargeRoute} from '../../Stubs/API'
import utils from '../../common/utils'
import '../../Style/Recharge/recharge.css'

class ChildComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: '',
      onSelect: '1',
      payMoney: '100',
    }
    this.moneyCash = '';
    this.chooseMoney = this.chooseMoney.bind(this);
    this.doRecharge = this.doRecharge.bind(this);
    this.clickInput = this.clickInput.bind(this);
    this.inputMoney = this.inputMoney.bind(this);
  }

  /**
   * 点击固定金额
   * @param e
   */
  chooseMoney(e) {
    let dataSet = e.target.dataset;
    if (this.state.inputValue !== '') {
      this.setState({
        inputValue: ''
      })
    }
    this.setState
    ({
      onSelect: dataSet.index,
      payMoney: dataSet.value
    })
  }

  clickInput() {
    if (this.state.inputValue === '') {
      this.setState({
        payMoney: this.state.inputValue,
        onSelect: '-1'
      })
    }
  }

  inputMoney(money) {
    console.log(money.length)
    this.setState({
      inputValue: money.replace(/\D/g, ''),
      payMoney: money.replace(/\D/g, '')
    })
  }



  /**
   *点击去充值 向上弹框
   *0:默认充值
   *
   *
   */
  doRecharge() {
    rechargeRoute(this.state.payMoney).then(res=>{
      if(res.code==='0'){
        let rechargeWay = res.rechargeWay
        Popup.show(
          <RechargeCommon payMoney={this.state.payMoney} rechargeWay = {rechargeWay} type="0"/>,
          {
            animationType: 'slide-up',
            maskClosable: false,
          }
        )
      }else{
        utils.wxMessage('',res.desc)
      }
    })
  }

  componentWillUnmount() {
    Popup.hide()
  }

  render() {
    const {getFieldProps} = this.props.form;
    let {children} = this.props;
    let content;
    if (children) {
      content = children
    } else {
      content = <div id="recharge" tabIndex="0">
        <CommonNavBar rightContent={[<Link to="my/accountDetails">明细</Link>]}
                      title="充值"/>
        <div className="topContent">
          <div className="tips1">充值需消费50%～100%，奖金提现无限制</div>
          <div className="rechargeBox">
            <List id="rechargeMoney">
              <InputItem
                {...getFieldProps('normal', {
                  normalize: (v) => {
                    if (v && (v.charAt(0) === '0' || v.indexOf('.') >= 0)) {
                      return v.replace(/^0*(\d*).*$/, '$1');
                    }
                    return v;
                  },
                  onChange: value => this.inputMoney(value.indexOf('0') === 0 ? value.substring(0, value.indexOf('0')) : value)
                })}
                onFocus={this.clickInput}
                type="phone"
                clear
                value={this.state.inputValue}
                maxLength={"5"}
                className="moneyInput"
                placeholder="手动输入充值金额"
              />
            </List>

            {/*<span className="delSpan3" style={{display: this.state.moneyX ? '' : 'none'}}
             onClick={this.delCommon.bind(this, 'phoneNumber', 'phoneX')}></span>*/}
            <Flex justify="between" wrap="wrap" className="rechargeMoney">
              <div data-index="0" data-value="50" onClick={this.chooseMoney}
                   className={this.state.onSelect == '0' ? "inline on" : "inline"}>50元
              </div>
              <div data-index="1" data-value="100" onClick={this.chooseMoney}
                   className={this.state.onSelect == '1' ? "inline on" : "inline"}>100元
              </div>
              <div data-index="2" data-value="500" onClick={this.chooseMoney}
                   className={this.state.onSelect == '2' ? "inline on" : "inline"}>500元
              </div>
              <div data-index="3" data-value="1000" onClick={this.chooseMoney}
                   className={this.state.onSelect == '3' ? "inline on" : "inline"}>1000元
              </div>
              <div data-index="4" data-value="5000" onClick={this.chooseMoney}
                   className={this.state.onSelect == '4' ? "inline on" : "inline"}>5000
              </div>
              <div data-index="5" data-value="10000" onClick={this.chooseMoney}
                   className={this.state.onSelect == '5' ? "inline on" : "inline"}>10000元
              </div>
            </Flex>
          </div>
          <div className="rechargeBtn"><a onClick={this.state.payMoney ? this.doRecharge : ''}
                                          className={this.state.payMoney ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>去充值{this.state.payMoney ? '￥' + this.state.payMoney : ''}</a>
          </div>
          <div className="tips2">
            <a style={{color: '#9e9e9e'}}>点击去充值，即表示您已同意</a>
            <a onClick={() => {
              hashHistory.push({
                pathname: 'linkPage',
                query: {
                  url: commonConfig.mobileDomain + '/app/doc/czxy.html',
                  title: '充值协议'
                }
              })
            }}>《充值协议》</a>
          </div>
        </div>
        <div className="footerLinkBox">
          <a
            onClick={() => {
              hashHistory.push({
                pathname: 'my/accountDetails',
                query: {
                  active: '2'
                }
              })
            }}
            className="footerLinkA"
          >充值明细</a></div>
      </div>
    }
    return (
      <div id="rechargeIndex" tabIndex="0" style={{height: '100%'}}>
        {content}
      </div>
    )
  }
}

const Recharge = createForm()(ChildComponent);

export default Recharge
