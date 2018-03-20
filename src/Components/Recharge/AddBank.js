'use strict'
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import CommonNavBar from '../CommonComts/CommonNavBar'
import utils from '../../common/utils'
import {userBasicInfo, checkBankBin, recharge, getCardList, rechargeRouteSingle, checkCardNo} from '../../Stubs/API'
import CardAndPhone from './CardAndPhone'
import {List, InputItem, Picker, Toast} from 'antd-mobile'
import {createForm} from 'rc-form';
import InfoPop from './popImg'
import '../../Style/Recharge/bankAdd.css'

class BankAddComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      realName: '',
      knowCardType: true,
      nextShow: false,
      getCardBin: false,
      cardOk: false,
      confirmShow: true,
      addMoney: this.props.location.query.addmoney,
      realCardNo: '',
      phone: '',
      cardNo: '',
      bankName: '',
      bankCode: '',
      cardType: '', //卡类型名称
      cardTypeCode: '', //卡类型编码
      validDate: '',
      cvv: '',
      cardInfo: {},
      cardList: [],
      cardDesc: '',
      cardIcon: true,
      phonePopShow: false,
      showType: '',
      bankid: '',
      channel: '',
      product: '',
      key: '',
      cardPass: '0',
      rectype:'',
    }
    this.initialize = this.initialize.bind(this);
    this.inPutCard = this.inPutCard.bind(this);
    this.next = this.next.bind(this);
    this.getPhone = this.getPhone.bind(this);
    this.sedRecharge = this.sedRecharge.bind(this);
    this.showInfo = this.showInfo.bind(this);
    this.chooseBank = this.chooseBank.bind(this);
    this.pickerBank = this.pickerBank.bind(this);
    this.hidePop = this.hidePop.bind(this);
  }

  componentWillMount() {
    this.initialize()
  }

  initialize() {
    getCardList('noLoad').then(result => {
      if (result.code === '0') {
        let arr = [];
        let info = {}
        let row = result.row;
        if (!utils.checkIsArr(row)) {
          row = [row]
        }
        for (let r in row) {
          //银行名和简称
          info[row[r].bankid] = row[r].bankname;
          let param = {
            label: row[r].bankname,
            value: row[r].bankid
          }
          if (row[r].cardtype == '2') {
            param['children'] = [{
              label: '借记卡',
              value: '0'
            }, {
              label: '信用卡',
              value: '1'
            }]
          } else if (row[r].cardtype == '1') {
            param['children'] = [{
              label: '信用卡',
              value: '1'
            }]
          } else if (row[r].cardtype == '0') {
            param['children'] = [{
              label: '借记卡',
              value: '0'
            }]
          }
          arr.push(param);

        }
        this.setState({
          cardInfo: info
        })
        this.setState({
          cardList: arr
        })

      }
    })
    if (sessionStorage.getItem('userData')) {
      let userData = JSON.parse(sessionStorage.getItem('userData'));
      this.setState({
        realName: userData.realname
      })
    } else {
      userBasicInfo().then(result => {
        if (result.code === '0') {
          let name = result.row.realname;
          name = '*' + name.substr(1)
          this.setState({
            realName: name
          })
        } else {
          hashHistory.push('loginIndex')
        }
      })
    }

  }

  // 输入银行卡点击下一步
  next() {
    let cardNo = this.state.realCardNo
    if (/^\d{16}$/.test(cardNo) || /^\d{19}$/.test(cardNo)) {
      if (this.state.getCardBin) {
        let cardNo = this.state.cardNo
        checkCardNo({cardno: cardNo}).then(res => {
          if (res.code === '0') {
            //如果是路由添加银行卡  需先获取充值渠道
            let routeAdd = this.props.location.query.routeAdd;
            if (routeAdd) {
              let params = {
                addmoney: this.state.addMoney,
                bankCode: this.state.bankCode,
                cardtype: this.state.cardTypeCode
              }
              rechargeRouteSingle(params).then(res => {
                if (res.code === '0') {
                  let rechargeWay = res.rechargeWay
                  if (rechargeWay && rechargeWay.item) {
                    let item = rechargeWay.item;
                    this.setState({
                      bankid: this.state.cardTypeCode === '0' ? item['h5_dbankid'] : item['h5_cbankid'],
                      channel: item.channel,
                      product: item.product,
                      key: item.key,
                      rectype:item.rectype,
                      cardOk: true,
                    })
                  }
                }
              })
            } else {
              //单渠道充值过来
              let singlParams = JSON.parse(this.props.location.query.singlParams)
              if(singlParams){
                this.setState({
                  bankid: this.state.cardTypeCode === '0' ? singlParams['h5_dbankid'] : singlParams['h5_cbankid'],
                  channel: singlParams.channel,
                  product: singlParams.product,
                  key: singlParams.key,
                  rectype:singlParams.rectype,
                  cardOk: true
                })

              }

            }
          } else {
            Toast.info(res.desc, 2, null, false)
          }
        })


      } else {
        utils.wxMessage('温馨提示', '请选择卡类型！', () => {
          setTimeout(() => {
            document.getElementById('cardNo').focus()
          }, 0)
        }, '确定')
      }
    } else {
      utils.wxMessage('温馨提示', '银行卡号输入有误，请确认后重新输入！', () => {
        setTimeout(() => {
          document.getElementById('cardNo').focus()
        }, 0)
      }, '确定')
    }
  }

  // 输入银行卡号
  inPutCard(value) {
    let _this = this;
    let cardNo = value.replace(/\s/g, '')
    let cardEncode = utils.aesEnCode(cardNo);
    if (!utils.checkIsNull(cardNo)) {
      this.setState({
        cardIcon: false,
        nextShow: true,
        realCardNo: cardNo,
        cardNo: cardEncode,
      })
    } else {
      this.setState({
        cardIcon: true,
        nextShow: false,
        realCardNo: cardNo,
        cardNo: cardEncode,
      })
    }
    if (cardNo.length > 6 && !_this.state.getCardBin) {
      checkBankBin({bankCard: cardEncode}).then(result => {
        if (result.code === '0') {
          let bankCard = result.bankcard;
          this.setState({
            getCardBin: true,
            bankName: bankCard.bankName,
            cardType: bankCard.cardType,
            bankCode: bankCard.bankCode,
            cardTypeCode: bankCard.cardTypeCode
          }, () => {
            showInfo()
          })
        } else {
          this.setState({
            getCardBin: false
          }, () => {
            showInfo()
          })
        }
      })
    } else {
      showInfo()
    }

    function showInfo() {
      console.log(_this.state.knowCardType, _this.state.getCardBin)
      if (cardNo.length > 8 && !_this.state.getCardBin) {
        _this.setState({
          cardDesc: '',
          knowCardType: false
        })
      } else {
        _this.setState({
          knowCardType: true
        })
      }
    }
  }

  // 发送预充值信息
  sedRecharge() {
    let params = {
      addmoney: this.state.addMoney,
      mobile: utils.aesEnCode(this.state.phone),
      bankid: this.state.bankid,
      bankCode: this.state.bankCode,
      cardtype: this.state.cardTypeCode,
      cardno: this.state.cardNo,
      validDate: '',
      cvv: '',
      channel: this.state.channel,
      product: this.state.product,
      key: this.state.key,
      cardPass: this.state.cardPass
    }
    if (this.state.cardTypeCode === '1') {
      params.validDate = this.state.validDate
      params.cvv = this.state.cvv
    }
    console.log('充值参数：', params)
    recharge(params).then(result => {
      this.setState({
        confirmShow: true
      })
      if (result.code === '0') {
        let row = result.row;
        hashHistory.push({
          pathname: '/recharge/rechageConfirm',
          state: {
            first: params,
            addmoney: params.addmoney,
            applyid: row.applyid || '',
            bankCode: params.bankCode,
            bankid:params.bankid,
            cardno:params.cardno,
            cardtype: params.cardtype,
            cvv: params.cvv,
            mobile: params.mobile,
            realCardNo: this.state.realCardNo,
            rectype:this.state.rectype,
            sessionToken: row.sessionToken || '',
            tradeno: row.tradeno || '',
            validDate: params.validDate
          }
        })
      } else {
        utils.wxMessage('', result.desc, () => {
          setTimeout(() => {
            document.getElementById('phone').focus()
          }, 0)
        })
      }
    })
  }

  // 输入手机号点击确定，调用addmoney充值接口
  getPhone(phone, validDate, cvv) {
    this.setState({
      confirmShow: false,
      phone: phone,
      validDate: validDate,
      cvv: cvv
    }, () => {
      this.sedRecharge();
    })

  }



  showInfo(type) {
    switch (type) {
      case 'cardInfo':
        utils.wxMessage('持卡人说明', '为了你的账户资金安全，只能绑定账户本人的银行卡。')
        break;
      case 'phoneInfo':
        this.setState({
          phonePopShow: true,
          showType: 'phone'
        })
        break;
      case 'validate':
        this.setState({
          phonePopShow: true,
          showType: 'validate'
        })
        break;
      case 'cvv':
        this.setState({
          phonePopShow: true,
          showType: 'cvv'
        })
        break;
    }
  }

  pickerBank(value) {
    let cardDesc = this.state.cardInfo[value[0]] + ' ' + (value[1] === '0' ? '借记卡' : '信用卡');
    document.getElementById('cardDesc').value = cardDesc;
  }

  chooseBank(value) {
    this.setState({
      getCardBin: true,
      bankCode: value[0],
      cardTypeCode: value[1],
      bankName: this.state.cardInfo[value[0]],
      cardType: (value[1] === '0' ? '借记卡' : '信用卡'),
      cardDesc: this.state.cardInfo[value[0]] + ' ' + (value[1] === '0' ? '借记卡' : '信用卡')
    }, () => {
      document.getElementById('cardDesc').blur()
    })

  }

  componentDidMount() {
    document.getElementById('cardNo').focus()
  }

  hidePop() {
    this.setState({
      phonePopShow: false
    })
  }

  render() {
    const {getFieldProps} = this.props.form;
    return (
      <div id="bankAdd">
        <CommonNavBar
          title={this.state.cardOk ? '填写银行卡信息' : '添加银行卡'}
        />
        <div style={{display: this.state.cardOk ? "none" : ""}}>
          <List className="bankAddBox m_bt40">
            <InputItem
              editable={false}
              clear
              placeholder={this.state.realName}
            >持卡人</InputItem>
            <InputItem className=""
                       clear
                       {...getFieldProps('cardNo', {
                         onChange: value => this.inPutCard(value)
                       })}
                       maxLength='30'
                       id="cardNo"
                       placeholder="请输入卡号"
                       type="bankCard"
                       extra={this.state.cardIcon ?
                         <div onClick={() => this.showInfo('cardInfo')} className="blueIcon"/> : ''}
            >卡号</InputItem>
          </List>

          <List style={{display: this.state.knowCardType ? "none" : ""}} className="bankAddBox">
            <Picker
              data={this.state.cardList}
              cols={2}
              title=""
              cascade={true}
              extra=""
              onPickerChange={v =>
                this.pickerBank(v)
              }
              onOk={v => this.chooseBank(v)}
            >
              <InputItem
                id="cardDesc"
                value={this.state.cardDesc}
                className="blueInput"
                editable={false}
                placeholder="请选择银行卡类型"
              >卡类型</InputItem>
            </Picker>
          </List>
          <div className="rechargeBtn m_t60">
            <a onClick={this.state.nextShow ? this.next : ''}
               className={this.state.nextShow ? "rechargeBtn1" : "rechargeBtn1 disabledBtn"}>下一步</a>
          </div>
          <div className="cardManage">
            <a onClick={()=>{
              hashHistory.push('recharge/cardManageIndex')
            }}>卡管理</a>
          </div>
        </div>
        {this.state.phonePopShow &&
        <InfoPop hidePop={this.hidePop} showType={this.state.showType}/>
        }

        <div style={{display: this.state.cardOk ? "" : "none"}}>
          <CardAndPhone bankName={this.state.bankName}
                        cardType={this.state.cardType}
                        cardTypeCode={this.state.cardTypeCode}
                        confirmShow={this.state.confirmShow}
                        showInfo={this.showInfo}
                        getPhone={this.getPhone}
                        rectype={this.state.rectype}
          />
        </div>

      </div>
    )
  }
}

const BankAdd = createForm()(BankAddComponent)

export default BankAdd
