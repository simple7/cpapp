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
        </div>
        <div className="btnBox">
          <p>你还没有9188彩票账号？</p>
          <a className="loginBtn1">下一步</a>
          <p>已有9188彩票账号？</p>
          <a className="loginBtn2">登录关联</a>
        </div>
        <div className="footerBox">使用9188彩票账号直接登录</div>

      </div>
    )}
}
export default LoginIndex
