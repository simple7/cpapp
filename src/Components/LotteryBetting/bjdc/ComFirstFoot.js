import React, {Component} from 'react'

class ComFirstFoot extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    let type = this.props.type || 'jczq'
    return (
      <footer className="bettingFooter" id="spfFoot">
        <div className="clearfix bettingFooterInfo">
          <div className="emptyClear" onClick={()=>this.props.doClear()}/>
          {
            this.props.chooseLength === 0 ?
              <div className="footerInfo">
                <p className="p1">至少选择<span>1</span>场比赛</p>
                <p className="p2">开奖结果不包含加时赛和点球大战</p>
              </div>
              :
              <div className="footerInfo">
                <p className="p1">已选<span>{this.props.chooseLength}</span>场</p>
                <p className="p2">页面赔率仅供参考，请以出票赔率为准</p>
              </div>
          }
        </div>
        <a className="nextBtn" onClick={this.props.doNext}>下一步</a>
      </footer>
    )
  }
}

export default ComFirstFoot
