import React, {Component} from 'react'
import _ from 'lodash'
import utils from '../../../common/utils'
import betConfig from '../../../config/betConfig'
import "../../../Style/lotteryBetting/mixedPop.less"

export default class LqHhPop extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      chooseWF: [[], [], [], []]
    }
    this.sfc = [
      ['11', '1-5'],
      ['12', '6-10'],
      ['13', '11-15'],
      ['14', '16-20'],
      ['15', '21-25'],
      ['16', '26+'],
      ['01', '1-5'],
      ['02', '6-10'],
      ['03', '11-15'],
      ['04', '16-20'],
      ['05', '21-25'],
      ['06', '26+',]
    ];
    this.changeChoose = this.changeChoose.bind(this)
  }

  componentDidMount() {
    if(document.getElementById('lqhhdiv')){
      document.getElementById('lqhhdiv').style.overflowY = 'hidden'
    }
    let a = _.cloneDeep(this.props.data)
    if (!_.isArray(a.chooseWF)) {
      a.chooseWF = [[], [], [], []]
    }
    this.setState({
      chooseWF: a.chooseWF
    })
  }

  changeChoose(value, type) {
    console.log(value, type)
    let arr = _.cloneDeep(this.state.chooseWF)
    let n = +betConfig.jclq.hh.index[type]
    let m = +betConfig.jclq[type].location[value]
    console.log(n, m)
    arr[n][m] = arr[n][m] === value ? '' : value;
    console.log(arr)
    this.setState({
      chooseWF: arr
    })
  }

  render() {
    let data = this.props.data;
    let sfc = data.sfc.split(',')
    let sf = data.sf.split(',');
    let isale = data.isale;
    let rfsf = data.rfsf.split(',');
    let dxf = data.dxf.split(',');
    let close = parseFloat(data.close);
    let zclose = data.zclose;
    return (
      <div id="mixedPop">
        <div className="maskPop"/>
        <div className="mixedMadolBasketball_program">
          <ul className="mixedMadolTeam clearfix">
            <li className="li1">{data.gn}</li>
            <li className="li2">vs</li>
            <li className="li3">{data.hn}<span className="mainSpan">主</span></li>
          </ul>

          {
            this.props.fromPop &&

            <table cellSpacing="0" cellPadding="0" className="mixedTable">
              <tbody>
              {(utils.isSell('PlayType_JCLQ_SF', isale) && sf[0] !== '') ?
                <tr>
                  <td className="td1 tdRed">胜负</td>
                  <td className={"td6 " + (this.state.chooseWF[0][0] === '0' ? "tdOrange" : "")}
                      onClick={() => this.changeChoose('0', 'sf')}
                  >
                    <span className="span3">客胜</span>
                    <span className="span4">{sf[0]}</span>
                  </td>
                  <td className={"td6 " + (this.state.chooseWF[0][1] === '3' ? "tdOrange" : "")}
                      onClick={() => this.changeChoose('3', 'sf')}
                  >
                    <span className="span3">主胜</span>
                    <span className="span4">{sf[1]}</span>
                  </td>
                </tr>
                :
                <tr>
                  <td className="td1 tdRed">胜负</td>
                  <td className="td5 h_66" colSpan="2">
                    <p className="p5">未开售</p>
                  </td>
                </tr>
              }
              {
                (utils.isSell('PlayType_JCLQ_RFSF', isale) && rfsf[0] !== '') ?
                  <tr>
                    <td className="td1 tdGreen">让分</td>
                    <td className={"td6 " + (this.state.chooseWF[1][0] === '0' ? "tdOrange" : "")}
                        onClick={() => this.changeChoose('0', 'rf')}
                    >
                      <span className="span3">客胜{rfsf[0]}</span>
                    </td>
                    <td className={"td6 " + (this.state.chooseWF[1][1] === '3' ? "tdOrange" : "")}
                        onClick={() => this.changeChoose('3', 'rf')}
                    >
                      <span className={close > 0 ? "spanRed" : "spanGreen"}>({close > 0 ? '+' + close : close})</span>
                      <span className="span3">主胜{rfsf[1]}</span>
                    </td>
                  </tr>
                  :
                  <tr>
                    <td className='td1 tdGreen'>让分</td>
                    <td className="td5 h_66" colSpan="2">
                      <p className="p5">未开售</p>
                    </td>
                  </tr>
              }
              </tbody>
            </table>

          }

          {
            this.props.fromPop &&
            <table cellSpacing="0" cellPadding="0" className="mixedTable">
              <tbody>
              {
                (utils.isSell('PlayType_JCLQ_DXF', isale) && dxf[0] !== '') ?
                  <tr>
                    <td className="td1 blueBg">大小分</td>
                    <td className={"td6 " + (this.state.chooseWF[2][0] === '3' ? "tdOrange" : "")}
                        onClick={() => this.changeChoose('3', 'dxf')}
                    >
                      <span className="span3">大于{zclose}</span>
                      <span className="span4">{dxf[0]}</span>
                    </td>
                    <td className={"td6 " + (this.state.chooseWF[2][1] === '0' ? "tdOrange" : "")}
                        onClick={() => this.changeChoose('0', 'dxf')}
                    >
                      <span className="span3">小于{zclose}</span>
                      <span className="span4">{dxf[1]}</span>
                    </td>
                  </tr>
                  :
                  <tr>
                    <td className='td1 tdGreen'>大小分</td>
                    <td className="td5 h_66" colSpan="2">
                      <p className="p5">未开售</p>
                    </td>
                  </tr>
              }

              </tbody>
            </table>
          }
          <table cellSpacing="0" cellPadding="0" className="mixedTable">
            {(utils.isSell('PlayType_JCLQ_SFC', isale) && sfc[0] !== '') ?
              <tbody>
              <tr>
                <td className="td1 tdGreen" rowSpan="2">客胜分差</td>
                {this.sfc.map((item, index) => {
                  if (index < 3) {
                    return (
                      <td className={"td5 " + (this.state.chooseWF[3][index] === item[0] ? "tdOrange" : "")}
                          key={`jclq_pop_${index}`}
                          onClick={() => this.changeChoose(item[0], 'sfc')}
                      >
                        <p className="p1">{item[1]}分</p>
                        <p className="p2">{sfc[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              <tr>
                {this.sfc.map((item, index) => {
                  if (index >= 3 && index < 6) {
                    return (
                      <td className={"td5 " + (this.state.chooseWF[3][index] === item[0] ? "tdOrange" : "")}
                          key={`jclq_pop_${index}`}
                          onClick={() => this.changeChoose(item[0], 'sfc')}
                      >
                        <p className="p1">{item[1]}分</p>
                        <p className="p2">{sfc[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              </tbody>
              :
              <tbody>
              <tr>
                <td className='td1 tdGreen'>客胜分差</td>
                <td className="td5 h_66" colSpan="2">
                  <p className="p5">未开售</p>
                </td>
              </tr>
              </tbody>
            }

          </table>

          <table cellSpacing="0" cellPadding="0" className="mixedTable">
            {(utils.isSell('PlayType_JCLQ_SFC', isale) && sfc[0] !== '') ?
              <tbody>
              <tr>
                <td className="td1 tdRed" rowSpan="2">主胜分差</td>
                {this.sfc.map((item, index) => {
                  if (index >= 6 && index < 9) {
                    return (
                      <td className={"td5 " + (this.state.chooseWF[3][index] === item[0] ? "tdOrange" : "")}
                          key={`jclq_pop_${index}`}
                          onClick={() => this.changeChoose(item[0], 'sfc')}
                      >
                        <p className="p1">{item[1]}分</p>
                        <p className="p2">{sfc[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              <tr>
                {this.sfc.map((item, index) => {
                  if (index >= 9) {
                    return (
                      <td className={"td5 " + (this.state.chooseWF[3][index] === item[0] ? "tdOrange" : "")}
                          key={`jclq_pop_${index}`}
                          onClick={() => this.changeChoose(item[0], 'sfc')}
                      >
                        <p className="p1">{item[1]}分</p>
                        <p className="p2">{sfc[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              </tbody>
              :
              <tbody>
              <tr>
                <td className='td1 tdRed'>主胜分差</td>
                <td className="td5 h_66" colSpan="2">
                  <p className="p5">未开售</p>
                </td>
              </tr>
              </tbody>
            }
          </table>

          {/*按钮*/}
          <div className="mixedPopBtn clearfix">
            <a onClick={() => {
              if(document.getElementById('lqhhdiv')) {
                document.getElementById('lqhhdiv').style.overflowY = 'auto'
              }
              this.props.hidePop()
            }} className="btn1">取消</a>
            <a onClick={() => {
              if(document.getElementById('lqhhdiv')) {
                document.getElementById('lqhhdiv').style.overflowY = 'auto'
              }
              this.props.hidePop(this.state.chooseWF)
            }} className="btn2">确认</a>
          </div>
        </div>
      </div>
    )
  }
}
