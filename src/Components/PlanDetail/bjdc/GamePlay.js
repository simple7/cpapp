import React, {Component} from "react";
import utils from "../../../common/fangAnUtils";
import commonConfig from '../../../config/commonConfig'

class SpanRed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {item, result} = this.props;
    let len = item.length;
    return (
      <span>
      {
        item && item.map((it, index) => {
          let fontRedClass = it == result ? "redColor" : "";
          return (
            <span key={index}>
              <span className={fontRedClass}>{it}{index == len - 1 ? '' : ','}</span>
            </span>
          );
        })
      }
      </span>
    )
  }
}

// element元素 结构
class Gameplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {item, index, gid} = this.props;
    const code = utils.CcodesSplitBgSF(item, gid);
    const codeKey = Object.keys(code);
    const tdrowSpanLen = codeKey && codeKey.length + 1;
    const href =
      item.roundItemId &&
      item.rid &&
      item.qc &&
      `${commonConfig.domain}jcbf2017/bsxq.html?itemid=${item.roundItemId}&rid=${item.rid}&qc=${item.qc}`;
    return (
      <tbody key={index ? index : 1}>
      <tr>
        <td className="td4" rowSpan={tdrowSpanLen}>
          <p>{item.id}</p>
        </td>
        <td className="td5">
          <span>
            <span className="span3 blackColor">
              {item.isdan == '1'?<span className="redColor">(胆)</span>:''}
            {item.hn.substring(0, 5)}
            </span>
            <span className="span4 blackColor">vs</span>
            <span className="span5 blackColor">{item.gn.substring(0, 5)}</span>
          </span>
        </td>
        {item.hs != "" ? (
          <td className="td6">
            {Boolean(item.hs) ? `${item.hs}:${item.gs}` : ""}
            <br />
          </td>
        ) : (
          <td className="td6" rowSpan={1}>
            {item.jsbf}
          </td>
        )}
      </tr>
      {code &&
      codeKey.map((item1, index) => {
        let lotResult = "";
        let fontRedClass = "";
        const score = {
          hs: item.hs,
          gs: item.gs,
          hhs: item.hhs,
          hgs: item.hgs
        };
        let co = utils.JCCcodeAnalysis(item1, code[item1], gid, item.lose);
        let value = {
          close: item.lose,
          code: code[item1]
        };
        let type = utils.BJDCAndSFGGgid(gid);
        let result = utils.lotResult(score, value, type);
        let sp = item.spvalue && Number(item.spvalue).toFixed(2);
        return (
          <tr key={index}>
            <td className="td5">
              {`${co.lotType}${co.lose}:`}
              {co[co.lotType].map((it, index1) => {
                let strDesc = it.desc.join(',');
                fontRedClass = strDesc.indexOf(result) > -1 ? "redColor" : "";
                return (
                  <SpanRed item={it.desc} result={result} key={index1}/>
                );
              })}
            </td>
            <td className={`td6 ${fontRedClass}`}>
              {result}
              {sp ? `(${sp})` : ""}
            </td>
          </tr>
        );
      })}
      </tbody>
    );
  }
}

class GamePlayJudge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {row, gid} = this.props;
    return (
      <table cellSpacing="0" cellPadding="0" className="programmeTable">
        <thead>
        <tr>
          <th className="th4">场次</th>
          <th className="th5">主队vs客队/投注选项</th>
          <th className="th6">彩果</th>
        </tr>
        </thead>
        {typeof row == "object" &&
        (row instanceof Array ? (
          row.map((item, index) => {
            return (
              <Gameplay key={index} item={item} gid={gid} index={index}/>
            );
          })
        ) : (
          <Gameplay item={row} gid={gid}/>
        ))}
      </table>
    );
  }
}

export default GamePlayJudge;
