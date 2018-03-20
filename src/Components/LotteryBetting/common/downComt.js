import React, {Component} from 'react'

export default class DownComt extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    let showType = this.props.showType || 4
    return (
      <div className="menuPop">
        <div className={showType === "3" ? "menuFlex_3" : "menuFlex"}>
          {this.props.tabsData.map((item, index) => {
            if (index < showType * 1) {
              return (
                <div key={"wanfa_" + item.key} className={this.props.active === item.key ? "active" : ""}
                     onClick={() => this.props.clickWF(item.key)}
                >
                  {item.title}</div>
              )
            }
          })}
        </div>
        <div className={showType === "3" ? "menuFlex_3" : "menuFlex"}>
          {this.props.tabsData.map((item, index) => {
            if (index >= showType * 1 && index < showType * 2) {
              return (
                <div key={"wanfa_" + item.key} className={this.props.active === item.key ? "active" : ""}
                     onClick={() => this.props.clickWF(item.key)}
                >
                  {item.title}</div>
              )
            }
          })}
        </div>
        {this.props.tabsData.length > showType * 2 &&
        <div className={showType === "3" ? "menuFlex_3" : "menuFlex"}>
          {this.props.tabsData.map((item, index) => {
            if (index >= showType * 2 && index < showType * 3) {
              return (
                <div key={"wanfa_" + item.key} className={this.props.active === item.key ? "active" : ""}
                     onClick={() => this.props.clickWF(item.key)}
                >
                  {item.title}</div>
              )
            }
          })}
        </div>
        }
        {this.props.tabsData.length > showType * 3 &&
        <div className={showType === "3" ? "menuFlex_3" : "menuFlex"}>
          {this.props.tabsData.map((item, index) => {
            if (index >= showType * 3) {
              return (
                <div key={"wanfa_" + item.key} className={this.props.active === item.key ? "active" : ""}
                     onClick={() => this.props.clickWF(item.key)}
                >
                  {item.title}</div>
              )
            }
          })}
        </div>
        }
      </div>
    )
  }
}
