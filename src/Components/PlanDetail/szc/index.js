"use strict";
import React, {Component} from "react";
import {hashHistory} from 'react-router'
import TopIcon from "../common/topIcon";
import Progress from "../common/progress";
import FootBtn from "../common/footBtn";
import utils from "../../../common/fangAnUtils";
import {szcPlanDetail} from "../../../Stubs/API";
import FootDesc from "../common/footDesc";
import _ from 'lodash'

class SZCDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contHeight: 0,
      gid: '01',
      hid: "",
      lotName: "",
      gp: "",
      data: {},
      show: false,
      showMore: false,
    };
    this.rule = {
      '01': 'ssq',
      '50': 'dlt',
      '59': 'x11x5',
      '03': 'fc3d',
      '55': 'y11x5',
      '07': 'qlc',
      '51': 'qxc',
      '52': 'pl5',
      '53': 'pl3',
      '04': 'ssc',
      '10': 'xk3'
    }
    this.goWanFa = this.goWanFa.bind(this)
  }

  async componentWillMount() {
    const {gid, hid} = this.props.location.query;
    this.setState({
      gid: gid,
      hid: hid
    });
    await szcPlanDetail(hid, gid).then(res => {
      this.setState({
        data: res,
        show: true
      });
    });

  }

  goWanFa() {
    let gid = this.state.gid
    console.log(111, gid)
    hashHistory.push({
      pathname: '/wanfa',
      query: {
        type: this.rule[gid],
        flag: 2
      }
    })
  }

  componentDidUpdate() {
    let progFootDomHeight = document.getElementsByClassName('programmeFooter')[0];
    if (progFootDomHeight && progFootDomHeight.offsetHeight !== 0 && this.state.contHeight === 0) {
      let height = utils.setHeight() - progFootDomHeight.offsetHeight;
      this.setState({
        contHeight: height
      });
    }
  }

  render() {
    let content = ''
    if (this.state.show) {
      const {contHeight, data, gid, hid} = this.state;
      let row = data.row
      let qcode = data.qcode || '';
      let acode = qcode.acode || '';
      let red = [];
      let blue = [];
      if (acode.indexOf('|') > 0) {
        acode = acode.split('|')
        red = acode[0].split(',')
        blue = acode[1].split(',')
      } else {
        red = acode.split(',');
      }
      let result = utils.showCode(gid, row.ccodes)
      let codes = result.html;
      let codeArr = []
      let tLength = codes.length;
      console.log(123)
      if (this.state.showMore) {
        codeArr = codes
      } else {
        codeArr = codes.slice(0, 5)

      }
      let zj = result.zj || ''
      let regx = /\(|\)/
      console.log('翻译codes:', codes)
      content = <div>
        <div className="programmeDetails listDivView" style={{height: contHeight, overflow: 'auto'}}>
          {/*顶部 icon*/}
          <TopIcon data={data} gid={gid}/>
          {/*进度 金额*/}
          <Progress data={data} gid={gid} zj={zj}/>
          {
            acode &&
            <div className="kjhm">
              <div className="titleDiv">开奖号码</div>
              <div className="shuZiCaiBall clearfix">
                {_.map(red, (item, index) => {
                  return (
                    <span className="redBall" key={"red_" + index}>{item}</span>
                  )
                })}
                {_.map(blue, (item, index) => {
                  return (
                    <span className="blueBall" key={"blue_" + index}>{item}</span>
                  )
                })}
              </div>
            </div>
          }

          {/*方案内容*/}
          <div className="titleDiv">方案内容
            {gid !== '10' &&
            <a onClick={() => {
              this.goWanFa()
            }} className="bonusAgainstA">奖金对照</a>
            }

          </div>
          <table cellSpacing="0" cellPadding="0" className="shuZiCaiTable">
            <tbody>
            {_.map(codeArr, (item, index) => {
              return (
                <tr key={`row${index}`}>
                  <td className="td1">{item.wf + '-' + item.zhushu + '注'}</td>
                  <td className="td2">
                    {/* 数字有括号的span加上class kuohao*/}
                    {_.map(item.red, (it1, ind1) => {
                      return (
                        <span className={regx.test(it1) ? "kuohao" : ""} key={`row${index}_red_${ind1}`}>{it1}</span>
                      )
                    })}
                    {
                      item.blue && item.blue.length > 0 &&
                      <span className="line">|</span>
                    }
                    {
                      item.blue && item.blue.length > 0 &&
                      _.map(item.blue, (it2, ind2) => {
                        return (
                          <span key={`row${index}_blue_${ind2}`}>{it2}</span>
                        )
                      })
                    }
                  </td>
                </tr>
              )
            })}
            {tLength > 5 &&
            <tr>
              <td colSpan="2" className="td4" onClick={() => {
                this.setState({
                  showMore: !this.state.showMore
                })
              }
              }><span
                className={this.state.showMore ? "spanAll up" : "spanAll down"}>{this.state.showMore ? '收起全部' : '展开全部'}</span>
              </td>
              {/*down up 箭头*/}
            </tr>
            }

            {/*<tr>
              <td className="td1">复式-2注</td>
              <td className="td2"></td>
            </tr>*/}
            <tr>
              <td colSpan={2} className="td3">{`投注倍数：${row.mulity}倍`}</td>
            </tr>
            </tbody>
          </table>
          <FootDesc hid={hid}/>
          {/*底部按钮*/}
        </div>
        <FootBtn jindu={data.jindu} shareGod={data.shareGod} gid={gid}/>
      </div>
    } else {
      content = ''
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}

export default SZCDetail;
