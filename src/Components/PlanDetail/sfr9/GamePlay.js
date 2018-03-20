import React, { Component } from "react";

class SpanRed extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, result } = this.props;
    let len = item.length;
    return (
      <span>
        {item &&
          item.map((it, index) => {
            let fontRedClass = it == result ? "redColor" : "";
            return (
              <span key={index}>
                <span className={fontRedClass}>
                  {it}
                  {index == len - 1 ? "" : ","}
                </span>
              </span>
            );
          })}
      </span>
    );
  }
}

// element元素 结构
class Gameplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item, index, gid } = this.props;
    return (
      <tbody key={index}>
        <tr>
          <td className="td4">
            <p>{item.mid}</p>
          </td>
          <td className="td5">
            <a>
              <span className="span3 spanColor">
                {item.isdan == '1'?<span className="redColor">(胆)</span>:''}
                {item.hn.substring(0, 3)}</span>
              <span className="span4 spanColor">vs</span>
              <span className="span5 spanColor">{item.gn.substring(0, 3)}</span>
            </a>
          </td>
          <td className="td4">{item.code}</td>
          <td className="td5 redColor">{item.rs}</td>
          <td className="td4">{Boolean(item.ms)?`${item.ms}-${item.ss}`:'--'}</td>
        </tr>
      </tbody>
    );
  }
}

class GamePlayJudge extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { row, gid } = this.props;
    console.log(row);
    return (
      <table cellSpacing="0" cellPadding="0" className="programmeTable">
        <thead>
          <tr>
            <th className="th8">场次</th>
            <th className="th9">主队vs客队</th>
            <th className="th10">投注选项</th>
            <th className="th7">彩果</th>
            <th className="th8">比分</th>
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

export default GamePlayJudge;
