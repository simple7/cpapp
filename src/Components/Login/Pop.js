'use strict'
import React, {Component} from 'react'
import commonConfig from '../../config/commonConfig'
import {sendSMS} from '../../Stubs/API'

import '../../Style/Pop.css'

class Pop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      confirmShow: false
    }
    this.confirm = this.confirm.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
  }

  confirm() {
    let params = this.props.phoneData;
    params.yzm = document.getElementById('yzm').value;
    this.props.hidePop();
    this.props.sendSms(params);
  }

  showConfirm(e) {
    let value = e.target.value;
    // value = value.replace(/\D/g,'')
    // this.refs.yzm.value = value;
    if(value.length >10){
      e.target.value = value.slice(0,10)
    }
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

  componentDidMount() {
    this.refs.yzm.focus()
  }
  render() {
    return (
      <div id="Pop1">
        <div className="maskPop"></div>
        <div className="pop">
          <div className="popBody">
            <p>请输入计算结果(数字)，以获取短信验证码</p>
            <div className="clearfix">
              {/*正式环境为 yzmimg.jo*/}
              <img src={commonConfig.domain+'yzmimg.jo?' + this.props.random} onClick={(e) => {
                e.target.src = commonConfig.domain+'yzmimg.jo?' + Math.random()
              }} className="codeImg"/>
              <input type="number" pattern="(-)?[0-9]*" maxLength={10} ref="yzm" className="codeInpt"   onChange={this.showConfirm} id="yzm" placeholder="答案"/>
            </div>
          </div>
          <div className="popFoot">
            <a onClick={this.props.hidePop} className="btn1">取消</a>
            <a onClick={this.state.confirmShow ? this.confirm : ""} className={this.state.confirmShow?"btn2":"btn2 btn2Gray"}>确定</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Pop
