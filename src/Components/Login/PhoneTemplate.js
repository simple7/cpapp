import React, {Component} from 'react'
import {InputItem} from 'antd-mobile'
class PhoneTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneX: false,
      codeX: false,
    }
    this.phoneCash = '';
    this.commonInput = this.commonInput.bind(this);
    this.inputCode = this.inputCode.bind(this);
    this.delCommon = this.delCommon.bind(this);
    this.focusX = this.focusX.bind(this);
    this.formatPhoneOnkeyUp = this.formatPhoneOnkeyUp.bind(this);
  }
  // 输入框后的X
  commonInput(id, self, type) {
    let value = document.getElementById(id).value
    if (value.length > 0) {
      this.setState({
        [self]: true
      })
    }else{
      this.setState({
        [self]: false
      })
    }
    if (type === 'phone') {
      let phone = document.getElementById('phoneNumber').value;
      phone = document.getElementById('phoneNumber').value = phone.replace(/\D/g,'')
      if(phone.length === 11){
        this.phoneCash = phone
      }
      if(phone.length > 11){
        document.getElementById('phoneNumber').value = this.phoneCash
      }
      // document.getElementById('phoneNumber').value = this.formatPhoneOnkeyUp(phone)
    } else if(type === 'code'){
      let code = document.getElementById('verfCode').value;
      code = document.getElementById('verfCode').value = code.replace(/\D/g,'')
      if(code.length === 8){
        this.phoneCash = code
      }
      if(code.length > 8){
        document.getElementById('verfCode').value = this.phoneCash
      }
    }
    this.inputCode()
  }

  //手机号注册输入
  inputCode() {
    let code = document.getElementById('verfCode').value,
      phone = document.getElementById('phoneNumber').value;
    if (code.trim().length > 0 && phone.replace(/\D/g, '').length > 0) {
      this.props.btnLight()
    } else {
      this.props.btnClose()
    }
  }

  delCommon(id, self) {
    let target = document.getElementById(id);
    target.value = '';
    target.focus();
    this.props.btnClose();
    this.setState({
      [self]: false
    })
  }

  focusX(param, state) {
    let value = document.getElementById(param).value;
    if (value.trim().length > 0) {
      this.setState({
        [state]: true
      })
    }
  }

  /*input框使用onkeyup事件
 */
  formatPhoneOnkeyUp(mobile) {
    var value = mobile.replace(/\D/g, '').substring(0, 11);
    var valueLen = value.length;
    if (valueLen > 3 && valueLen < 8) {
      console.log(123,`${value.substr(0, 3)} ${value.substr(3)}`)
      value = `${value.substr(0, 3)} ${value.substr(3)}`;
    } else if (valueLen >= 8) {
      value = `${value.substr(0, 3)} ${value.substr(3, 4)} ${value.substr(7)}`;
    }
    return value;
  }

  render() {
    return (
      <div>
        <div className="inputBox">
          <div className="inputName">手机号</div>
          <input className="inpt" type="number" pattern="[0-9]*" autoFocus="autofocus"
                 onChange={this.commonInput.bind(this, 'phoneNumber', 'phoneX','phone')}
                 onFocus={this.focusX.bind(this, 'phoneNumber', 'phoneX')}
                 onBlur={() => {
                   setTimeout(() => {
                     this.setState({phoneX: false})
                   })
                 }}
                 id="phoneNumber" maxLength="11"
                 placeholder="请输入手机号码"/>
          <span className="delSpan3" style={{display: this.state.phoneX ? '' : 'none'}}
                onClick={this.delCommon.bind(this, 'phoneNumber', 'phoneX')}></span>
        </div>
        <div className="inputBox">
          <div className="inputName">验证码</div>
          <input className="inpt"  id="verfCode" type="number" pattern="[0-9]*"
                 onChange={this.commonInput.bind(this, 'verfCode', 'codeX','code')} maxLength="8"
                 onFocus={this.focusX.bind(this, 'verfCode', 'codeX')}
                 onBlur={() => {
                   setTimeout(() => {
                     this.setState({codeX: false})
                   })
                 }}
                 placeholder="请输入验证码"/>
          <a onClick={this.props.sendSmsBtn ? this.props.getCode : ''} className="codeSpan" id="codeButton">获取验证码</a>
          <span className="delSpan4" style={{display: this.state.codeX ? '' : 'none'}}
                onClick={this.delCommon.bind(this, 'verfCode', 'codeX')}></span>
        </div>
      </div>
    )
  }
}

export default PhoneTemplate
