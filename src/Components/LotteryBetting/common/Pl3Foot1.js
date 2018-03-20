import React, {Component} from 'react'
import {Popover} from 'antd-mobile'

const Item = Popover.Item;
export default class Pl3Foot1 extends Component {
  constructor() {
    super(...arguments)
    this.state = {}
    this.onSelect = this.onSelect.bind(this)
  }

  onSelect(obj) {
    let zhushu = obj.key
    this.props.jxNum(zhushu, 'clear')
  }

  render() {
    return (
      <footer className="bettingFooter">
        <div className="clearfix bettingFooterInfo">
          {this.props.delShow ?
            <div className="emptyClear" onClick={() => {
              this.props.clear()
            }}/>
            :
            <Popover placement="topLeft"
                     overlay={[
                       (<Item key="10" style={{background: "#49484B", color: "white"}}>10注</Item>),
                       (<Item key="5" style={{background: "#49484B", color: "white"}}>5注</Item>),
                       (<Item key="1" style={{background: "#49484B", color: "white"}}>1注</Item>)
                     ]}
                     align={{
                       overflow: {adjustY: 0, adjustX: 0},
                       offset: [10, -10],
                     }}
                     onSelect={this.onSelect}
            >
              <div className="choicePopover">机选
              </div>
            </Popover>
          }
          <div className="footerInfo">
            {
              this.props.zhushu > 0 ?
                <p className="p3">共<span>{this.props.zhushu}</span>注 <span>{2 * this.props.zhushu}</span>元</p>
                :
                !this.props.desc2 ?
                  <p className="p3">每位至少选<span>1</span>个号</p> :
                  <p className="p3">至少选<span>{this.props.desc2}</span>个号</p>
            }
          </div>
        </div>
        <a className="nextBtn" onClick={() => this.props.doNext()}>下一步</a>
      </footer>
    )
  }
}
