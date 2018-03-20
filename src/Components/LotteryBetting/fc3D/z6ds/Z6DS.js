'use strict'
import React, {Component} from 'react'
import Pl3Head from '../../common/Pl3Head'
import Pl3Foot1 from '../../common/Pl3Foot1'
import utils from '../../../../common/utils'
import ZhuShou from '../../common/zhushou'
import _ from 'lodash'
import commonConfig from '../../../../config/commonConfig'

export class Z6DS extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      yilouShow: false,
      choose: {
        m0: [], m1: [], m2: []
      },
      zhushu: 0,
      delShow: false
    }
    this.lotteryData = {
      'red': 9,
      'miniRedNum': 1,
      'count': 3,
    }
    this.type = '5'
    this.animating = false;
    this.bigShow = this.bigShow.bind(this)
    this.bigHide = this.bigHide.bind(this)
    this.clickItem = this.clickItem.bind(this)
    this.template = this.template.bind(this)
    this.Template = this.Template.bind(this)
    this.clear = this.clear.bind(this)
    this.creatOne = this.creatOne.bind(this)
    this.receiveYL = this.receiveYL.bind(this)
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
        choose: {
          m0: [currentChoose.data.m0],
          m1: [currentChoose.data.m1],
          m2: [currentChoose.data.m2],
        },
        zhushu: currentChoose.zhushu
      })
    }
  }


  clear() {
    this.setState({
      choose: {
        m0: [], m1: [], m2: []
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
    let child = choose[wei]
    if (child.indexOf(val) >= 0) {
      child = child.slice(0, child.indexOf(val)).concat(child.slice(child.indexOf(val) + 1))
    } else {
      if (wei === 'm0') {
        choose.m1 = _.without(choose.m1, val)
        choose.m2 = _.without(choose.m2, val)
      } else if (wei === 'm1') {
        choose.m0 = _.without(choose.m0, val)
        choose.m2 = _.without(choose.m2, val)
      } else if (wei === 'm2') {
        choose.m1 = _.without(choose.m1, val)
        choose.m0 = _.without(choose.m0, val)
      }
      child.push(val)
    }
    child = utils.math.sort(child)
    choose[wei] = child
    let {m0, m1, m2} = choose
    let delShow = false
    if (m0.length > 0 || m1.length > 0 || m2.length > 0) {
      delShow = true
    }
    let zhushu = m0.length * m1.length * m2.length
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
      m1: [jxArr[1]],
      m2: [jxArr[2]],
    }
    if (render) {
      this.setState({
        choose: choose,
        zhushu: 1,
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

  //球渲染子模板
  template(from, to, wei) {
    let _this = this
    let arr = []

    function child() {
      let childArr = []
      for (let i = from; i <= to; i++) {
        childArr.push(
          <div key={'z6ds_qiu_' + i}
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
          <div key={'z6ds_yilou_' + i}
               className={_this.props.yilou[maxDesc] === _this.props.yilou[wei][i] ? "redColor" : ""}
          >
            {_this.props.yilou[wei][i]}
          </div>
        )
      }
      return childArr
    }

    arr.push(
      <div style={{width: '100%'}} key={"chooseList" + wei}>
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

  //球渲染模板
  Template() {
    let arr = []
    for (let i = 0; i < this.lotteryData.count; i++) {
      arr.push(
        <div key={'z6ds_' + i}>
          <div className="BallChoice redBallChoice">
            {this.template(0, 4, 'm' + i)}
            {this.template(5, 9, 'm' + i)}
          </div>
          {i !== this.lotteryData.count - 1 &&
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
        choose: {m0: [], m1: [], m2: []},
        zhushu: 0,
        delShow: false
      }, () => {
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
            this.setState({
              zhushu: 1,
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
              <p className="p1">猜中开奖号码即中奖<span>173</span>元</p>
              <ZhuShou receiveYL={this.receiveYL} yilouShow={this.state.yilouShow} type={this.props.type}/>
            </div>
            {this.Template()}
          </div>
        </div>
        <Pl3Foot1
          type={this.type}
          delShow={this.state.delShow}
          zhushu={this.state.zhushu}
          jxNum={this.props.jxNum}
          clear={this.clear}
          doNext={() => {
            let choose = this.state.choose
            if (choose.m0.length === 0 && choose.m1.length === 0 && choose.m2.length === 0) {
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

