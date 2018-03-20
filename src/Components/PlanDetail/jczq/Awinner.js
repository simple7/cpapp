import React, { Component } from "react";
import utils from "../../../common/fangAnUtils";
import commonConfig from '../../../config/commonConfig'

// 一场制胜 元素结构
class AwinnerTableResult extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, ResultsState, HalfScore, index, gid, type, source} = this.props;
    const code = utils.CcodesSplit(item[type],gid);
    const codeKey = Object.keys(code);
    const reState = ResultsState();
    const tdrowSpanLen = codeKey && codeKey.length + 1;
    const href = `${commonConfig.domain}jcbf2017/bsxq.html?itemid=${item.roundItemId}&rid=${item.rid}&qc=${item.qc}`;
    return (
      <tbody>
        <tr>
          <th className="th4">
            {type == "zxitem" ? "自选" : "匹配"}
            {index ? index + 1 : 1}
          </th>
          <th className="th5">主队vs客队/投注选项</th>
          <th className="th6">彩果</th>
        </tr>
        <tr>
          <td className="td4" rowSpan={tdrowSpanLen}>
            <p>{item[type].name.substring(0, 2)}</p>
            <p>{item[type].name.substring(2, 5)}</p>
          </td>
          <td className="td5">
          <span>
            <span className="span3 blackColor">
              {item[type].hn.substring(0,5)}</span>
            <span className="span4 blackColor">vs</span>
            <span className="span5 blackColor">{item[type].gn.substring(0,5)}</span>
            </span>
          </td>
          {reState ? (
            item[type].hs != "" ? (
              <td className="td6">
                {Boolean(item[type].hs)
                  ? `${item[type].hs}:${item[type].gs}${HalfScore(item[type])}`
                  : ""}
                <br />
                <span>{gid && gid == "92" && `(半/全)`}</span>
              </td>
            ) : (
              <td className="td6" rowSpan={1}>
                {item[type].jsbf}
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
                let fontRedClass = '';
                let value = { close: item.close };
                const score = {
                  hs: item[type].hs,
                  gs: item[type].gs,
                  hhs: item[type].hhs,
                  hgs: item[type].hgs
                };
                let co = utils.JCCcodeAnalysis(
                  item1,
                  code[item1],
                  gid,
                  item[type].close
                );
                let result = utils.lotResult(score, value, item1);
                return (
                  <tr key={index}>
                    <td className="td5">
                      {`${co.lotType}${co.lose}:`}
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

class Awinner extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, index, ResultsState, HalfScore, gid } = this.props;
    return (
      <div key={index || 1}>
        {item && (
          <table cellSpacing="0" cellPadding="0" className="programmeTable">
            <AwinnerTableResult
              item={item}
              ResultsState={ResultsState}
              HalfScore={HalfScore}
              index={index}
              gid={gid}
              type={"zxitem"}
            />
            <AwinnerTableResult
              item={item}
              ResultsState={ResultsState}
              HalfScore={HalfScore}
              index={index}
              gid={gid}
              type={"ppitem"}
            />
          </table>
        )}
      </div>
    );
  }
}

class AwinnerJudge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { gid, row, ResultsState, HalfScore } = this.props;
    return (
      <div>
        {typeof row == "object" && row instanceof Array ? (
          row.map((item, index) => {
            return (
              <Awinner
                key={index}
                item={item}
                gid={gid}
                index={index}
                ResultsState={ResultsState}
                HalfScore={HalfScore}
              />
            );
          })
        ) : (
          <Awinner
            item={row}
            gid={gid}
            ResultsState={ResultsState}
            HalfScore={HalfScore}
          />
        )}
      </div>
    );
  }
}

export default AwinnerJudge;
