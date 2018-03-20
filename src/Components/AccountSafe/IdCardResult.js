'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import utils from '../../common/utils'
import '../../Style/Recharge/bankAdd.css'

import {NavBar, List, InputItem} from 'antd-mobile'

const Item = List.Item;

class IdCard1 extends Component {
  constructor() {
    super(...arguments)
    console.log(this.props)
    this.state = {
      realName: '',
      idCard: ''
    }
  }
  componentWillMount() {
    let userData = this.props.location.state.userData
    let name = this.props.location.state.name
    let idCard = this.props.location.state.idCard
    if (userData) {
      let realName = userData.realname
      let idCard = userData.idcard
      idCard = utils.aesCode(idCard)
      let idCardHide = idCard.slice(4,-4)
      idCardHide = idCardHide.replace(/\S/g,'*')
      idCard = idCard.slice(0,4) + idCardHide + idCard.slice(-4)
      this.setState({
        realName:realName,
        idCard: idCard
      })
    }else if(name && idCard){
      let realName = ('*'+name.slice(1))
      let idCardHide = idCard.slice(4,-4)
      idCardHide = idCardHide.replace(/\S/g,'*')
      idCard = idCard.slice(0,4) + idCardHide + idCard.slice(-4)
      this.setState({
        realName:realName,
        idCard: idCard
      })
    }
  }

  render() {
    return (
      <div id="bankAdd">
        <CommonNavBar title="身份证"/>
        <div className="IdCardImg">
          <p>身份证已绑定</p>
        </div>

        <List className="bankAddBox">
          <InputItem
            type="money"
            editable={false}
            placeholder={this.state.realName}
          >姓名</InputItem>
          <InputItem
            type="money"
            editable={false}
            placeholder={this.state.idCard}
          >身份证</InputItem>
        </List>

      </div>
    )
  }
}

export default IdCard1
