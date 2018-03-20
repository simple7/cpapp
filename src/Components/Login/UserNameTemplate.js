import React, {Component} from 'react'

class UserNameTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userNameX: false,
      passwordX: false,
      passwordShow: false,
    }
    this.commonInput = this.commonInput.bind(this)
    this.userInput = this.userInput.bind(this)
    this.delCommon = this.delCommon.bind(this)
    this.showPassword = this.showPassword.bind(this)
    this.focusX = this.focusX.bind(this)
  }
  // 输入框后的X
  commonInput(id, self) {
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
    this.userInput()
  }
  //用户名注册输入
  userInput() {
    let userName = document.getElementById('userName').value.trim(),
      password = document.getElementById('password').value;
    if (userName.length > 0 && password.length > 0) {
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

  showPassword() {
    this.setState({
      passwordShow: !this.state.passwordShow
    })
  }
  focusX(param, state){
    let value = document.getElementById(param).value;
    if(value.trim().length >0){
      this.setState({
        [state]: true
      })
    }
  }
  render() {
    return (
      <div>
        <div className="inputBox">
          <div className="inputName">用户名</div>
          <input autoFocus={true} className="inpt" type="text" id="userName" maxLength="16"
                 onChange={this.commonInput.bind(this,'userName','userNameX')}
                 onFocus={this.focusX.bind(this,'userName','userNameX')}
                 onBlur={()=>{setTimeout(()=>{this.setState({userNameX:false})})}}
                 placeholder="请设置一个用户名"/>
          <span className="delSpan3" style={{display:this.state.userNameX?"":"none"}}
                onClick={this.delCommon.bind(this, 'userName', 'userNameX')}/>
        </div>
        <div className="inputBox">
          <div className="inputName">密码</div>
          <input className="inpt" maxLength="20"
                 onChange={this.commonInput.bind(this,'password','passwordX')}
                 onFocus={this.focusX.bind(this,'password','passwordX')}
                 onBlur={()=>{setTimeout(()=>{this.setState({passwordX:false})})}}
                 type={this.state.passwordShow ? "text" : "password"} id="password" placeholder="请设置一个登录密码"/>
          <span className="delSpan" style={{display:this.state.passwordX?"":"none"}} onClick={this.delCommon.bind(this, 'password', 'passwordX')}/>
          <span className={this.state.passwordShow ? "eyeSpan eyeClose" : "eyeSpan eyeOpen"}
                onClick={this.showPassword}/>{/*眼睛状态 换成class eyeClose eyeOpen*/}
        </div>
      </div>
    )
  }
}

export default UserNameTemplate

