import React, {Component} from 'react'
class ComFirstFoot extends Component{
  constructor(){
    super(...arguments)
  }
  render(){
    let type = this.props.type || 'jczq'
    return(
      <footer className="bettingFooter" id="spfFoot">
        <div className="clearfix bettingFooterInfo">
          <div className="emptyClear" onClick={()=>this.props.doClear()}/>
          {
            this.props.chooseLength === 0 &&
            <div className="footerInfo">
              <p className="p1">请先选择比赛</p>
              {type==='jclq' &&
              <p className="p2">竞彩篮球的赛果包含加时赛</p>
              }
              {type==='jczq' &&
              <p className="p2">开奖结果不包含加时赛和点球大战</p>
              }
            </div>
          }
          {
            this.props.chooseLength === 1 &&
            (<div className="footerInfo">
              {
                this.props.allIsDG ?
                  <p className="p1">已选<span>1</span>场</p>
                  :
                  <p className="p1">已选<span>1</span>场,至少再选择<span>1</span>场</p>
              }

              <p className="p2">页面赔率仅供参考，请以出票赔率为准</p>
            </div>)

          }
          {
            this.props.chooseLength > 1 &&
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
