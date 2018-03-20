import React, {Component, PropTypes} from 'react'
import {hashHistory} from 'react-router'
import '../../Style/Pop.css'

/**
 * @props title
 * @props hidePop
 * @props confirm(callback)
 */
class Pop extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      confirmShow: false
    }
    this.showConfirm = this.showConfirm.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  showConfirm(e) {
    let value = e.target.value;
    if (value.trim().length > 0) {
      this.setState({
        confirmShow: true
      })
    } else {
      this.setState({
        confirmShow: false
      })
    }
  }
  confirm(){
    let password = this.refs.password.value
    this.props.hidePop();
    this.props.confirm(password);
  }
  render() {
    return (
      <div id="Pop1">
        <div className="maskPop"/>
        <div className="pop1">
          <div className="popBody1">
            <p className="p1">{this.props.title}</p>
            <p>为保证账户为本人操作，请输入密码</p>
            <div className="clearfix">
              <input type="password" maxLength="32"  onChange={this.showConfirm} ref="password"
                     className="codeInpt" placeholder="请输入账号登录密码"/>
              <a className="codeBtn" onClick={() => {
                this.props.hidePop()
                hashHistory.push('/login/forgetPassword')
              }}>忘记密码</a>
            </div>
          </div>
          <div className="popFoot">
            <a className="btn1" onClick={()=>this.props.hidePop()}>取消</a>
            <a className={this.state.confirmShow ? "btn2" : "btn2 btn2Gray"}
               onClick={this.state.confirmShow ? this.confirm : null}>确定</a>
          </div>
        </div>
      </div>
    )
  }
}


export default Pop
















