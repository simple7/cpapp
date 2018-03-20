import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {Popover, Toast, NavBar} from 'antd-mobile';
import _ from 'lodash'
import utils from '../../../common/utils'
import moment from 'moment'
import ZhuShou from './zhushou'
import commonConfig from '../../../config/commonConfig'

const Item = Popover.Item;
export default class QxP52 extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      listHeight: '',
      lishi: this.props.lishi,
      yilou: this.props.yilou,
      historyShow: false,
      showMoney: false,
      yilouShow: false,
      pid: this.props.pid,
      atime: this.props.atime,
      choose: this.props.currentChoose,
      zhushu: 0,
      chooseList: [],
      showType: 1,
      popListHeight: '',
      delShow: false
    }
    this.animating = false;
    this.currentChoose = {red: [], blue: [], index: ''}
    this.lotteryData = {
      'pl5': {
        'red': 9,
        'miniRedNum': 1,
        'maxRedNum': 11,
        'count': 5,
        'lot_id': '52',
        'name': '排列五',
        topDesc: '与开奖号码按位相符即中奖100000元',
        wei: {
          0: '万位', 1: '千位', 2: '百位', 3: '十位', 4: '个位'
        }
      },
      'qxc': {
        'red': 9,
        'miniRedNum': 1,
        'maxRedNum': 11,
        'count': 7,
        'lot_id': '51',
        'name': '七星彩',
        topDesc: '每位至少选择1个号',
        wei: {
          0: '第一位', 1: '第二位', 2: '第三位', 3: '第四位', 4: '第五位', 5: '第六位', 6: '第七位'
        }

      }
    }
    this.type = this.props.type
    this.Template = this.Template.bind(this)
    this.template = this.template.bind(this)
    this.clickItem = this.clickItem.bind(this)
    this.bigShow = this.bigShow.bind(this)
    this.bigHide = this.bigHide.bind(this)
    this.clearChoose = this.clearChoose.bind(this)
    this.doNext = this.doNext.bind(this)
    this.jxNum = this.jxNum.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.creatOne = this.creatOne.bind(this)
    this.computeChoose = this.computeChoose.bind(this)
    this.receiveYL = this.receiveYL.bind(this)
    this.shark = this.shark.bind(this)
  }

  componentWillMount() {
    let choose = _.cloneDeep(this.props.currentChoose)
    if (choose.zhushu && choose.zhushu > 0) {
      this.setState({
        showMoney: true,
        zhushu: choose.zhushu
      }, () => {
        this.computeChoose()
      })
    } else {
      this.setState({
        showMoney: false
      })
    }
  }

  onSelect(obj) {
    let zhushu = obj.key
    this.jxNum(zhushu)
  }

  //机选
  jxNum(n) {
    let arr = []
    let len = this.props.chooseList.length
    for (let i = 0; i < n; i++) {
      let red = utils.math.random(0, this.lotteryData[this.type].red, this.lotteryData[this.type].count, false)
      let param = {
        m0: [red[0]],
        m1: [red[1]],
        m2: [red[2]],
        m3: [red[3]],
        m4: [red[4]],
        m5: [],
        m6: [],
        index: len + 1,
        zhushu: 1,
      }
      if (this.type === 'qxc') {
        param.m5 = [red[5]]
        param.m6 = [red[6]]
      }
      arr.unshift(param)
    }
    this.props.receive(arr, 'jx')
  }

  componentDidUpdate() {
    let programList = document.getElementsByClassName('programList')[0];
    if (programList && this.state.popListHeight === '') {
      let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
      let myNavHeight = document.getElementsByClassName('myNav')[0].offsetHeight;
      let bettingFooter = document.getElementsByClassName('programFooter')[0].offsetHeight;
      let listHeight = w - myNavHeight - bettingFooter - 80;
      this.setState({
        popListHeight: listHeight
      })
    }
  }

  componentDidMount() {
    let w = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    if (sessionStorage.getItem('headFlag')) {
      let bettingFooter = document.getElementsByClassName('bettingFooter')[0]
      if (this.state.listHeight === '' && bettingFooter) {
        let gettableHeight = w - bettingFooter.offsetHeight;
        this.setState({
          listHeight: gettableHeight
        })
      }
    } else {
      let myNavHeight = document.getElementsByClassName('myNav')[0];
      if (this.state.listHeight === '' && myNavHeight && myNavHeight.offsetHeight !== 0) {
        let bettingFooter = document.getElementsByClassName('bettingFooter')[0].offsetHeight
        let gettableHeight = w - myNavHeight.offsetHeight - bettingFooter;
        this.setState({
          listHeight: gettableHeight
        })
      }
    }
  }

  //点击选中球
  clickItem(e) {
    let dataset = e.target.dataset;
    let val = +dataset.v;
    let wei = dataset.wei;
    let type = this.type;
    let choose = _.cloneDeep(this.state.choose)
    let child = choose[wei]
    if (child.indexOf(val) >= 0) {
      child = child.slice(0, child.indexOf(val)).concat(child.slice(child.indexOf(val) + 1))
    } else {
      child.push(val)
    }
    child = utils.math.sort(child)
    choose[wei] = child
    this.setState({
      choose: choose
    }, () => {
      this.computeChoose()
    })
  }

  //计算选中项
  computeChoose() {
    let choose = _.cloneDeep(this.state.choose)
    let showMoney = false
    let zhushu = 0
    let delShow = false
    if (this.type === 'qxc') {
      let {m0, m1, m2, m3, m4, m5, m6} = choose;
      zhushu = m0.length * m1.length * m2.length * m3.length * m4.length * m5.length * m6.length
      if (zhushu > 0) {
        showMoney = true
      }
      if (m0.length > 0 || m1.length > 0 || m2.length > 0 || m3.length > 0 || m4.length > 0 || m5.length > 0 || m6.length > 0) {
        delShow = true
      }
    } else {
      let {m0, m1, m2, m3, m4} = choose
      zhushu = m0.length * m1.length * m2.length * m3.length * m4.length
      if (zhushu > 0) {
        showMoney = true
      }
      if (m0.length > 0 || m1.length > 0 || m2.length > 0 || m3.length > 0 || m4.length > 0) {
        delShow = true
      }
    }
    this.setState({
      showMoney: showMoney,
      zhushu: zhushu,
      delShow: delShow
    })
  }

  //生成一注
  creatOne(render = true) {
    let red = utils.math.random(0, this.lotteryData[this.type].red, this.lotteryData[this.type].count, true)
    let choose = {}
    if (this.type === 'qxc') {
      choose = {
        m0: [red[0]],
        m1: [red[1]],
        m2: [red[2]],
        m3: [red[3]],
        m4: [red[4]],
        m5: [red[5]],
        m6: [red[6]],
      }

    } else if (this.type === 'pl5') {
      choose = {
        m0: [red[0]],
        m1: [red[1]],
        m2: [red[2]],
        m3: [red[3]],
        m4: [red[4]],
      }
    }
    if (render) {
      this.setState({
        choose: choose
      }, () => {
        this.computeChoose()
      })
    } else {
      return choose
    }
  }

  //下一步
  doNext() {
    let {m0, m1, m2, m3, m4, m5, m6} = this.state.choose;
    if (this.type === 'qxc'
      && m0.length === 0
      && m1.length === 0
      && m2.length === 0
      && m3.length === 0
      && m4.length === 0
      && m5.length === 0
      && m6.length === 0) {
      this.creatOne()
      return;
    } else if (
      this.type === 'pl5'
      && m0.length === 0
      && m1.length === 0
      && m2.length === 0
      && m3.length === 0
      && m4.length === 0
    ) {
      this.creatOne()
      return;
    }
    if (this.state.zhushu === 0) {
      Toast.info('请至少选择1注', 1, false, null)
      return;
    }
    let arr = []
    let index = this.props.currentChoose.index
    let chooseList = _.cloneDeep(this.props.chooseList)
    let param = {}
    if (index) {
      param = {
        m0,
        m1,
        m2,
        m3,
        m4,
        m5,
        m6,
        index: index,
        zhushu: this.state.zhushu,
      }
      this.props.receive(param, 'zx')
    } else {
      param = {
        m0,
        m1,
        m2,
        m3,
        m4,
        m5,
        m6,
        index: chooseList.length + 1,
        zhushu: this.state.zhushu,
      }
      this.props.receive(param, 'zx', true)
    }
  }

  //清空
  clearChoose() {
    this.setState({
      delShow: false,
      chooseList: [],
      showMoney: false,
      zhushu: 0,
      choose: {
        m0: [], m1: [], m2: [], m3: [], m4: [], m5: [], m6: []
      },
    }, () => {
      this.computeChoose()
    })
  }


  bigShow(e) {
    let a = e.target.nextElementSibling
    a.classList.add('active')
    this.clickItem(e)
  }

  bigHide(e) {
    let a = e.target.nextElementSibling
    setTimeout(() => {
      a.classList.remove('active')
    }, 200)
  }

  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      yilouShow: yl
    })
  }

  template(from, to, wei, desc) {
    let _this = this
    let arr = []

    function child() {
      let childArr = []
      for (let i = from; i <= to; i++) {
        childArr.push(
          <div key={wei + 'qiu_' + i}
               className={_this.state.choose[wei].indexOf(i) >= 0 ? 'redBg' : ''}
          >
            <p style={{display: 'block'}} data-v={i} data-wei={wei}
               onTouchStart={_this.bigShow.bind(this)}
               onTouchEnd={_this.bigHide.bind(this)}>{i}</p>
            <p className="hoverRedBg"><span>{i}</span></p>
          </div>
        )
      }
      return childArr
    }

    function ylChild() {
      let childArr = []
      let maxDesc = wei + 'Max'
      for (let i = from; i <= to; i++) {
        childArr.push(
          <div key={wei + 'yilou_' + i}
               className={_this.state.yilou[maxDesc] === _this.state.yilou[wei][i] ? "redColor" : ""}
          >
            {_this.state.yilou[wei][i]}
          </div>
        )
      }
      return childArr
    }

    arr.push(
      <div style={{width: '100%'}} key={"chooseList" + wei}>
        <div className="column">
          {desc ?
            <div className="div2 clearfix">
              <span>{desc}</span>
            </div>
            :
            <div className="emptyDiv2"/>
          }

          {
            child()
          }
        </div>
        <div className="column_missing" style={{display: _this.state.yilouShow ? '' : 'none'}}>
          <div className="emptyDiv2"/>
          {ylChild()}
        </div>
      </div>
    )
    return arr
  }

  Template() {
    let type = this.type
    let arr = []
    for (let i = 0; i < this.lotteryData[type].count; i++) {
      arr.push(
        <div key={type + i}>
          <div className="BallChoice redBallChoice">
            {this.template(0, 4, 'm' + i, this.lotteryData[type].wei[i])}
            {this.template(5, 9, 'm' + i, '')}
          </div>
          {i !== this.lotteryData[this.type].count - 1 &&
          < div className="lineBox"/>
          }
        </div>
      )
    }
    return arr;
  }

  shark() {
    if (!this.animating) {
      this.animating = true;
      this.setState({
        choose: {m0: [], m1: [], m2: [], m3: [], m4: [], m5: [], m6: []}
      }, () => {
        this.computeChoose()
        let code = this.creatOne(false);
        let redL = Object.keys(code).length
        let i = 0;
        let flag = 'red'
        let intel = setInterval(() => {
          let choose = this.state.choose
          if (flag === 'red') {
            if (i < redL) {
              let key = 'm' + i
              choose[key] = code[key]
              this.setState({
                choose: choose
              })
              i++;
            } else {
              flag = 'end'
            }
          }
          if (flag === 'end') {
            clearInterval(intel)
            this.animating = false
            this.computeChoose()
          }
        }, commonConfig.AnimateDuration)

      })

    }
  }

  render() {
    let type = this.type;
    utils.Shake.run(() => {
      this.shark()
    })
    return (
      <div id="lotteryBetting">
        <NavBar className="myNav"
                mode="dark"
                iconName="cross"
                onLeftClick={() => {
                  this.props.setShowType(2)
                }}
                rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
                style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
        >{this.lotteryData[type].name}</NavBar>
        <div className="fc3DBetting listDivView" style={{height: this.state.listHeight}}>
          <div>
            <section className="beforePeriods" style={{display: this.state.historyShow ? "" : "none"}}>
              {this.state.lishi.map((item, index) => {
                return (
                  <ul className="ul_1 clearfix" key={'ul_' + index}>
                    <li className="li_1">{item.pid.substr(-3)}期</li>
                    <li className="li_2">
                      {item.red.map((it, ind) => {
                        return (
                          <span key={'red_' + ind}>{it}</span>
                        )
                      })}
                    </li>
                  </ul>
                )
              })}
            </section>

            <section className="currentPeriods">
              <div className="currentPeriodsBox clearfix">
                <div className="currentPeriodsBox_fl">{this.state.pid.substr(-3)}期</div>
                <div className="currentPeriodsBox_fr">
                  <p>{moment(this.state.atime).format('MM-DD HH:mm')}截止</p>
                </div>
              </div>
              <p className={this.state.historyShow ? "arrowP up" : "arrowP"} onClick={() => {
                this.setState({
                  historyShow: !this.state.historyShow
                })
              }}/>
            </section>
          </div>
          <div className="redBallTitle">
            <p className="p2"><span onClick={() => {
              this.creatOne()
            }
            }>摇一摇机选</span></p>
            {type === 'pl5' ?
              <p className="p1">与开奖号码按位相符即中奖<span>100000</span>元</p>
              :
              <p className="p1">{this.lotteryData.qxc.topDesc}</p>

            }
            <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.yilouShow} type={this.type}/>
          </div>
          {this.Template()}
        </div>
        <footer className="bettingFooter">
          <div className="clearfix bettingFooterInfo">
            {this.state.delShow ?
              <div className="emptyClear" onClick={() => {
                this.clearChoose()
              }}/>
              :
              <Popover placement="topLeft"
                       overlay={[
                         (<Item key="10" style={{background: "#49484B", color: "white"}}>10注</Item>),
                         (<Item key="5" style={{background: "#49484B", color: "white"}}>5注</Item>),
                         (<Item key="1" style={{background: "#49484B", color: "white"}}>1注</Item>)
                       ]}
                       align={{
                         overflow: {adjustY: 0, adjustX: 0},
                         offset: [10, -10],
                       }}
                       onSelect={this.onSelect}
              >
                <div className="choicePopover">机选
                </div>
              </Popover>
            }
            <div className="footerInfo">
              {
                this.state.showMoney ?
                  <p className="p3">共<span>{this.state.zhushu}</span>注 <span>{2 * this.state.zhushu}</span>元</p>
                  :
                  this.type !== 'qxc' ?
                    <p className="p3">每位至少选<span>1</span>个号</p>
                    : ''
              }
            </div>
          </div>
          <a className="nextBtn" onClick={() => this.doNext()}>下一步</a>
        </footer>
      </div>
    )

  }
}
