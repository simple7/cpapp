import React, {Component} from 'react';
import {Link} from 'react-router'
import {NavBar} from 'antd-mobile'
import utils from '../../common/utils'
import CommonNavBar from '../CommonComts/CommonNavBar'
import '../../Style/My/MyProblem.css'


class MyProblem extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      listHeight: ''
    }
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  render() {
    return (
      <div>
        {
          (this.props && this.props.type === 'pop') ?
            <NavBar
              className="myNav"
              mode="dark"
              onLeftClick={() => this.props.childBack('2')}
              rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
              style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
            >红包说明</NavBar>
            :
            <CommonNavBar title="红包说明"/>
        }
        <div id="MyProblem" style={{height: this.state.listHeight || 540}}>
          <div>
            <p className="p1">Q1: 什么是红包</p>
            <p className="p2">红包是本平台发行的抵用券，可在购彩时使用，红包不能提现。</p>
            <p className="p2">红包可用于自购、跟买、发起合买（不可作为保底金额），不可用于追号。</p>
          </div>
          <div>
            <p className="p1">Q2: 如何获取红包</p>
            <p className="p2">我们会不定期举行红包活动，例如新用户注册送红包、充值送红包、加奖红包等。</p>
          </div>
          <div>
            <p className="p1">Q3: 红包有哪些种类</p>
            <p className="p2">满减红包：以2元「每满10减1」红包为例，当订单金额为20元或以上时，可抵用2元购彩金。</p>
          </div>
          <div>
            <p className="p1">Q4: 撤单返款时红包如何退还</p>
            <p className="p2">无论用户撤单还是网站撤单，都会原路返回用户购彩时使用的红包（红包有效期不变）。</p>
          </div>
          <div>
            <p className="p1">Q5: 如何使用红包</p>
            <p className="p2">当您付款时，若该订单有符合使用条件的红包，付款页面会自动出现「使用红包」的选项并匹配一个可使用红包，您也可以点击「使用红包」选项自行选择要使用的红包。</p>
          </div>
        </div>
      </div>
    )
  }
}

export default MyProblem
