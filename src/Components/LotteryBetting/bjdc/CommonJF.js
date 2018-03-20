import React, {Component} from 'react'
import commonConfig from '../../../config/commonConfig'
import utils from '../../../common/utils'

class CommonJF extends Component {
  constructor() {
    super(...arguments)
  }

  render() {
    let {item, type} = this.props
    if (item) {
      return (
        <div className='bettingBoxDown lqBoxDown' id={`${type}_${item.itemid}`}>
          <table cellSpacing="0" cellPadding="0">
            <tbody>
            <tr>
              <td className="td1 lqTd1">联赛排名</td>
              <td colSpan="4" className="td2 lqTd2">
                <div className='fontS24'>{item.hm}</div>
                <div className='fontS24'>{item.gm}</div>
              </td>
            </tr>
            <tr>
              <td className="td1 lqTd1">近期战绩</td>
              <td colSpan="4" className="td2 lqTd2">
                <div>
                  {utils.getSpf(item.htn)[0] !== '0' &&
                  <span className="colorRed">{`${utils.getSpf(item.htn)[0]}胜`}</span>
                  }
                  {
                    utils.getSpf(item.htn)[1] !== '0' &&
                    <span className="colorBlue">{`${utils.getSpf(item.htn)[1]}平`}</span>
                  }
                  {
                    utils.getSpf(item.htn)[2] !== '0' &&
                    <span className="colorGreen">{`${utils.getSpf(item.htn)[2]}负`}</span>
                  }

                </div>
                <div>
                  {
                    utils.getSpf(item.gtn)[0] !== '0' &&
                    <span className="colorRed">{`${utils.getSpf(item.gtn)[0]}胜`}</span>
                  }
                  {
                    utils.getSpf(item.gtn)[1] !== '0' &&
                    <span className="colorBlue">{`${utils.getSpf(item.gtn)[1]}平`}</span>
                  }
                  {
                    utils.getSpf(item.gtn)[2] !== '0' &&
                    <span className="colorGreen">{`${utils.getSpf(item.gtn)[2]}负`}</span>
                  }
                </div>
              </td>
            </tr>
            <tr>
              <td className="td1 lqTd1">历史交锋</td>
              <td colSpan="4" className="td2 lqTd2">
                {`近${(parseInt(item.jf0) + parseInt(item.jf1) + parseInt(item.jf3)) || 0}次交战`}
                {(item.jf0 || item.jf1 || item.jf3) &&
                <span>
                                  ，主队
                                  <span className="colorRed">{`${item.jf3}胜`}</span>
                                  <span className="colorBlue">{`${item.jf1}平`}</span>
                                  <span className="colorGreen">{`${item.jf0}负`}</span>
                                </span>
                }

              </td>
            </tr>
            </tbody>
          </table>
          {/*<div className="analysisDiv"
             onClick={() => location.href = `${commonConfig.domain}jcbf2017/bsxq.html?itemid=${item.itemid}&type=17&rid=${item.rid}`
             }>
          <span className="icon"/>
          <span>详细赛事分析</span>
          <span className="arrow"/>
        </div>*/}
        </div>
      )
    }else{
      return null
    }

  }
}

export default CommonJF
