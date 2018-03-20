import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import '../../Style/loginRelated/loginRelated.less'

//新登录页面
class LoginIndex extends Component {
  constructor(){
    super(...arguments)
  }
  componentWillMount() {

  }
  render() {
    return (
      <div id="loginRelated">
        <div className="imgBox">
          <div className="imgDiv"><img src='' /></div>
          <p className="p1">微信用户名</p>
          <p className="p2">你的微信账号已绑定以上9188彩票帐户，是否直接登录</p>
        </div>
        <div className="btnBox">
          <a className="loginBtn1 m_b40">下一步</a>
          <a className="loginBtn2">使用其他账号登录</a>
        </div>

      </div>
    )}
}
export default LoginIndex
