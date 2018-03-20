import React, {Component} from 'react'
import {hashHistory} from 'react-router';
import {Carousel} from 'antd-mobile'
import {banner_h5, appgonggaolist} from '../../Stubs/API'
import {connect} from 'react-redux'
import moment from 'moment'
import _ from 'lodash'
import commonConfig from '../../config/commonConfig'
import {HomeBannerAction} from '../../action/action.home'
import { AppJiek } from '../../common/AppApi'


class Carousels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: ['', '', ''],
      BannerArry: this.props.homeBanner,
      appgonggaolist: [{
        ntitle: '好运 for you，天天中奖',
        arcurl: '/noticeList',
        goNotice: 1
      }],
      initialHeight: 200
    }
    this.gginfinite = true
    this.initialize = this.initialize.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
  }

  componentWillMount() {
    console.log(this.props)
    this.initialize();
  }

  initialize() {
    const that = this;
    banner_h5('').then(result => {
      console.log(result)
      if (result.code == 0) {
        let arr = []
        if (result.banners.banner.constructor == Object) {
          arr = [result.banners.banner]
        } else {
          arr = result.banners.banner
        }
        this.props.dispatch(HomeBannerAction(arr))
        that.setState({
          BannerArry: arr
        })
      }
    }).catch(error => {
      console.log(error)
    })
    appgonggaolist().then(result => {
      if (result.code == 0) {
        let row = result.row
        if (!_.isArray(row)) {
          row = [row]
        }
        let threeDayTime = moment().subtract(2, 'days').format('YYYY-MM-DD')
        threeDayTime = moment(threeDayTime).unix()
        let arr = []
        _.map(row, item => {
          if (item.ndate && +item.ndate > threeDayTime) {
            arr.push(item)
          }
        })
        if (arr.length === 0) {
          arr = [{
            ntitle: '好运 for you，天天中奖',
            arcurl: 'noticeList',
            goNotice: 1
          }]
        }
        if(arr.length === 1){
          this.gginfinite = false
        }
        that.setState({
          appgonggaolist: arr
        })
      }
    }).catch(error => {
      console.log(error)
    })
  }

  checkLogin(d) {
    if(d.id == 'JCDS'){
      AppJiek.thirdAppLoginCheck(()=> {
        location.href = d.newlink
      })
    }else{
      location.href = d.newlink
    }

  }

  render() {
    const {BannerArry, initialHeight,} = this.state;
    let bannerDefault = BannerArry[0]
    const hProp = initialHeight ? {height: `${initialHeight}px`} : {};
    return (
      <div>{
        this.state.BannerArry.length > 1 ?
          <Carousel
            className="my-carousel"
            autoplay={true}
            infinite
            selectedIndex={0}
            swipeSpeed={35}
            beforeChange={(from, to) => {/*console.log(`slide from ${from} to ${to}`)*/
            }}
            afterChange={index => {/*console.log('slide to', index)*/
            }}
            /*speed={600}*/
            /*autoplayInterval={1500}*/
            dotStyle={{position: 'relative', top: '-3px'}}
            dotActiveStyle={{position: 'relative', top: '-3px'}}
          >
            {this.state.BannerArry && this.state.BannerArry.map((ii, index) => {

              let src = '';
              if (BannerArry.length > 1) {
                src = commonConfig.domain.substr(0,commonConfig.domain.length-1) + ii.src;
              } else {
                src = ii.src;
              }
              return (
                <a key={index} onClick={()=> this.checkLogin(ii)}>
                  <img className="carouselImg"
                       src={src}
                       alt="icon"
                       style={{'maxWidth': '100%'}}
                       onLoad={() => {
                         window.dispatchEvent(new Event('resize'));
                         this.setState({
                           initialHeight: null,
                         });
                       }}
                  />
                </a>
              )
            })}
          </Carousel>
          : <div style={{height: '150px'}}><a href={bannerDefault.link}>
            <img className="carouselImg"
                 src={bannerDefault.src}
                 alt="icon"
                 style={{'maxWidth': '100%'}}
            />
          </a></div>
      }
        <Carousel
          className="my-carousel gonggaoCarousel"
          vertical
          dots={false}
          dragging={false}
          swiping={false}
          swipeSpeed={100}
          autoplay
          infinite={this.gginfinite}
        >
          {this.state.appgonggaolist.map((it, index) => (
            <div key={index} className="v-item gonggaoBox">
              <a onClick={() => {
                let url = ''
                if (it.goNotice) {
                  hashHistory.push({
                    pathname: '/noticeList',
                  })
                } else {
                  hashHistory.push({
                    pathname: '/noticeList/noticePage',
                    query: {
                      url: commonConfig.mobileDomain + it.arcurl,
                      title: '系统公告'
                    }
                  })
                }

              }}>
                {it.ntitle}
              </a>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}


function select(state) {
  return {
    homeBanner: state.HomeBannerReduce
  }
}

export default connect(select)(Carousels);
