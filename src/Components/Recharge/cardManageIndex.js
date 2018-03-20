'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {getUserCardList, recharge, getUserCardListNew} from '../../Stubs/API'
import utils from '../../common/utils'
import rechargeConfig from '../../config/rechargeConfig'
import CommonNavBar from '../CommonComts/CommonNavBar'
import '../../Style/Recharge/bankCard.css'

import {Icon} from 'antd-mobile'

class CardManageIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      money: this.props.location.query.addmoney,
      czfs: this.props.location.query.czfs,
      rechargeName: this.props.location.query.rechargeName,
      cardList: [],
      render: false
    }
    this.initialize = this.initialize.bind(this);
    this.gotoManger = this.gotoManger.bind(this);
  }


  componentWillMount() {
    this.initialize()
  }

  initialize() {
    // 查询用户绑定银行卡列表
    getUserCardListNew().then(result => {
      if (result.code === '0') {
        console.log(123, result)
        let banklist = result.banklist
        if (banklist) {
          let item = banklist.item || []
          if (item && !utils.checkIsArr(item)) {
            item = [item]
          }
          this.setState({
            cardList: item,
            render: true
          })
        }
      } else if (result.code === '1') {
        hashHistory.push('loginIndex')
      }
    })
  }


  gotoManger(item) {
    console.log(hashHistory)
    hashHistory.push({
      pathname: 'recharge/cardManage',
      state: {
        bankCode: item.bankid,
        cardtype: item.cardtype,
        cardno: utils.aesCode(item.cardno),
        bankname: item.bankname,
        userpayid: item.userpayid,
        linkimg: item.linkimg,
        cardtypename: item.cardtypename
      }
    })
  }


  render() {
    const _this = this;
    console.log(_this);
    return (
      <div id="bankCard">
        <CommonNavBar
          title='卡管理'
        />
        {
          this.state.render &&
          <div className="bankBox">
            {
              this.state.cardList.length > 0 ?
                this.state.cardList.map((item, index) => {
                  return (
                    <div key={index}
                         className={item.cardtype === '0' ? "bankCard bankCardRed" : "bankCard bankCardBlue"}>
                      <div onClick={() => this.gotoManger(item)} className="clearfix" style={{marginRight: '35px'}}>
                        <div className="bankCardFl">
                          <img src={item.linkimg}/>
                        </div>
                        <div className="bankCardFr">
                          <p className="p1">{item.bankname}</p>
                          <p className="p2">{item.cardtypename}</p>
                          <p className="p3"><span>****</span><span>****</span><span>****</span><span
                            className="span1">{utils.aesCode(item.cardno).substr(-4)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                }) :
                <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
            }
          </div>
        }
      </div>
    )
  }
}

export default CardManageIndex
