import React, {Component} from 'react';
import _ from 'lodash'
// 串关选择组件
class CGComponent extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      tempArr: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      chooseCG: [],
      min: 1
    }
    this.chooseCG = this.chooseCG.bind(this)
    this.cancel = this.cancel.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  componentWillMount() {
    let arr = this.props.realCG
    console.log('串关',arr)
    let min = 1
    if (this.props.minC) {
      min = this.props.minC
    }
    this.setState({
      chooseCG: arr,
      min: +min
    })
  }

  chooseCG(e) {
    let value = +e.target.dataset.value;
    let chooseCG = [];
    chooseCG = chooseCG.concat(this.state.chooseCG);
    if (chooseCG.indexOf(value) !== -1) {
      chooseCG = _.without(chooseCG, value)
    } else {
      chooseCG.push(value)
    }
    this.setState({
      chooseCG: chooseCG
    })
  }

  //点击取消不做任何处理
  cancel() {
    this.props.callback()
  }

  confirm() {
    let chooseCG = this.state.chooseCG;
    if (chooseCG.length === 0) {
      if (this.state.min !== 1) {
        this.props.callback([this.state.min + 1])
      } else {
        this.props.callback([2])
      }
    } else {
      this.props.callback(this.state.chooseCG)
    }

  }

  render() {
    console.log(this.props.allIsDG)
    let _this = this;
    return (
      <div>
        <div className="mask"/>
        <div className="programPop">
          <div className="programPopTab">
            <ul className="programPopTabUl">
              <li className="li1 active">自由过关</li>
            </ul>
            <div className="programPopTabContent listDivView">
              <ul className="clearfix">
                {
                  this.props.allIsDG &&
                  <li
                    className={this.state.chooseCG.indexOf(1) !== -1 ? "active" : ''}
                    data-value={1}
                    onClick={_this.chooseCG}
                  >
                    单关
                  </li>
                }
                {this.state.tempArr.map((item, index) => {
                  console.log(this.state.min, this.props.maxC)
                  if (index >= this.state.min && index < this.props.maxC) {
                    return (
                      <li
                        className={this.state.chooseCG.indexOf(index + 1) !== -1 ? "active" : ''}
                        key={`chuan_${index + 1}`}
                        data-value={index + 1}
                        onClick={_this.chooseCG}
                      >
                        {`${index + 1}串1`}
                      </li>
                    )
                  }

                })
                }
              </ul>
            </div>
          </div>
          <div className="programPopBtn clearfix">
            <a onClick={this.cancel} className="programPopBtn1">取消</a>
            <a onClick={this.confirm} className="programPopBtn2">确认</a>
          </div>
        </div>
      </div>
    )
  }
}

export default CGComponent
