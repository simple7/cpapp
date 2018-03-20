import React, {Component} from "react";
import {Link} from 'react-router'
import utils from "../../../common/fangAnUtils";

class TableTicket extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {data, state, gid, hid} = this.props;
    const AWJJStat = utils.AwinnerState(data.source);
    const hasticketBtn =
      data.jindu && utils.hasTicket(data.jindu.node, data.jindu.percent);
    const isflag = data.jindu && data.jindu.isflag;
    const mulity = data.mulity || (data.row && data.row.mulity);
    const tmoney = data.tmoney || (data.row && data.row.tmoney);
    const gg = data.gg || (data.detail && utils.replaceGG(data.detail.gg));
    const href = `/planDetail/cpmx?gid=${gid}&hid=${hid}&isflag=${isflag}`;
    return (
      <table cellSpacing="0" cellPadding="0" className="programmeTable">
        <tbody>
        <tr>
          <td colSpan="3" className="td7">
            <div>
              {gg && <p>过关方式：{gg}</p>}
              <p>
                投注信息：{tmoney / 2 || "--"}注;
                {AWJJStat
                  ? "一场制胜"
                  : data.matchs ? "奖金优化" : `${mulity || "--"}倍`}
              </p>
              {state && hasticketBtn && <Link to={href}>出票明细</Link>}
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}

export default TableTicket;
