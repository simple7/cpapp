import React, { Component } from "react";
import utils from "../../../common/fangAnUtils";

class JJYHList extends Component {
  constructor(props) {
    super(props);
    this.StrSplit = this.StrSplit.bind(this);
  }

  StrSplit(str) {
    return str.split(",");
  }

  render() {
    const { detail, source } = this.props;
    const awstate = utils.AwinnerState(source);
    return (
      <table cellSpacing="0" cellPadding="0" className="programmeTable m_t30">
        <thead>
          <tr>
            <th className="th1">{awstate ? `一场制胜` : `奖金优化`}组合</th>
            <th className="th2">过关方式</th>
            <th className="th3">倍数</th>
          </tr>
        </thead>
        {detail &&
          detail.row.map((item, index) => {
            let str = item.str;
            str = this.StrSplit(str);
            return (
              <tbody key={index}>
                <tr>
                  <td className="td1">
                    <div>
                      <span className="">{str[0]}</span>
                    </div>
                    <div>
                      <span className="">{str[1]}</span>
                    </div>
                  </td>
                  <td className="td2">
                    {utils.replaceGG(detail.gg)}
                    <br />
                    {awstate?'一场制胜':''}
                  </td>
                  <td className="td3">{item.bs}倍</td>
                </tr>
              </tbody>
            );
          })}
      </table>
    );
  }
}

export default JJYHList;
