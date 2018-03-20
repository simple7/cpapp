import React, {Component} from 'react'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import {hashHistory} from 'react-router'
import lotteryConfig from '../../../config/lotteryInfo'
import moment from 'moment'
import commonConfig from '../../../config/commonConfig'
import {forecastDetail} from '../../../Stubs/API'
import utils from '../../../common/utils'
import InfiniteScroll from 'react-infinite-scroll-component'
import '../../../Style/Find/forecast.less'

class Forecast extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      dataList: [],
      listHeight: '',
      hasMore: true
    }
    this.pn = 1;
    this.gid = this.props.location.query.gid || '01';
    this.tp = 1;
    this.getData = this.getData.bind(this);
    this.getMore = this.getMore.bind(this);
  }

  componentWillMount() {
    this.getData(this.gid, this.pn);
  }

  getData(gid, pn) {
    console.log(gid, pn,this.tp)
    if (this.pn !== 1 && this.pn > this.tp) {
      this.setState({
        hasMore: false
      })
    } else {
      forecastDetail(gid, pn).then(result => {
        if (result.code === '0') {
          let pageList = result.pagelist;
          if (pageList) {
            this.tp = parseInt(pageList.totalpage) || this.tp
          }
          let rows = result.rows;
          if (rows && rows.row) {
            let row = rows.row;
            if (utils.checkIsArr(row)) {
              this.setState({
                dataList: this.state.dataList.concat(row)
              })
            } else {
              this.setState({
                dataList: this.state.dataList.concat([row])
              })
            }
          }
        }
      })
    }
  }

  getMore() {
    this.pn += 1;
    this.getData(this.gid, this.pn);
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  Template() {
    let _this = this;
    let arr = [];
    this.state.dataList.map((item, index) => {
      arr.push(
        <a onClick={()=>{
          hashHistory.push({
            pathname:'forecast/artile',
            query: {
              url: commonConfig.mobileDomain + item.arcurl,
              title: `${lotteryConfig.lot(_this.gid)}预测`
            }
          })
        }}
           className="yuce_a clearfix"

           key={`yuceatical${index}`}>
          <div className="yuce_img">
            <img src={commonConfig.domain+ item.litpic}/>
          </div>
          <div className="yuce_box">
            <p className="p1">{item.ntitle}</p>
            <p className="p2">{item.description}</p>
            <time>{moment(parseInt(item.ndate)*1000).format('MM-DD')}</time>
          </div>
        </a>
      )
    })
    return arr;
  }

  render() {
    let _this = this
    return (
      <div id="forecast">
        <CommonNavBar title={lotteryConfig.lot(_this.gid)}/>
        <InfiniteScroll
          height={_this.state.listHeight || 524}
          next={_this.getMore}
          hasMore={_this.state.hasMore}
          scrollThreshold={0.7}
          endMessage={
            <div className="end_div">
              <p className="end_p1">没有更多数据了</p>
            </div>
          }>
          {this.Template()}
        </InfiniteScroll>
      </div>
    )
  }
}

export default Forecast
