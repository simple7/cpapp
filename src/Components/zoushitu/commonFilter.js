import React, {Component} from 'react'
import _ from 'lodash'

class CommonFilter extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      popShow: false,
      realObj: {
        qici: 30,
        yilou: true,
        tj: true,
      },
      tempObj: {
        qici: 30,
        yilou: true,
        tj: true,
      }
    }
    this.qici = [30, 50, 100]
    this.switchPop = this.switchPop.bind(this)
    this.doConfirm = this.doConfirm.bind(this)
    this.setParams = this.setParams.bind(this)
    this.cancel = this.cancel.bind(this)
  }

  switchPop() {
    this.setState({
      popShow: !this.state.popShow
    })
  }

  setParams(key, value) {
    let obj = _.cloneDeep(this.state.tempObj)
    obj[key] = value
    this.setState({
      tempObj: obj
    })
  }

  cancel() {
    let realObj = _.cloneDeep(this.state.realObj)
    this.setState({
      tempObj: realObj,
      popShow: false
    })
  }

  doConfirm() {
    let tempObj = _.cloneDeep(this.state.tempObj)
    this.setState({
      realObj: tempObj,
      popShow:false
    })
    this.props.fun(tempObj)
  }

  render() {
    let {popShow} = this.state
    let {qici, yilou, tj} = this.state.tempObj
    return (
      <div>
        <div className="setView" onClick={this.switchPop}>
          <img src={require('../../Img/set.png')}/>
        </div>
        <div style={{display: popShow ? '' : 'none'}}>
          <div className="maskView"/>
          <div className="popView">
            <div className="popHead">走势图设置</div>
            <div className="popBody">
              <div className="popTitle">期次</div>
              <div className="popTxt popTxt1">
                {
                  this.qici.map((item, index) => {
                    return (
                      <span
                        className={qici === item ? 'on' : ''}
                        onClick={() => {
                          this.setParams('qici', item)
                        }}
                        key={`qici_${index}`}>
                          {`近${item}期`}
                          </span>
                    )
                  })
                }
              </div>
              <div className="popTitle">遗漏</div>
              <div className="popTxt popTxt2">
                <span className={yilou ? "on" : ""}
                      onClick={() => {
                        this.setParams('yilou', true)
                      }}>
                  显示遗漏
                </span>
                <span
                  className={yilou ? "" : "on"}
                  onClick={() => {
                    this.setParams('yilou', false)
                  }}
                >
                  隐藏遗漏</span>
              </div>
              <div className="popTitle">统计</div>
              <div className="popTxt popTxt2">
                <span
                  className={tj ? "on" : ""}
                  onClick={() => {
                    this.setParams('tj', true)
                  }}
                >显示统计</span>
                <span
                  className={tj ? "" : "on"}
                  onClick={() => {
                    this.setParams('tj', false)
                  }}
                >隐藏统计</span>
              </div>
            </div>
            <div className="popFoot">
              <div onClick={this.cancel}>取消</div>
              <div onClick={this.doConfirm}>确定</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CommonFilter
