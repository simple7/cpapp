import React, {Component, PropTypes} from 'react'
import '../../Style/Pop.css'

class InfoPop extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    let _this = this
    return (
      <div id="Pop3">
        <div className="maskPop"></div>
        {this.props.showType === 'phone' &&
        <div className="pop" >
          <div className="popTitle">手机号说明</div>
          <div className="popBody">
            <p className="pTel"></p>
            <p>银行预留的手机号是办理该银行时所填写的手机号码。</p>
            <p>没有预留、手机号忘记或已停用，请联系银行客服更新处理。</p>
          </div>
          <a className="popBtn" onClick={this.props.hidePop}>知道了</a>
        </div>
        }

        {this.props.showType === 'validate' &&
        <div className="pop">
          <div className="popTitle">有效期说明</div>
          <div className="popBody">
            <p className="pYxq"></p>
            <p>有效期是打印在信用卡正面卡号下方，标注格式为月份在前年份在后的一串数字。</p>
          </div>
          <a className="popBtn" onClick={this.props.hidePop}>知道了</a>
        </div>
        }

        {this.props.showType === 'cvv' &&
        <div className="pop">
          <div className="popTitle">CVV说明</div>
          <div className="popBody">
            <p className="pCvv"></p>
            <p>CVV是打印在信用卡背面为一个三位的数字。</p>
          </div>
          <a className="popBtn"
             onClick={this.props.hidePop}>知道了</a>
        </div>
        }

      </div>
    )
  }
}

export default InfoPop
















