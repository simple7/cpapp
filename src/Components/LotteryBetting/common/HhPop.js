import React, {Component} from 'react'
import _ from 'lodash'
import utils from '../../../common/utils'
import betConfig from '../../../config/betConfig'
import "../../../Style/lotteryBetting/mixedPop.less"

class HhPop extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      data: {},
      chooseWF: []
    }
    this.bf = ['1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', '5:0', '5:1', '5:2', '9:0', '0:0', '1:1',
      '2:2', '3:3', '9:9', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4', '0:5', '1:5', '2:5', '0:9']
    this.jqs = ['0', '1', '2', '3', '4', '5', '6', '7']
    this.bqc = [['3-3', '胜胜'], ['3-1', '胜平'], ['3-0', '胜负'], ['1-3', '平胜'], ['1-1', '平平'], ['1-0', '平负'], ['0-3', '负胜'], ['0-1', '负平'], ['0-0', '负负']]
    this.changeChoose = this.changeChoose.bind(this)
  }

  componentWillMount() {
    if (document.getElementById('zqhhdiv')) {
      document.getElementById('zqhhdiv').style.overflowY = 'hidden'
    }
    let a = _.cloneDeep(this.props.data)
    if (!_.isArray(a.chooseWF)) {
      a.chooseWF = [[], [], [], [], []]
    }
    this.setState({
      data: a,
      chooseWF: a.chooseWF
    })
  }

  changeChoose(value, type) {
    console.log(value, type)
    let arr = _.cloneDeep(this.state.chooseWF)
    let n = +betConfig.jczq.hh.index[type]
    let m = +betConfig.jczq[type].location[value]
    console.log(n, m)
    arr[n][m] = arr[n][m] === value ? '' : value;
    console.log(arr)
    this.setState({
      chooseWF: arr
    })
  }

  render() {
    let obj = this.state.data;
    let spf = obj.spf.split(',');
    let rqspf = obj.rqspf.split(',');
    let bqc = obj.bqc.split(',')
    let cbf = obj.cbf.split(',')
    let jqs = obj.jqs.split(',')
    return (
      <div>
        <div id="mixedPop">
          <div className="maskPop"/>
          <div className="mixedMadol">
            <ul className="mixedMadolTeam clearfix">
              <li className="li1">{obj.hn}</li>
              <li className="li2">vs</li>
              <li className="li3">{obj.gn}</li>
            </ul>
            {/**/}
            <table cellSpacing="0" cellPadding="0" className="mixedTable">
              <tbody>
              {
                (utils.isSell('PlayType_JCZQ_SPF', obj.isale) && spf[0] !== '') ?
                  <tr>
                    <td className="td1">0</td>
                    <td className={"td2 " + (this.state.chooseWF[0][0] === '3' ? "tdOrange" : '')}
                        onClick={() => this.changeChoose('3', 'spf')}>
                      <span className="span1">主胜</span>
                      <span className="span2">{spf[0]}</span>
                    </td>
                    <td className={"td2 " + (this.state.chooseWF[0][1] === '1' ? "tdOrange" : '')}
                        onClick={() => this.changeChoose('1', 'spf')}>
                      <span className="span1">平</span>
                      <span className="span2">{spf[1]}</span>
                    </td>
                    <td className={"td2 " + (this.state.chooseWF[0][2] === '0' ? "tdOrange" : '')}
                        onClick={() => this.changeChoose('0', 'spf')}>
                      <span className="span1">客胜</span>
                      <span className="span2">{spf[2]}</span>
                    </td>
                  </tr>
                  :
                  <tr>
                    <td className="td1">0</td>
                    <td className="td2" colSpan="3">
                      <span className="grayColor">未开售</span>
                    </td>
                  </tr>
              }
              {
                (utils.isSell('PlayType_JCZQ_RQSPF', obj.isale) && rqspf[0] !== '') ?
                  <tr>
                    <td
                      className={'td1 ' + (+obj.close >= 0 ? "tdRed" : "tdGreen")}>{+obj.close >= 0 ? '+' + obj.close : obj.close}</td>
                    <td className={"td2 " + (this.state.chooseWF[1][0] === '3' ? "tdOrange" : '')}
                        onClick={() => this.changeChoose('3', 'rq')}>
                      <span className="span1">主胜</span>
                      <span className="span2">{rqspf[0]}</span>
                    </td>
                    <td className={"td2 " + (this.state.chooseWF[1][1] === '1' ? "tdOrange" : '')}
                        onClick={() => this.changeChoose('1', 'rq')}>
                      <span className="span1">平</span>
                      <span className="span2">{rqspf[1]}</span>
                    </td>
                    <td className={"td2 " + (this.state.chooseWF[1][2] === '0' ? "tdOrange" : '')}
                        onClick={() => this.changeChoose('0', 'rq')}>
                      <span className="span1">客胜</span>
                      <span className="span2">{rqspf[2]}</span>
                    </td>
                  </tr>
                  :
                  <tr>
                    <td
                      className={'td1 ' + (+obj.close >= 0 ? "tdRed" : "tdGreen")}>{+obj.close >= 0 ? '+' + obj.close : obj.close}</td>
                    <td className="td2" colSpan="3">
                      <span className="grayColor">未开售</span>
                    </td>
                  </tr>
              }

              </tbody>
            </table>
            {/*比分*/}
            <table cellSpacing="0" cellPadding="0" className="mixedTable">
              <tbody>
              <tr>
                <td className="td1 blueBg" rowSpan="5">比分</td>
                {this.bf.map((item, index) => {
                  if (index < 7) {
                    return (
                      <td className={"td3 " + (this.state.chooseWF[2][index] === item ? "tdOrange" : '')}
                          data-value={item} key={`bf_${index}`}
                          onClick={() => this.changeChoose(item, 'bf')}>
                        <p className="p1">{item}</p>
                        <p className="p2">{cbf[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              <tr>
                {this.bf.map((item, index) => {
                  if (index >= 7 && index < 13) {
                    return (
                      <td className={"td3 " + (this.state.chooseWF[2][index] === item ? "tdOrange" : '')}
                          data-value={item} colSpan={index !== 12 ? '0' : '2'} key={`bf_${index}`}
                          onClick={() => this.changeChoose(item, 'bf')}>
                        <p className="p1">{index !== 12 ? item : '胜其它'}</p>
                        <p className="p2">{cbf[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              <tr>
                {this.bf.map((item, index) => {
                  if (index >= 13 && index < 18) {
                    return (
                      <td className={"td3 " + (this.state.chooseWF[2][index] === item ? "tdOrange" : '')}
                          data-value={item} colSpan={index !== 17 ? '0' : '3'} key={`bf_${index}`}
                          onClick={() => this.changeChoose(item, 'bf')}>
                        <p className="p1">{index !== 17 ? item : '平其它'}</p>
                        <p className="p2">{cbf[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              <tr>
                {this.bf.map((item, index) => {
                  if (index >= 18 && index < 25) {
                    return (
                      <td className={"td3 " + (this.state.chooseWF[2][index] === item ? "tdOrange" : '')}
                          data-value={item} key={`bf_${index}`}
                          onClick={() => this.changeChoose(item, 'bf')}>
                        <p className="p1">{item}</p>
                        <p className="p2">{cbf[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              <tr>
                {this.bf.map((item, index) => {
                  if (index >= 25) {
                    return (
                      <td className={"td3 " + (this.state.chooseWF[2][index] === item ? "tdOrange" : '')}
                          data-value={item} colSpan={index !== 30 ? '0' : '2'} key={`bf_${index}`}
                          onClick={() => this.changeChoose(item, 'bf')}>
                        <p className="p1">{index !== 30 ? item : '负其它'}</p>
                        <p className="p2">{cbf[index]}</p>
                      </td>
                    )
                  }
                })}
              </tr>
              </tbody>
            </table>
            {/*总进球*/}
            <table cellSpacing="0" cellPadding="0" className="mixedTable">
              <tbody>
              <tr>
                <td className="td1 cyanBg" rowSpan="2">总进球</td>
                {this.jqs.map((item, index) => {
                  if (index < 4)
                    return (
                      <td className={"td4 " + (this.state.chooseWF[3][index] === item ? "tdOrange" : '')}
                          data-value={item} key={`jqs_${index}`}
                          onClick={() => this.changeChoose(item, 'jq')}>
                        <p className="p1">{`${item}球`}</p>
                        <p className="p2">{jqs[index]}</p>
                      </td>
                    )
                })}
              </tr>
              <tr>
                {this.jqs.map((item, index) => {
                  if (index >= 4)
                    return (
                      <td className={"td4 " + (this.state.chooseWF[3][index] === item ? "tdOrange" : '')}
                          data-value={item} key={`jqs_${index}`}
                          onClick={() => this.changeChoose(item, 'jq')}>
                        <p className="p1">{`${item === '7' ? '7+' : item}球`}</p>
                        <p className="p2">{jqs[index]}</p>
                      </td>
                    )
                })}
              </tr>
              </tbody>
            </table>
            {/*半全场*/}
            <table cellSpacing="0" cellPadding="0" className="mixedTable">
              <tbody>
              <tr>
                <td className="td1 yellowBg" rowSpan="2">半全场</td>
                {
                  this.bqc.map((item, index) => {
                    if (index < 5) {
                      return (
                        <td className={"td4 " + (this.state.chooseWF[4][index] === item[0] ? "tdOrange" : '')}
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
                        <td className={"td4 " + (this.state.chooseWF[4][index] === item[0] ? "tdOrange" : '')}
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
            {/*按钮*/}
            <div className="mixedPopBtn clearfix">
              <a onClick={() => {
                if (document.getElementById('zqhhdiv')) {
                  document.getElementById('zqhhdiv').style.overflowY = 'auto'
                }
                this.props.hidePop()
              }} className="btn1">取消</a>
              <a onClick={() => {
                if (document.getElementById('zqhhdiv')) {
                  document.getElementById('zqhhdiv').style.overflowY = 'auto'
                }
                this.props.hidePop(this.state.chooseWF)
              }} className="btn2">确认</a>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default HhPop
