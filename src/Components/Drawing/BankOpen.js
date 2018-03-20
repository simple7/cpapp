'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import '../../Style/Drawing/bankOpen.css'

import {BankOpenAPI} from '../../Stubs/API'
import utils from '../../common/utils'
import { connect } from 'react-redux'
import { setbankName } from '../../action/action.bankdraw'

import {List} from 'antd-mobile'
import CommonNavBar from '../CommonComts/CommonNavBar'
const Item = List.Item;

const ListDesc = props => {
  return (
    <div className="OpenTips">{props.desc}
      {props.recommend?(<span>{props.recommend}</span>):''}</div>
  )
}

class ListDepositBank extends Component {
  constructor(props) {
    super(props);
    this.click = this.click.bind(this);
  }
  click(D) {
    this.props.dispatch(setbankName(D));
    hashHistory.go(-1);
  }
  render() {
    let {itemRow} = this.props;
    return (
      <div>
        {itemRow.map((D, i) => {
          return (
            <div key={D.bCode} className="clearfix openBox" onClick={()=> {this.click(D)}}>
              <img src={D.logoUrl}/>
              <p>{D.name}</p>
            </div>
          )
        })}

      </div>
    )
  }
}

class BankAdd extends Component {
  constructor(props){
    super(props)
    this.state ={
      depositBank: [],
      lineHeight: 0
    }
  }
  componentWillMount() {
    document.activeElement.blur();
    this.initialize();
  }

  componentDidMount() {
    this.setState({
      lineHeight: utils.setHeight()
    })
  }

  initialize() {
    BankOpenAPI('').then(res=> {
      if(res.code === '0'){
        this.setState({
          depositBank: res.rows
        }, ()=> {})
      }else if(res.code === '1'){
        utils.showAlert('温馨提示', '未登录账号', '去登录', () => {
          hashHistory.push('loginIndex')
        })
      }

    })
  }
  render() {
    let { dispatch, bankName} = this.props;
    let {lineHeight} = this.state;
    return (
      <div id="bankOpen">
        {/*<NavBar leftContent=""
                mode="dark"
                onLeftClick={() => hashHistory.go(-1)}
                rightContent={[
                <span key="0" className="rulesSpan"></span>
      ]}
        >选择开户银行</NavBar>*/}
        <CommonNavBar title="选择开户银行" />
        <div className="bankOpenList" style={{height:lineHeight,overflow:'auto'}}>
          {
            this.state.depositBank.map((item, index) => {
              return (
                <div key={index}>
                  <ListDesc desc={item.desc} recommend={item.recommend}></ListDesc>
                  <ListDepositBank itemRow={item.row} dispatch={dispatch}></ListDepositBank>
                </div>
              )
            })
          }
          <p className="tipsBankOpen">更多银行即将加入</p>
        </div>
      </div>
    )
  }
}

function select(state){
  return {
    bankName : state.BankName,
  }
}

export default connect(select)(BankAdd)
