import React, {Component} from 'react';


export default class Pl3Foot2 extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    return (
      <footer className="programFooter">
        <div className="programFooter1">
          <div className="clearfix">
            <div className="inputBox">连续买
              <input type="tel"
                     onBlur={v => {
                       this.props.qiNumBlur(v)
                     }}
                     onChange={this.props.setQiNum.bind(this)}
                     value={this.props.buyQi}/>期
            </div>
            <div className="inputBox fr">投
              <input type="tel"
                     onBlur={v => {
                       this.props.beiNumBlur(v)
                     }}
                     onChange={this.props.setBeiNum.bind(this)}
                     value={this.props.beiNum}/>倍
            </div>
          </div>
        </div>
        <div className="bettingFooterInfo">
          <div className="footerInfo">
            <p className="p1">合计<span>{this.props.money}</span>元</p>
            <p className="p2">共{this.props.zongZhushu}注</p>
          </div>
          <a className="nextBtn" onClick={() => this.props.doOrder()}>立即预约</a>
        </div>
      </footer>
    )
  }
}
