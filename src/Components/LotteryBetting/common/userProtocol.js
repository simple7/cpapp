import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import commonConfig from '../../../config/commonConfig'

export default class UserProtocol extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      read: this.props.read
    }
  }

  checkProtocol() {
    this.setState({
      read: !this.state.read
    }, () => {
      this.props.receiveRead(this.state.read)
    })
  }

  render() {
    return (
      <div className="protocolDiv clearfix">
        <div className="protocolDiv_fl ">
          <i className={this.state.read ? "active" : ""}
             onClick={() => this.checkProtocol()}/>我已阅读并同意
          <a onClick={() =>
            hashHistory.push({
              pathname: this.props.link,
              query: {
                url: commonConfig.domain+'app/lotery/yhxy.html',
                title: '用户服务协议'
              }
            })
          }>《用户服务协议》</a></div>
        <div className="protocolDiv_fr"
             onClick={() => {
               this.props.doClear(true);
             }}>清空
        </div>
      </div>
    )
  }
}
