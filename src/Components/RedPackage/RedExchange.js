import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router'
import '../../Style/My/MyExchange.css'
import {exchangeRed, checkBindInfo} from '../../Stubs/API'
import myExchange from "../../Img/MyIndex/myExchange.png"
import {Modal, Toast, NavBar} from 'antd-mobile'
import utils from '../../common/utils'
import CommonNavBar from "../CommonComts/CommonNavBar";

const alert = Modal.alert;

/**
 * 绑定身份证或者银行卡弹窗
 * @param head
 * @param text
 * @param type
 */
const showAlert = (head, text, type) => {
   alert(head, text, [
    {
      text: '取消',
      onPress: () => {
      },
    },
    {
      text: '去绑定',
      onPress: () => {
        if (type === 'phone') {

        } else if (type === 'card') {

        }
      }
    },
  ]);
};



class MyExchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formatRight: false,
      cardBind: true,
      phoneBind: true,
    }
    this.changeClass = this.changeClass.bind(this);
    this.submitExchange = this.submitExchange.bind(this);
    this.checkIfBind = this.checkIfBind.bind(this);
  }

  componentWillMount() {
    this.checkIfBind();
  }
  cardInput(e) {
    let target = e.target;
    let value = target.value.replace(/\s/g, '');
    if (value.length >= 20) {
      this.changeClass(true)
    } else {
      this.changeClass(false)
    }
  }

  changeClass(flag) {
    this.setState({
      formatRight: flag
    })
  }
  // 校验是否绑定
  checkIfBind(){
    let _this = this;
    checkBindInfo().then(result => {
      let data = result.row;
      console.log(data);
      if (data) {
        if (!data.mobile) {
          _this.setState({
            phoneBind: false
          })
        } else if (!data.card) {
          _this.setState({
            cardBind: true
          })
        }
      }
    })
  }
  submitExchange() {
    let code = document.getElementById('exchangeCode').value;
    if(this.state.phoneBind && this.state.cardBind){
      exchangeRed(code).then(result => {
        console.log(result);
        if (result && result.code !== '0') {
          utils.wxMessage('温馨提示','您的兑换码错误',function () {
            document.getElementById('exchangeCode').focus();
          })
        }else{
          Toast.success('兑换成功', 2, function(){
            hashHistory.push('redpack')
          });
        }
      })
    }else if(!this.state.phoneBind){
      showAlert('温馨提示','兑换前，需先绑定手机号','phone')
    }else if(!this.state.cardBind){
      showAlert('温馨提示','兑换前，需先绑定身份证','card')
    }
  }

  render() {
    return (
      <div id="myExchange">
        <div className="duihuan_box">
          <img src={myExchange}/>
          <input type="text" autoFocus={true} onChange={this.cardInput.bind(this)} id="exchangeCode" placeholder="请输入兑换码（字母区分大小写）"/>
        </div>
        <div className="duihuan_btn">
          <a  onClick={this.state.formatRight ? this.submitExchange : ''}
             className={this.state.formatRight ? 'btn_a2' : 'btn_a1'}>立即兑换</a>
          {/*没输入 不能点击 输入后 颜色变深 可点击class改成 btn_a2*/}
          <p className="p5">输入兑换码，兑换可抵用购彩现金的红包</p>
        </div>
      </div>
    )
  }
}

export default MyExchange
