import React, {Component} from 'react'
import {Popover, Toast, NavBar} from 'antd-mobile';
import {hashHistory} from 'react-router'
import _ from 'lodash'
import utils from '../../../common/utils'
import moment from 'moment'
import ZhuShou from './zhushou'
import commonConfig from '../../../config/commonConfig'

const Item = Popover.Item;
export default class SsqDltChild2 extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      listHeight: '',
      lishi: this.props.lishi,
      yilou: this.props.yilou,
      historyShow: false,
      showMoney: false,
      yilouShow: false,
      gPoll: this.props.gPoll,
      tkbei: this.props.tkbei,
      pid: this.props.pid,
      atime: this.props.atime,
      choose: this.props.currentChoose,
      zhushu: 0,
      chooseList: [],
      perMoney:this.props.perMoney,
    }

    this.lotteryData = {
      ssq: {
        'red': 33,
        'blue': 16,
        'miniRedNum': 6,
        'maxRedNum': 20,
        'miniBlueNum': 1,
        'count': 5,
        'lot_id': '01',
        'name': '双色球',
        'redDesc': '至少选择6个红球',
        'blueDesc': '至少选择1个蓝球'
      },
      dlt: {
        'red': 35,
        'blue': 12,
        'miniRedNum': 5,
        'maxRedNum': 20,
        'miniBlueNum': 2,
        'count': 5,
        'lot_id': '50',
        'name': '大乐透',
        'redDesc': '前区 至少选择5个红球',
        'blueDesc': '后区 至少选择2个蓝球'
      },
      qlc: {
        'red': 30,
        'blue': 0,
        'miniRedNum': 7,
        'maxRedNum': 30,
        'miniBlueNum': 0,
        'count': 5,
        'lot_id': '07',
        'name': '七乐彩',
        'redDesc': '请选择7-15个号',
      },
    }
    this.type = this.props.type;
    this.animating = false;
    this.Template = this.Template.bind(this)
    this.clickItem = this.clickItem.bind(this)
    this.bigShow = this.bigShow.bind(this)
    this.bigHide = this.bigHide.bind(this)
    this.clearChoose = this.clearChoose.bind(this)
    this.doNext = this.doNext.bind(this)
    this.jxNum = this.jxNum.bind(this)
    this.onSelect = this.onSelect.bind(this)
    this.computeChoose = this.computeChoose.bind(this)
    this.creatOne = this.creatOne.bind(this)
    this.receiveYL = this.receiveYL.bind(this)
    this.shark = this.shark.bind(this)
  }

  componentWillMount() {
    let choose = _.cloneDeep(this.props.currentChoose)
    let type = this.type
    let {red, blue} = choose
    let rlen = red.length;
    let blen = blue.length;
    if (rlen >= this.lotteryData[type].miniRedNum && blen >= this.lotteryData[type].miniBlueNum) {
      let zhushu = utils.math.C(rlen, this.lotteryData[type].miniRedNum) * utils.math.C(blen, this.lotteryData[type].miniBlueNum)
      this.setState({
        showMoney: true,
        zhushu: zhushu
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
    let arr = [];
    console.log(this.props)
    let len = this.props.chooseList.length
    for (let i = 0; i < n; i++) {
      let red = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].red, this.lotteryData[this.type].miniRedNum, false)).sort(function (a, b) {
        return a - b;
      })
      let blue = []
      if (this.type !== 'qlc') {
        blue = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].blue, this.lotteryData[this.type].miniBlueNum, false)).sort(function (a, b) {
          return a - b;
        })
      }
      len += 1;
      let param = {
        blue: blue,
        red: red,
        index: len,
        zhushu: 1
      }
      arr.unshift(param)
    }
    this.props.receive(arr, 'jx')
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
  shark(){
    if (!this.animating) {
      this.animating = true;
      this.setState({
        choose: {red: [], blue: []}
      }, () => {
        this.computeChoose()
        let code = this.creatOne(false);
        let redL = code.red.length
        let blueL = code.blue.length
        let red = this.state.choose.red;
        let blue = this.state.choose.blue;
        let i = 0;
        let flag = 'red'
        let intel2 = setInterval(() => {
          let choose = this.state.choose
          if (flag === 'red') {
            if (i < redL) {
              red.push(code.red[i])
              choose.red = red
              this.setState({
                choose: choose
              })
              i++;
            } else {
              i = 0
              flag = 'blue'
            }
          }
          if (flag === 'blue') {
            if (i < blueL) {
              blue.push(code.blue[i])
              choose.blue = blue
              this.setState({
                choose: choose
              })
              i++
            } else {
              flag = 'end'
            }
          }
          if (flag === 'end') {
            clearInterval(intel2)
            this.animating = false
            this.computeChoose()
          }
        }, commonConfig.AnimateDuration)

      })

    }
  }
  //点击选中球
  clickItem(e) {
    let dataset = e.target.dataset;
    let i = dataset.v;
    let color = dataset.color;
    let type = dataset.type;
    let arr = _.cloneDeep(this.state.choose[color])
    if (arr.indexOf(i) >= 0) {
      arr = arr.slice(0, arr.indexOf(i)).concat(arr.slice(arr.indexOf(i) + 1))
    } else {
      arr.push(i)
    }
    let choose = {}
    choose[color] = arr
    if (color === 'red') {
      choose.blue = _.cloneDeep(this.state.choose.blue)
    } else {
      choose.red = _.cloneDeep(this.state.choose.red)
    }
    this.setState({
      choose: choose
    }, () => {
      this.computeChoose()
    })
  }
  // 计算点击球后注数
  computeChoose(){
    let choose = _.cloneDeep(this.state.choose)
    let {red, blue} = choose
    let rlen = red.length;
    let blen = blue.length;
    if (rlen >= this.lotteryData[this.type].miniRedNum && blen >= this.lotteryData[this.type].miniBlueNum) {
      let zhushu = utils.math.C(rlen, this.lotteryData[this.type].miniRedNum) * utils.math.C(blen, this.lotteryData[this.type].miniBlueNum)
      this.setState({
        showMoney: true,
        zhushu: zhushu
      })
    } else {
      this.setState({
        showMoney: false,
        zhushu:0
      })
    }
  }
// 生成一注
  creatOne(render = true) {
    let red = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].red, this.lotteryData[this.type].miniRedNum, false)).sort(function (a, b) {
      return a - b;
    })
    let blue = []
    if (this.type !== 'qlc') {
      blue = utils.math.padArray(utils.math.random(1, this.lotteryData[this.type].blue, this.lotteryData[this.type].miniBlueNum, false)).sort(function (a, b) {
        return a - b;
      })
    }
    let choose = {
      red: red,
      blue: blue
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
    let {red, blue} = this.state.choose
    red = red.sort((a,b)=>{
      return a-b
    })
    blue=blue.sort((a,b)=>{
      return a-b
    })
    if (red.length === 0 && blue.length === 0 && this.type !== 'qlc') {
      this.creatOne()
      return;
    } else if (red.length === 0 && this.type === 'qlc') {
      this.creatOne()
      return;
    }
    let index = this.props.currentChoose.index
    console.log(this.state.choose)
    if (this.state.zhushu === 0) {
      Toast.info('请至少选择1注', 1, false, null)
      return;
    }
    let chooseList = _.cloneDeep(this.props.chooseList)
    let param = {}
    if (index) {
      param = {
        red: red,
        blue: blue,
        index: index,
        zhushu: this.state.zhushu
      }
      this.props.receive(param, 'zx')
    } else {
      param = {
        red: red,
        blue: blue,
        index: chooseList.length + 1,
        zhushu: this.state.zhushu
      }
      this.props.receive(param, 'zx', true)
    }

  }

  //清空
  clearChoose() {
    this.setState({
      showMoney: false,
      zhushu: 0,
      choose: {
        red: [],
        blue: []
      }
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
  Template(from, to, color, type) {
    let _this = this
    let arr = []

    function child() {
      let childArr = []
      for (let i = from - 1; i < to; i++) {
        if ((type === 'ssq' && color === 'red' && i >= _this.lotteryData.ssq.red)
          || (type === 'ssq' && color === 'blue' && i >= _this.lotteryData.ssq.blue)) {
          childArr.push(
            <div className="emptyDiv" key={color + 'qiu_' + i}/>
          )
        } else {
          let value = ('0' + (i + 1)).substr(-2)
          childArr.push(
            <div key={color + 'qiu_' + i}
                 className={_this.state.choose[color].indexOf(value) >= 0 ? color + 'Bg' : ''}
            >
              <p style={{display: 'block'}} data-v={value} data-color={color} data-type={type}
                 onTouchStart={_this.bigShow.bind(this)}
                 onTouchEnd={_this.bigHide.bind(this)}>{value}</p>
              <p className={"hover" + color + "Bg"}><span>{value}</span></p>
            </div>
          )

        }

      }
      return childArr
    }

    function ylChild() {
      let childArr = []
      let maxDesc = color + 'Max'
      for (let i = from - 1; i < to; i++) {
        if (i >= _this.lotteryData[type][color]) {
          childArr.push(
            <div key={color + 'yilou_' + i}/>
          )
        } else {
          childArr.push(
            <div key={color + 'yilou_' + i}
                 className={_this.state.yilou[maxDesc] === _this.state.yilou[color][i] ? "redColor" : ""}>
              {_this.state.yilou[color][i]}
            </div>
          )
        }

      }
      return childArr
    }

    arr.push(
      <div style={{width: '100%'}} key={"chooseList" + from}>
        <div className="column">
          {
            child()
          }
        </div>
        <div className="column_missing" style={{display: _this.state.yilouShow ? '' : 'none'}}>
          {ylChild()}
        </div>
      </div>
    )
    return arr
  }

  render() {
    utils.Shake.run(()=>{
      this.shark()
    })
    let type = this.type;
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
        <div className="ssqBetting listDivView" style={{height: this.state.listHeight}}>
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
                      {item.blue.map((it, ind) => {
                        return (
                          <span className="colorBlue" key={'blue_' + ind}>{it}</span>

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
                  <p>奖池滚存
                    <span className="colorRed">{this.state.gPoll.money}
                    </span>{this.state.gPoll.unit} <span className="colorRed">{this.state.tkbei}</span>
                    倍掏空奖池
                  </p>
                </div>
              </div>
              <p className={this.state.historyShow ? "arrowP up" : "arrowP"} onClick={() => {
                this.setState({
                  historyShow: !this.state.historyShow
                })
              }}/>
            </section>
          </div>
          <div>
            <div className="redBallTitle">
              <p className="p2"><span onClick={() => {
                this.creatOne()
              }
              }>摇一摇机选</span></p>
              <p className="p1">{this.lotteryData[type].redDesc}</p>
              <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.yilouShow} type={this.type}/>
            </div>
            <div className="BallChoice redBallChoice">
              {this.Template(1, 7, 'red', type)}
              {this.Template(8, 14, 'red', type)}
              {this.Template(15, 21, 'red', type)}
              {this.Template(22, 28, 'red', type)}
              {this.Template(29, 35, 'red', type)}
            </div>
          </div>
          {
            (type === 'ssq' || type === 'dlt') &&
            <div>
              <div className="BlueBallTitle">
                <p className="p1">{this.lotteryData[type].blueDesc}</p>
              </div>
              <div className="BallChoice blueBallChoice">
                {this.Template(1, 7, 'blue', type)}
                {this.Template(8, 14, 'blue', type)}
                {this.Template(15, 21, 'blue', type)}
              </div>
            </div>
          }

        </div>
        <footer className="bettingFooter">
          <div className="clearfix bettingFooterInfo">
            {(this.state.choose.red.length > 0 || this.state.choose.blue.length > 0) ?
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
            <div className="footerInfo" style={{display: this.state.showMoney ? '' : 'none'}}>
              <p className="p3">共<span>{this.state.zhushu}</span>注 <span>{this.state.perMoney * this.state.zhushu}</span>元</p>
            </div>
          </div>
          <a className="nextBtn" onClick={() => this.doNext()}>下一步</a>
        </footer>
      </div>
    )

  }
}
