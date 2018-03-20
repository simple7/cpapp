'use strict'
import React,{Component} from 'react'
import {Link} from 'react-router'
import {Toast} from 'antd-mobile'
import {awardList} from '../../../Stubs/API'
import CommonNavBar from '../../CommonComts/CommonNavBar'
import InfiniteScroll from 'react-infinite-scroll-component';
import utils from '../../../common/utils'
import Moment from 'moment'
import {lotteryIdDes} from '../../../common/LotType'
import '../../../Style/Find/lotteryResults.css'


class ShengfucaiAll extends Component{
  constructor(props){
    super(props)
    let getGid=props.location.query.gid
    this.state={
      pn:1,
      gid:getGid,
      listHeight:'',
      hasMore: 'true',
      data:[],
    }
    this.initialize=this.initialize.bind(this);
    this.loadMoreAction=this.loadMoreAction.bind(this);
    this.Template=this.Template.bind(this);
    this.GotoDetail=this.GotoDetail.bind(this);
  }
  componentWillMount(){
    this.initialize();
  }
  componentDidUpdate(){
    let myNavHeight = document.getElementsByClassName('myNav')[0].offsetHeight;
    var w=document.documentElement?document.documentElement.clientHeight:document.body.clientHeight;
    if(this.state.listHeight === '' &&  myNavHeight !== 0){
      let gettableHeight = w - document.getElementsByClassName('myNav')[0].offsetHeight
      this.setState({
        listHeight: gettableHeight - 5
      })
    }
  }
  initialize(pn){
    const _this = this;
    let Newpn=pn||1;
    awardList(_this.state.gid,Newpn).then((res)=>{
      let row = res.result.data;
      console.log(res.result)
      if(res.result.status==1){
        if(res.result.tp==res.result.pn){
          _this.setState({
            hasMore:false
          })
        }
        if (utils.checkIsArr(row)) {
          _this.setState({
            data:_this.state.data.concat(row),
            noResult: false
          })
          console.log(_this.state)
        } else {
          _this.setState({
            // [state]: type === 'refresh' ? row :
            data:_this.state.data.concat([row]),
            noResult: false
          })
        }
      }else{
        Toast('接口数据异常')
      }

    }).catch((e)=>{
      console.log(e)
    })
  }
  loadMoreAction() {
    const _this = this ;
    console.log(this.state)
    this.setState({
      pn:parseInt(_this.state.pn) + 1
    }, () => {
      this.initialize( _this.state.pn);
    })
  }
  WeekDateFormate(data){
    let arr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return arr[data]
  }
  GotoDetail(d){
    const _this = this;
    console.log(_this)
    const gid = _this.state.gid;
    const pid = d.pid;
    const code = d.acode;
    const awardtime = d.atime;
    _this.props.router.push({
      pathname: lotteryIdDes[gid][3],
      query: {
        gid: gid,
        pid: pid,
        moreqc:false,
        code: encodeURIComponent(code),
        awardtime: encodeURIComponent(awardtime)
      }
    })
  }
  Template(listdata){
      let _this = this;
      const items = [];
      listdata.map(function (i, v) {
        let acode = [];
        if(i.acode){
          acode = i.acode.split(',')
        }
        items.push(
          <Link key={v} onClick={()=>{_this.GotoDetail(i)}} className="lotteryA">
            <p className="p1">
              <span className="span1">{i.pid.substring(2,i.pid.length)}期</span>
              <span className="span4">{`${Moment(i.atime).format('MM-DD')}(${_this.WeekDateFormate(Moment(i.atime).weekday())})`}</span>
            </p>
            <p className="p2">
              {acode.map((item,index)=>{
                return(
                  <span className={v===0?"greenSpan":"greenColor"} key={`code${index}`}>{item}</span>
                )
              })}
            </p>
          </Link>
        )
      })
    return items
  }
  render() {
    const _this=this;
    return(
      <div id="lotteryResults">
        <CommonNavBar title={_this.state.gid==80?'胜负彩历史开奖':'任选九历史开奖'}/>
        <div>
          {
            _this.state.data.length>0?
              <InfiniteScroll
            height={_this.state.listHeight || 690}
            next={_this.loadMoreAction}
            hasMore={_this.state.hasMore}
            endMessage={
              <div className="end_div">
                <p className="end_p1">没有更多数据了</p>
              </div>
            }>
            {
              _this.Template(_this.state.data)
            }
            </InfiniteScroll>
                :
            <div className="emptyRedBox"><p>客官，暂无数据哟~</p></div>
          }
        </div>
      </div>
    )
  }
}

export default ShengfucaiAll
