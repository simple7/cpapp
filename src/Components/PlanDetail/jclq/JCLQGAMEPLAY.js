import React, { Component } from "react";
import utils from "../../../common/fangAnUtils";
import commonConfig from '../../../config/commonConfig'

// element元素 结构
class Gameplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, index, gid } = this.props;
    const code = utils.CcodesSplit(item, gid);
    const codeKey = Object.keys(code);
    const tdrowSpanLen = codeKey && codeKey.length + 1;
    const href = `${commonConfig.domain}jcbf2017/bsxq.html?itemid=${item.roundItemId}&rid=${item.rid}&qc=${item.qc}`;
    return (
      <tbody key={index ? index : 1}>
        <tr>
          <td className="td4" rowSpan={tdrowSpanLen}>
            <p>{item.name.substring(0, 2)}</p>
            <p>{item.name.substring(2, 5)}</p>
          </td>
          <td className="td5">
            <span>
              <span className="span3 blackColor">
                {item.isdan == '1'?<span className="redColor">(胆)</span>:''}
                {item.gn.substring(0,5)}</span>
              <span className="span4 blackColor">vs</span>
              <span className="span5 blackColor">
                {item.hn.substring(0,5)}
                <i>主</i>
              </span>
            </span>
          </td>
          {item.hs != "" ? (
            <td className="td6">
              {Boolean(item.hs) ? `${item.gs}:${item.hs}` : ""}
              <br />
              <span>{`(比分)`}</span>
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
            let co = utils.JCCcodeAnalysis(
              item1,
              code[item1],
              gid,
              item.close,
              item.zclose
            );
            let value = {
              close: item.close,
              zclose: item.zclose,
              code: code[item1]
            };
            let result = utils.lotResult(score, value, item1);
            return (
              <tr key={index}>
                <td className="td5">
                  {`${co.lotType}${co.lose}${co.zlose}:`}
                  {co[co.lotType].map((it, index) => {
                    fontRedClass = it.desc == result ? "redColor" : "";
                    return (
                      <span key={index}>
                        <span className={fontRedClass}>
                          {it.desc}({it.odds})
                        </span>
                      </span>
                    );
                  })}
                </td>
                <td className={`td6 ${fontRedClass}`}>{result}</td>
              </tr>
            );
          })}
      </tbody>
    );
  }
}

class JCLQGamePlay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { row, gid } = this.props;
    return (
      <table cellSpacing="0" cellPadding="0" className="programmeTable">
        <thead>
          <tr>
            <th className="th4">场次</th>
            <th className="th5">客队vs主队/投注选项</th>
            <th className="th6">彩果</th>
          </tr>
        </thead>
        {typeof row == "object" &&
          (row instanceof Array ? (
            row.map((item, index) => {
              return (
                <Gameplay key={index} item={item} gid={gid} index={index} />
              );
            })
          ) : (
            <Gameplay item={row} gid={gid} />
          ))}
      </table>
    );
  }
}

export default JCLQGamePlay;
