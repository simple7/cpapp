import React, { Component } from "react";
import utils from "../../../common/fangAnUtils";
import commonConfig from '../../../config/commonConfig'

// 其他玩法 结构
class OtherGameplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, ResultsState, HalfScore, index, gid, source} = this.props;
    const code = utils.CcodesSplit(item,gid);
    const codeKey = Object.keys(code);
    const reState = ResultsState();
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
                {item.hn.substring(0,5)}</span>
              <span className="span4 blackColor">vs</span>
              <span className="span5 blackColor">{item.gn.substring(0,5)}</span>
            </span>
          </td>
          {reState ? (
            item.hs != "" ? (
              <td className="td6">
                {Boolean(item.hs)
                  ? `${item.hs}:${item.gs}${HalfScore(item)}`
                  : ""}
                <br />
                <span>{gid && gid == "92" && `(半/全)`}</span>
              </td>
            ) : (
              <td className="td6" rowSpan={1}>
                {item.jsbf}
              </td>
            )
          ) : (
            <td className="td6" rowSpan={tdrowSpanLen}>
              开赛后公开<p />
            </td>
          )}
        </tr>
        {reState
          ? code &&
            codeKey.map((item1, index) => {
              let lotResult = "";
              let fontRedClass = "";
              let value = { close: item.lose };
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
                item.lose
              );
              let result = utils.lotResult(score, value, item1);
              return (
                <tr key={index}>
                  <td className="td5">
                    {`${(source == "8" || source == "14")?'2选1':co.lotType}${co.lose}:`}
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
            })
          : ""}
      </tbody>
    );
  }
}

class OtherGameplayJudge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { row, gid, ResultsState, HalfScore, source} = this.props;
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
                <OtherGameplay
                  key={index}
                  item={item}
                  gid={gid}
                  index={index}
                  ResultsState={ResultsState}
                  HalfScore={HalfScore}
                  source = {source}
                />
              );
            })
          ) : (
            <OtherGameplay
              item={row}
              gid={gid}
              ResultsState={ResultsState}
              HalfScore={HalfScore}
              source = {source}
            />
          ))}
      </table>
    );
  }
}

export default OtherGameplayJudge;
