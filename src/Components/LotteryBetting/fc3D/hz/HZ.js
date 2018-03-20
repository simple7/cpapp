'use strict'
import React, {Component} from 'react'
import Pl3Head from '../../common/Pl3Head'
import Pl3Foot1 from '../../common/Pl3Foot1'
import utils from '../../../../common/utils'
import ZhuShou from '../../common/zhushou'
import _ from 'lodash'
import commonConfig from '../../../../config/commonConfig'

export class HZ extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      choose: {m0: []},
      yilouShow: false,
      zhushu: 0,
      delShow: false
    }
    this.type = '2'
    this.lotteryData = {
      'red': 27,
      'miniRedNum': 1,
      hz: {
        0: 1,
        1: 3,
        2: 6,
        3: 10,
        4: 15,
        5: 21,
        6: 28,
        7: 36,
        8: 45,
        9: 55,
        10: 63,
        11: 69,
        12: 73,
        13: 75,
        14: 75,
        15: 73,
        16: 69,
        17: 63,
        18: 55,
        19: 45,
        20: 36,
        21: 28,
        22: 21,
        23: 15,
        24: 10,
        25: 6,
        26: 3,
        27: 1
      },//和值对应注数
    }
    this.animating = false
    this.Template = this.Template.bind(this)
    this.bigShow = this.bigShow.bind(this)
    this.bigHide = this.bigHide.bind(this)
    this.clickItem = this.clickItem.bind(this)
    this.clear = this.clear.bind(this)
    this.receiveYL = this.receiveYL.bind(this)
    this.creatOne = this.creatOne.bind(this)
    this.shark = this.shark.bind(this)
  }

  componentWillMount() {
    let choose = _.cloneDeep(this.props.choose)
    let currentChoose = _.cloneDeep(this.props.currentChoose)
    if (choose && choose.type === this.type && choose.zhushu > 0) {
      this.setState({
        choose: choose.data,
        zhushu: choose.zhushu
      })
    } else if (currentChoose && currentChoose.index && currentChoose.type === this.type) {
      this.setState({
        choose: currentChoose.data,
        zhushu: currentChoose.zhushu
      })
    }
  }


  clear() {
    this.setState({
      choose: {
        m0: [],
      },
      zhushu: 0,
      delShow: false
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


  //点击选中球
  clickItem(e) {
    let dataset = e.target.dataset;
    let val = +dataset.v;
    let wei = dataset.wei;
    let choose = _.cloneDeep(this.state.choose)
    console.log(choose, wei)
    let child = choose[wei]
    if (child.indexOf(val) >= 0) {
      child = child.slice(0, child.indexOf(val)).concat(child.slice(child.indexOf(val) + 1))
    } else {
      child.push(val)
    }
    child = utils.math.sort(child)
    let zhushu = 0
    _.each(child, item => {
      zhushu += this.lotteryData.hz[item]
    })
    let delShow = false
    if (child.length > 0) {
      delShow = true
    }
    choose[wei] = child
    console.log(111, choose)
    this.setState({
      choose: choose,
      zhushu: zhushu,
      delShow: delShow
    })
  }

  creatOne(render = true) {
    let jxArr = this.props.creatOne(this.type)
    let choose = {
      m0: [jxArr[0]],
    }
    if (render) {
      this.setState({
        choose: choose,
        zhushu: this.lotteryData.hz[jxArr[0]],
        delShow: true
      })
    } else {
      return choose
    }

  }

  //接受popover传回的遗漏
  receiveYL(yl) {
    this.setState({
      yilouShow: yl
    })
  }

  Template(from, to) {
    let _this = this
    let arr = []

    function child() {
      let childArr = []
      for (let i = from; i <= to; i++) {
        if (i > _this.lotteryData.red) {
          childArr.push(
            <div className="emptyDiv" key={'zxhz_qiu_' + i}/>
          )
        } else {
          childArr.push(
            <div key={'zxhz_qiu_' + i}
                 className={_this.state.choose.m0.indexOf(i) >= 0 ? 'redBg' : ''}
            >
              <p style={{display: 'block'}} data-v={i} data-wei="m0"
                 onTouchStart={_this.bigShow.bind(this)}
                 onTouchEnd={_this.bigHide.bind(this)}>{i}</p>
              <p className={"hoverRedBg"}><span>{i}</span></p>
            </div>
          )

        }

      }
      return childArr
    }

    function ylChild() {
      let childArr = []
      for (let i = from; i <= to; i++) {
        if (i > _this.lotteryData.red) {
          childArr.push(
            <div key={'zxhz_yilou_' + i}/>
          )
        } else {
          childArr.push(
            <div key={'zxhz_yilou_' + i}
                 className={_this.props.yilou.m3Max === _this.props.yilou.m3[i] ? "redColor" : ""}
            >
              {_this.props.yilou.m3[i]}
            </div>
          )
        }

      }
      return childArr
    }

    arr.push(
      <div style={{width: '100%'}} key={"zxhz_chooseList" + from}>
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

  shark() {
    if (!this.animating) {
      this.animating = true;
      this.setState({
        choose: {m0: []},
        zhushu: 0,
        delShow: false
      }, () => {
        let code = this.creatOne(false);
        let redL = code.m0.length
        let i = 0;
        let flag = 'red'
        let intel = setInterval(() => {
          let choose = this.state.choose
          if (flag === 'red') {
            if (i < redL) {
              choose.m0.push(code.m0[i])
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
            this.setState({
              zhushu: this.lotteryData.hz[code.m0[0]],
              delShow: true
            })
          }
        }, commonConfig.AnimateDuration)

      })

    }
  }

  render() {
    utils.Shake.run(() => {
      this.shark()
    })
    return (
      <div>
        <div className="listDivView" style={{height: this.props.listHeight || 350}}>
          <div className="fc3DBetting">
            <Pl3Head
              active={this.type}
              pid={this.props.pid}
              atime={this.props.atime}
              yilou={this.props.yilou}
              lishi={this.props.lishi}
            />
            <div className="redBallTitle">
              <p className="p2"><span onClick={() => {
                this.creatOne()
              }
              }>摇一摇机选</span></p>
              <p className="p1">与开奖号码按位相符即中奖<span>1040</span>元</p>
              <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.yilouShow} type={this.props.type}/>
            </div>
            <div className="BallChoice redBallChoice">
              {this.Template(0, 6)}
              {this.Template(7, 13)}
              {this.Template(14, 20)}
              {this.Template(21, 27)}
            </div>

          </div>
        </div>
        <Pl3Foot1 type={this.type}
                  delShow={this.state.delShow}
                  zhushu={this.state.zhushu}
                  jxNum={this.props.jxNum}
                  clear={this.clear}
                  desc2="1"
                  doNext={() => {
                    let choose = this.state.choose
                    if (choose.m0.length === 0) {
                      this.creatOne()
                      return;
                    }
                    this.props.doNext(this.type, this.state.choose, this.state.zhushu)
                  }}
        />
      </div>
    )
  }
}

