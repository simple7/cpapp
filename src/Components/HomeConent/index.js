import React, {Component} from 'react';
import HomeBanner from './HomeBanner';
import {HomeNav} from '../../action/action.homenav'
import {connect} from 'react-redux'
import {IndexlotteryRouter} from '../../common/lotteryRoute'
import {hashHistory} from 'react-router'
import More from './more'
import Ssq from './ssq'
import commonConfig from '../../config/commonConfig'
import logo from '../../Img/logo.png'
import logo3 from '../../Img/logo3.png'
import indexMore from '../../Img//index_more.png'
import shaiDanQuan from '../../Img/sd.png'
import '../../Style/HomeConent/home_forecast.css'
import {AppJiek} from '../../common/AppApi'

const fta = {color: '#a8a8a8', fontSize: '12.8px'};
const aMargin = {margin: '0 4.8px'};
const rlcolor = {...aMargin, color: '#5c5c5c'};
const micolor = {...aMargin, color: '#106fe5'};

class HomeContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHeight: '',
      showMore: false,
      homePop: '',
      homeLogo: '',
      footState: ''
    };
    this.windowHeight = '';
    this.doSetHeight = this.doSetHeight.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(HomeNav('home'))
    //头部两个广告位
    let homePop = sessionStorage.getItem('homePop')
    let homeLogo = sessionStorage.getItem('homeLogo')
    let footState = sessionStorage.getItem('footState') || ''
    this.setState({
      homePop: homePop,
      homeLogo: homeLogo,
      footState: footState
    })
  }

  componentDidMount() {
    let w = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    this.doSetHeight(w)
  }
  doSetHeight(w) {
    let tabHeight = document.getElementsByClassName('am-tab-bar-bar')[0];
    if (tabHeight && tabHeight.offsetHeight !== 0 && this.state.listHeight === '') {
      let listHeight = w - tabHeight.offsetHeight
      this.setState({
        listHeight: listHeight,
      })
    }
  }


  render() {
    let w = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    if (this.windowHeight !== w) {
      this.windowHeight = w;
      this.doSetHeight(w)
    }
    const infooter = {
      textAlign: 'center',
      color: '#999',
      fontSize: '12px',
      paddingBottom: "15px",
      display: this.state.footState ? "block" : "none"
    };
    return (
      <div>
        <div id="home" className="listDivView"
             style={{
               position: 'relative',
               height: this.state.listHeight,
               display: this.props.showState === '1' ? 'block' : 'none'
             }}>
          <div className="logoDiv" style={{display: this.state.homeLogo ? 'none' : ''}}><img
            src={logo}/></div>
          <div className="logoDiv2 clearfix" style={{display: this.state.homePop ? "none" : "block"}}>
            <div className="div1" onClick={() => {
              sessionStorage.setItem('homePop', '1')
              this.setState({
                homePop: '1'
              })
            }}/>
            {/*删除*/}
            <div className="div2"><img src={logo3}/></div>
            <div className="div3"><a onClick={AppJiek.OpenAppJudge}>立即打开</a></div>
          </div>
          <HomeBanner/>
          <Ssq/>
          <div className="lottery_content">
            <div className="touzhuDiv clearfix">
              {
                IndexlotteryRouter.map((item, index) => {
                  return (
                    <div className="touzhuC" key={index} data-evid={item.evid}
                         onClick={() => {
                           hashHistory.push(item.route)
                         }}
                    >
                      <img src={item.imgUrl} alt=""/>
                      <p>{item.lotteryName}</p>
                    </div>
                  )
                })
              }
              <div className="touzhuC" onClick={() => {
                hashHistory.push('/more')
              }}>
                <img src={indexMore} alt=""/>
                <p>更多彩种</p>
              </div>
            </div>
          </div>
          <div className="adDiv1 clearfix">
            <div className="djq"
                 onClick={() => {
                   hashHistory.push({
                     pathname: 'linkPage',
                     query: {
                       url: commonConfig.domain + 'activity/GloryPlace/index.html?lotteryflag=99',
                       title: '大奖墙'
                     }
                   })
                 }}>
              <img src={shaiDanQuan}/>
              <p className="p1">晒单圈</p>
              <p className="p2">沾沾喜气中大奖</p>
            </div>
            <div className="zjgy"
                 onClick={() => {
                   window.location.href = commonConfig.activity + '#' + 'wanfa'
                 }}><p className="p1">中奖攻略</p><p className="p2">教你如何中奖</p>
            </div>
            <div className="sszt"
                 onClick={() => {
                   hashHistory.push({
                     pathname: 'linkPage',
                     query: {
                       url: commonConfig.domain + 'activity/article/list.html?lotteryflag=99',
                       title: '赛事专题'
                     }
                   })
                 }}><p className="p1">赛事专题</p><p className="p2">优质赛事解读</p>
            </div>
          </div>
          <footer className="infooter" style={infooter}>
            <div className="fta" style={fta}>
              <a href="http://t.9188.com" id="apk" style={rlcolor}>客户端</a> ｜
              <a href="javascript:;" className="touch" style={micolor}>触屏版</a> ｜
              <a href="http://www.9188.com/" style={rlcolor}>PC版</a>
            </div>
            <p style={{lineHeight: '32px'}}>沪ICP证B2-20150061 沪ICP备13032924号-9</p>
          </footer>
        </div>
        <div style={{display: this.props.showState === '2' ? '' : 'none', zIndex: 100}}>
          <More/>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    showState: state.HomeMoreReduce,
    HomeBanner: state.HomeBannerReduce
  }
}


export default connect(select)(HomeContent);
