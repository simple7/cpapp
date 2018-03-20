import React, {Component} from 'react'
import _ from 'lodash'
import utils from '../../../common/utils'
import betConfig from '../../../config/betConfig'
import "../../../Style/lotteryBetting/mixedPop.less"


export default class BjdcPop extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      data: {},
      chooseWF: []
    }
    this.bf = ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '9:0', '0:0', '1:1',
      '2:2', '3:3', '9:9', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4', '0:9']
    this.bqc = [['3-3', '胜胜'], ['3-1', '胜平'], ['3-0', '胜负'], ['1-3', '平胜'], ['1-1', '平平'], ['1-0', '平负'], ['0-3', '负胜'], ['0-1', '负平'], ['0-0', '负负']]
    this.changeChoose = this.changeChoose.bind(this)
  }

  componentWillMount() {
    console.log(this.props)
    let a = _.cloneDeep(this.props.data)
    if (!_.isArray(a.chooseWF)) {
      a.chooseWF = []
    }
    this.setState({
      data: a,
      chooseWF: a.chooseWF
    })
  }

  changeChoose(value, type) {
    console.log(value, type)
    let arr = _.cloneDeep(this.state.chooseWF)
    let n = ''
    if(type==='bf'){
      n = +betConfig.bjdc[type].index[value]
    }else{
      n = +betConfig.bjdc[type].location[value]
    }
    arr[n] = arr[n] === value ? '' : value;
    this.setState({
      chooseWF: arr
    })
  }

  render() {
    let obj = this.state.data;
    let bqc = obj.bqc.split(',');
    let cbf = obj.cbf.split(',');
    return (
      <div id="mixedPop">
        <div className="maskPop"/>
        <div className="mixedMadolSingle">
          <ul className="mixedMadolTeam clearfix">
            <li className="li1">{obj.hn}</li>
            <li className="li2">vs</li>
            <li className="li3">{obj.gn}</li>
          </ul>
          {
            this.props.type === 'bf' ?
              <div>
                <table cellSpacing="0" cellPadding="0" className="mixedTable">
                  <tbody>
                  <tr>
                    <td className="td1 redBg" rowSpan="2">主胜</td>
                    {this.bf.map((item, index) => {
                      if (index < 5) {
                        return (
                          <td className={"td3 " + (this.state.chooseWF[+betConfig.bjdc.bf.index[item]] === item ? "tdOrange" : '')}
                              data-value={item} key={`bf_${index}`}
                              onClick={() => this.changeChoose(item, 'bf')}>
                            <p className="p1">{item}</p>
                            <p className="p2">{cbf[+betConfig.bjdc.bf.location[item]]}</p>
                          </td>
                        )
                      }
                    })}
                  </tr>
                  <tr>
                    {this.bf.map((item, index) => {
                      if (index >= 5 && index < 10) {
                        return (
                          <td className={"td3 " + (this.state.chooseWF[+betConfig.bjdc.bf.index[item]] === item ? "tdOrange" : '')}
                              data-value={item} key={`bf_${index}`}
                              onClick={() => this.changeChoose(item, 'bf')}>
                            <p className="p1">{index !== 9 ? item : '胜其它'}</p>
                            <p className="p2">{cbf[+betConfig.bjdc.bf.location[item]]}</p>
                          </td>
                        )
                      }
                    })}
                  </tr>
                  </tbody>
                </table>
                < table cellSpacing="0" cellPadding="0" className="mixedTable">
                  <tbody>
                  <tr>
                    <td className="td1 blueBg">平</td>
                    {this.bf.map((item, index) => {
                      if (index >= 10 && index < 15) {
                        return (
                          <td className={"td3 " + (this.state.chooseWF[+betConfig.bjdc.bf.index[item]] === item ? "tdOrange" : '')}
                              data-value={item} key={`bf_${index}`}
                              onClick={() => this.changeChoose(item, 'bf')}>
                            <p className="p1">{index !== 14 ? item : '平其它'}</p>
                            <p className="p2">{cbf[+betConfig.bjdc.bf.location[item]]}</p>
                          </td>
                        )
                      }
                    })}
                  </tr>
                  </tbody>
                </table>
                <table cellSpacing="0" cellPadding="0" className="mixedTable">
                  <tbody>
                  <tr>
                    <td className="td1 greenBg" rowSpan="2">客胜</td>
                    {this.bf.map((item, index) => {
                      if (index >= 15 && index < 20) {
                        return (
                          <td className={"td3 " + (this.state.chooseWF[+betConfig.bjdc.bf.index[item]] === item ? "tdOrange" : '')}
                              data-value={item} key={`bf_${index}`}
                              onClick={() => this.changeChoose(item, 'bf')}>
                            <p className="p1">{item}</p>
                            <p className="p2">{cbf[+betConfig.bjdc.bf.location[item]]}</p>
                          </td>
                        )
                      }
                    })}
                  </tr>
                  <tr>
                    {this.bf.map((item, index) => {
                      if (index >= 20) {
                        return (
                          <td className={"td3 " + (this.state.chooseWF[+betConfig.bjdc.bf.index[item]] === item ? "tdOrange" : '')}
                              data-value={item} key={`bf_${index}`}
                              onClick={() => this.changeChoose(item, 'bf')}>
                            <p className="p1">{index !== 24 ? item : '负其它'}</p>
                            <p className="p2">{cbf[+betConfig.bjdc.bf.location[item]]}</p>
                          </td>
                        )
                      }
                    })}
                  </tr>
                  </tbody>
                </table>
              </div>
              :
              <table cellSpacing="0" cellPadding="0" className="mixedTable">
                <tbody>
                <tr>
                  <td className="td1 yellowBg" rowSpan="2">半全场</td>
                  {
                    this.bqc.map((item, index) => {
                      if (index < 5) {
                        return (
                          <td className={"td4 " + (this.state.chooseWF[index] === item[0] ? "tdOrange" : '')}
                              data-value={item[0]} key={`bqc_${index}`}
                              onClick={() => this.changeChoose(item[0], 'bqc')}>
                            <p className="p1">{item[1]}</p>
                            <p className="p2">{bqc[index]}</p></td>
                        )
                      }
                    })
                  }
                </tr>
                <tr>
                  {
                    this.bqc.map((item, index) => {
                      if (index >= 5) {
                        return (
                          <td className={"td4 " + (this.state.chooseWF[index] === item[0] ? "tdOrange" : '')}
                              data-value={item[0]} key={`bqc_${index}`}
                              onClick={() => this.changeChoose(item[0], 'bqc')}>
                            <p className="p1">{item[1]}</p>
                            <p className="p2">{bqc[index]}</p></td>
                        )
                      }
                    })
                  }
                  <td className="td4 emptyTd"></td>
                </tr>
                </tbody>
              </table>
          }
          <div className="mixedPopBtn clearfix">
            <a className="btn1"
               onClick={() => this.props.hidePop()}>
              取消
            </a>
            <a className="btn2"
               onClick={() => {
                 this.props.hidePop(this.state.chooseWF)
               }}
            >
              确认
            </a>
          </div>
        </div>
      </div>
    )
  }
}

