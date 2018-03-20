import React, {Component} from 'react'
import utils from '../../../common/utils'
import commonConfig from '../../../config/commonConfig'

class CommonJF extends Component{
  constructor(){
    super(...arguments)
  }

  render(){
    let {item, type} = this.props;
    if (item){
      let spfscale = item.spfscale.split(',')
      let rqspfscale = item.rqspfscale.split(',')
      return(
        <div className='bettingBoxDown ' id={`${type}_${item.itemid}`}>
          <table cellSpacing="0" cellPadding="0">
            <tbody>
            <tr>
              <td className="td1">联赛排名</td>
              <td colSpan="4" className="td2">
                <div className='fontS24'>{item.hm}</div>
                <div className='fontS24'>{item.gm}</div>
              </td>
            </tr>
            <tr>
              <td className="td1">近期战绩</td>
              <td colSpan="4" className="td2">
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
              <td className="td1">历史交锋</td>
              <td colSpan="4" className="td2">
                {`近${parseInt(item.jf0) + parseInt(item.jf1) + parseInt(item.jf3)}次交战，主队`}
                <span className="colorRed">{`${item.jf3}胜`}</span>
                <span className="colorBlue">{`${item.jf1}平`}</span>
                <span className="colorGreen">{`${item.jf0}负`}</span>
              </td>
            </tr>
            <tr>
              <td rowSpan="2" className="td1">投注比例</td>
              <td className="td2">非让球</td>
              <td className="td2">{spfscale[0]}</td>
              <td className="td2">{spfscale[1]}</td>
              <td className="td2">{spfscale[2]}</td>
            </tr>
            <tr>
              <td className="td2">让球</td>
              <td className="td2">{rqspfscale[0]}</td>
              <td className="td2">{rqspfscale[1]}</td>
              <td className="td2">{rqspfscale[2]}</td>
            </tr>
            </tbody>
          </table>
          <div className="analysisDiv"
               onClick={() => location.href = `${commonConfig.domain}jcbf2017/bsxq.html?itemid=${item.itemid}&type=17&rid=${item.rid}`
               }>
            <span className="icon"/>
            <span>详细赛事分析</span>
            <span className="arrow"/>
          </div>
        </div>
      )
    }else{
      return null;
    }
  }
}
 export default CommonJF
