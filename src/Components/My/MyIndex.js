'use strict'
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import {UserIndexAPI, userBasicInfo, checkUserLogin} from '../../Stubs/API'
import {connect} from 'react-redux'
import {HomeNav} from '../../action/action.homenav'
import utils from '../../common/utils'
import commonConfig from '../../config/commonConfig'
import '../../Style/My/MyIndex.css'
import {AppJiek} from '../../common/AppApi'

/* 第三方app登录授权 */
const thirdAppLoginCheck = async (fn) => {
  await AppJiek.thirdAppLoginCheck(fn)
}

/* 头像 */
class UserTop extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="header_box clearfix">
        <div className="header_img">
          <a
            onClick={() => thirdAppLoginCheck(() => hashHistory.push('/myCenter'))}
          >
            <img src={this.props.data.userphoto ? this.props.data.userphoto : require('../../Img/defalut_heard.png')}/>
          </a>
        </div>
        <div className="header_info">
          {this.props.data.levelTitle ? (
            <div>
              <p className="p3">{this.props.data.uid}</p>
              {/*<a
                onClick={
                  async () => {
                    let params = {
                      pathname: "linkPage",
                      query: {
                        url: 'https:5.9188.com/activity/hyjf/#/huiyuan',
                        title: '会员中心',
                        // isWhite: true
                      }
                    }
                    let flag = await utils.checkLogin();
                    if(flag){
                      hashHistory.push(params)
                    }else{
                      hashHistory.push('/loginIndex')
                    }
                  }
                }
              >
                <p className="p2">
                  <span className="span1">{this.props.data.levelTitle.split('-')[0]}</span>
                  <span className="span2">{this.props.data.levelTitle.split('-')[1]}</span>
                </p>
              </a>*/}
            </div>
          ) : (
            <a onClick={() => thirdAppLoginCheck(() => hashHistory.push("/loginIndex"))}>
              <p className="p3">登录/注册</p>
            </a>
          )}
        </div>
        {/*{this.props.data.point &&
         <div className="header_jifen">
         <a
         onClick={
         async () => {
         let params = {
         pathname: "linkPage",
         query: {
         url: 'https:5.9188.com/activity/hyjf/#/jifen',
         title: '积分中心',
         // isWhite: true
         }
         }
         let flag = await utils.checkLogin();
         console.log(flag)
         if(flag){
         hashHistory.push(params)
         }else{
         hashHistory.push('/loginIndex')
         }
         }
         }
         >
         <span style={{"marginRight": "6px"}}>积分值 {this.props.data.point}</span>
         </a>
         </div>
         }*/}

      </div>
    )
  }
}

/* 尾部 我的红包 账户安全 帮助中心*/
class UserFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unsafe: '',
      des: '',
      data: this.props.data
    }
    this.Filter = this.Filter.bind(this);
  }

  Filter(data) {
    if (data.mobbind == '1' && data.idcard != '' && data.realname != '') {
      return {
        unsafe: '',
        des: '安全'
      }
    } else {
      return {
        unsafe: 'unsafe',
        des: '请完善信息'
      }
    }
  }

  componentDidMount() {
    this.Filter(this.state.data);
  }

  render() {
    const {data} = this.props;
    const {unsafe, des} = this.state;
    return (
      <div>
        <section className="myhb_wrap">
          <div>
            <a className="hongbaoA"
               onClick={() => thirdAppLoginCheck(() => hashHistory.push('/redpack'))}
            >
              <span className="span1 hongbaoIcon1">我的红包</span>
              {this.props.login &&
              <span className="span2">{data.redpacketmoney}</span>
              }
            </a>
          </div>
          <div>
            <a className="hongbaoA"
               onClick={() => thirdAppLoginCheck(() => hashHistory.push('/accountSafe'))}
            >
              <span className="span1 hongbaoIcon2">账户安全</span>
              {this.props.login &&
              <span className="span4">
                {this.Filter(data).unsafe === 'unsafe' &&
                <i/>
                }
                {this.Filter(data).des}
                </span>
              }

            </a>
          </div>
          <div><a className="hongbaoA"
                  onClick={() => {
                    hashHistory.push({
                      pathname: 'linkPage',
                      query: {
                        url: commonConfig.domain + 'help/',
                        title: '帮助中心'
                      }
                    })
                  }}
          >
            <span className="span1 hongbaoIcon3">帮助中心</span>
          </a></div>

        </section>
      </div>
    )
  }
}

/* 账户明细 */
class EyeSate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      eyeState: true
    }
    this.EyeClick = this.EyeClick.bind(this);
    this.DrawJudge = this.DrawJudge.bind(this);
  }

  EyeClick() {
    this.setState({
      eyeState: !this.state.eyeState
    })
  }

  DrawJudge() {
    utils.CheckInfor().then(() => {
      utils.CheckMobileIdCard('/Drawing/BankDrawing', '/drawing', 'bankCard');
    })
  }

  render() {
    const {usermoney} = this.props;
    const {DrawJudge} = this;
    return (
      <div className="header_money">
        <div className="div1">
          <span>
            {this.state.eyeState ? usermoney : '*****'}
            <span className={'eyeSpan ' + (this.state.eyeState ? '' : 'span_eye')} onClick={() => {
              this.EyeClick()
            }}/>
          </span>
          <a id="Acoutn_detail"
             onClick={() => thirdAppLoginCheck(() => hashHistory.push('/my/accountDetails'))}
          >查看账户明细</a>
        </div>
        <div className="div2 clearfix">
          <p className="p3" id="cz"
             onClick={() => thirdAppLoginCheck(() => hashHistory.push('/recharge'))}
          ><a>充值</a>
          </p>
          <p className="p4" id="withdrawal"
             onClick={() => thirdAppLoginCheck(() => DrawJudge())}
          ><a>提款</a>
          </p>
        </div>
      </div>
    )
  }
}

/*  我的购彩 全部订单 */
class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: [{query: '2', class: 'myicon', des: '待开奖', id: '1'},
        {query: '3', class: 'myicon', des: '已开奖', id: '2'},
        {query: '4', class: 'myicon', des: '中奖', id: '3'},
        {query: '5', class: 'myicon', des: '追号', id: '4'}]
    }
    this.desFilter = this.desFilter.bind(this);
    this.getMyList = this.getMyList.bind(this);
  }

  desFilter(unawardnum, i) {
    if (unawardnum == 0) {
      return '';
    } else if (unawardnum > 0 && unawardnum <= 99 && i == 0) {
      return unawardnum;
    } else if (unawardnum > 99 && i == 0) {
      return '99+';
    }
  }

  async getMyList(value) {
    thirdAppLoginCheck(() => {
      let params = {
        pathname: "buyList",
        query: {
          active: value
        }
      }
      hashHistory.push(params)
    })
  }

  render() {
    const {link} = this.state;
    const {unawardnum} = this.props;
    return (
      <section className="mygc_wrap margin_b25">
        <div className="div3" onClick={() => thirdAppLoginCheck(() => hashHistory.push('/buyList?active=1'))}>
          <span>我的购彩</span>
          <a>查看全部订单</a>
        </div>
        <ul className="mygc_ul clearfix">
          {
            link.map((item, i) => {
              var num = Number(i) + 1;
              return (
                <li key={item.id}>
                  <a onClick={this.getMyList.bind(this, item.query)} className={item.class + '_' + num}>
                    <span>{item.des}</span>
                    <em style={{display: (this.desFilter(unawardnum, i) ? 'block' : 'none')}}>
                      <i>{this.desFilter(unawardnum, i)}</i>
                    </em>
                  </a>
                </li>
              )
            })
          }
        </ul>
      </section>
    )
  }
}

class UserIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: false,
      userData: {
        userphoto: '',
        point: '',
        usermoney: '0',
        redpacketmoney: 0,
        mobbind: '',
        idcard: '',
        realname: '',
        unawardnum: ''
      }
    }
    this.initialize = this.initialize.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(HomeNav('my'))
    this.initialize();
  }

  initialize() {
    const _this = this;
    if (!sessionStorage.getItem("userData")) {
      UserIndexAPI('noLoad').then((data) => {
        if (data.code === '0') {
          sessionStorage.setItem("userData", JSON.stringify(data.user));
          this.setState({
            userData: data.user,
            login: true
          });
        } else {
          this.setState({
            login: false
          });
        }
      }).catch((err) => {
        console.log(err);
      })
    } else {
      let userJsonStr = sessionStorage.getItem('userData');
      _this.setState({
        userData: JSON.parse(userJsonStr),
        login: true
      }, () => {
        UserIndexAPI('noLoad').then((data) => {
          if (data.code === '0') {
            sessionStorage.setItem("userData", JSON.stringify(data.user));
            this.setState({
              userData: data.user,
            });
          } else {
            sessionStorage.removeItem("userData")
          }
        })
      })
    }
  }

  render() {
    const {children} = this.props;
    let content = '';
    if (children) {
      content = children
    } else {
      content = <div>
        <section className="margin_b25">
          <UserTop data={this.state.userData}/>
          <EyeSate usermoney={this.state.userData.usermoney}/>
        </section>
        <Order unawardnum={this.state.userData.unawardnum}/>
        <UserFooter login={this.state.login} data={this.state.userData}/>
      </div>
    }
    return (
      <div id="UserIndex">
        {content}
      </div>
    )
  }
}

function select(state) {
  return {
    navState: state.HomeNav
  }
}

export default connect(select)(UserIndex)
