'use strict'
import React, {Component} from 'react'
import {Tabs, NavBar, Toast} from 'antd-mobile';
import _ from 'lodash'
import utils from '../../../common/utils'
import {hashHistory} from 'react-router'

import '../../../Style/lotteryBetting/index.less'
import '../../../Style/lotteryBetting/fc3D.less'
import "../../../Style/lotteryBetting/mixedPop.less"
import DownComt from '../common/downComt'
const TabPane = Tabs.TabPane;

import {Z6DS} from "./z6ds/Z6DS"
import {ZX} from "./zx/ZX"
import {HZ} from "./hz/HZ"
import {Z6FS} from "./z6fs/Z6FS"
import {Z3DS} from "./z3ds/Z3DS"
import {Z3FS} from "./z3fs/Z3FS"

class IndexChild extends Component {
  constructor() {
    super(...arguments)
    this.state = {...this.props.state}
    this.data = this.props.data
    this.type = this.props.type
    this.tabsData = [
      {title: "直选", key: '1'},
      {title: "直选和值", key: '2'},
      {title: "组三单式", key: '3'},
      {title: "组三复式", key: '4'},
      {title: "组六单式", key: '5'},
      {title: "组六复式", key: '6'},
    ];
    this.jxNum = this.jxNum.bind(this)
    this.clear = this.clear.bind(this)
    this.computeAll = this.computeAll.bind(this)
    this.doNext = this.doNext.bind(this)
    this.switchType = this.switchType.bind(this)
    this.creatOne = this.creatOne.bind(this)

    this.menuPop = this.menuPop.bind(this);
    this.clickWF = this.clickWF.bind(this);
  }

  componentWillMount() {
    let currentChoose = this.props.currentChoose
    let type = currentChoose.type
    if (type) {
      this.setState({
        active: type
      })
    }
  }
  //机选
  jxNum(n, type) {
    let active = this.props.active
    let length = this.state.chooseList.length
    let arr = []
    for (let i = 0; i < n; i++) {
      let red = utils.math.random(this.data.jx[active].min, this.data.jx[active].max, this.data.jx[active].count, this.data.jx[active].repeat)
      if (this.data.jx[active].order) {
        red = utils.math.sort(red)
      }
      length += 1;
      let param = {
        type: active,
        index: length,
        zhushu: 1
      }
      if (active === this.type.hz) {
        param.data = {m0: [red[0]]}
      } else if (active === this.type.z3fs) {
        param.data = {
          m0: [red[0], red[1]]
        }
      } else if (active === this.type.z3ds) {
        param.data = {
          m0: red[0],
          m1: red[1],
          m2: red[1]
        }
      } else if (active === this.type.z6fs) {
        param.data = {
          m0: [red[0], red[1], red[2]],
        }
      } else {
        param.data = {
          m0: [red[0]],
          m1: [red[1]],
          m2: [red[2]]
        }
      }
      arr.unshift(param)
    }
    this.props.receive(arr, 'jx', '', this.state.active,)
  }

  //清空选中项
  clear() {
    this.setState({
      zhushu: 0,
      chooseList: [],
      choose: {
        m0: [], m1: [], m2: []
      }
    })
  }

  // 重新计算投注金额
  computeAll() {
    let chooseList = _.cloneDeep(this.state.chooseList);
    let beiNum = +this.state.beiNum;
    let buyQi = +this.state.buyQi
    let zhushu = 0
    _.each(chooseList, item => {
      zhushu += item.zhushu
    })
    this.setState({
      zongZhushu: zhushu,
      money: zhushu * beiNum * buyQi * 2
    })
  }

// 点击下一步自动生成一注
  creatOne(active) {
    let red = utils.math.random(this.data.jx[active].min, this.data.jx[active].max, this.data.jx[active].count, this.data.jx[active].repeat)
    if (this.data.jx[active].order) {
      red = utils.math.sort(red)
    }
    return red
  }

  //下一步
  doNext(type, data, zhushu) {
    let ind = this.props.currentChoose.index
    let index = this.props.currentChoose.index
    let length = this.state.chooseList.length
    let {m0, m1, m2} = data;
    if (zhushu === 0) {
      Toast.info('请至少选择1注', 1, false, null)
      return;
    }
    if (type === this.type.z3ds) {
      let arr = []
      let flag = false
      _.each(m0, item => {
        _.each(m1, item2 => {
          let param = {
            data: {
              m0: item,
              m1: item2,
              m2: item2,
            },
            zhushu: 1,
            type: type,
            zigou: true
          }
          if (index) {
            param.index = 'z3ds_pop_' + index
            index += 1
          } else {
            flag = true
            param.index = length + 1;
            length += 1
          }
          arr.push(param)
        })
      })
      this.props.receive(arr, 'z3ds', flag, this.state.active, ind)
    }else if(type===this.type.z6ds){
      let arr = []
      let flag = false
      _.each(m0, item => {
        _.each(m1, item2 => {
          _.each(m2,item3=>{
            let param = {
              data: {
                m0: item,
                m1: item2,
                m2: item3,
              },
              zhushu: 1,
              type: type,
              zigou: true
            }
            if (index) {
              param.index = 'z6ds_pop_' + index
              index += 1
            } else {
              flag = true
              param.index = length + 1;
              length += 1
            }
            arr.push(param)
          })

        })
      })
      this.props.receive(arr, 'z6ds', flag, this.state.active, ind)
    } else {
      let param = {
        data: {
          m0,
          m1,
          m2,
        },
        zhushu: zhushu,
        type: type,
        zigou: true
      }
      let flag = false
      if (index) {
        param.index = index
      } else {
        flag = true
        param.index = length + 1
      }
      this.props.receive(param, 'zx', flag, this.state.active,)
    }

  }

  switchType(key) {
    this.setState({
      active: key
    })
  }
  menuPop(flag) {
    this.setState({
      menuShow: flag,
    });
  }

  clickWF(key) {
    this.setState({
      active:key,
      menuShow:false
    },()=>{
      let url = utils.setUrlHash('active', key)
      hashHistory.replace(url)
    })
  }
  render() {
    let {menuShow,active} = this.state
    let {children} = this.props;
    let content, content1;
    if (children) {
      content = children
    }
    content1 =
      <div id="lotteryBetting" tabIndex="0">
        <NavBar className="myNav"
                mode="dark"
                iconName="cross"
                onLeftClick={() => {
                  this.props.setShowType(2)
                }}
                rightContent={<div onClick={() => hashHistory.push('/index')} className="home"/>}
                style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
        >{this.data.name}</NavBar>
        <div className={sessionStorage.getItem("headFlag")?"Newarrow1":"Newarrow"} onClick={()=>this.menuPop(true)}><span/></div>
        {/*Newarrow有头部 Newarrow1没有头部*/}
        {menuShow ? <DownComt active={active} clickWF={this.clickWF} menuPop={this.menuPop} tabsData={this.tabsData}/> : null}
        {menuShow ? <div className="menu-mask" onClick={()=>this.menuPop(false)}/> : null}
        <Tabs pageSize="3" activeKey={this.state.active} onTabClick={this.switchType} swipeable={false}
              animated={false}>
          <TabPane tab={"直选"} key="1">
            {
              this.state.active === '1' &&
              <ZX
                type={this.data.type}
                pid={this.state.pid}
                atime={this.state.atime}
                yilou={this.state.yilou}
                lishi={this.state.lishi}
                listHeight={this.state.listHeight}
                currentChoose={this.props.currentChoose}
                jxNum={this.jxNum}
                doNext={this.doNext}
                creatOne={this.creatOne}
              />
            }
          </TabPane>
          <TabPane tab={"直选和值"} key="2">
            {
              this.state.active === '2' &&
              <HZ
                type={this.data.type}
                pid={this.state.pid}
                atime={this.state.atime}
                yilou={this.state.yilou}
                lishi={this.state.lishi}
                listHeight={this.state.listHeight}
                currentChoose={this.props.currentChoose}
                jxNum={this.jxNum}
                doNext={this.doNext}
                creatOne={this.creatOne}
              />
            }
          </TabPane>
          <TabPane tab={"组三单式"} key="3">
            {
              this.state.active === '3' &&
              <Z3DS
                type={this.data.type}
                pid={this.state.pid}
                atime={this.state.atime}
                yilou={this.state.yilou}
                lishi={this.state.lishi}
                listHeight={this.state.listHeight}
                currentChoose={this.props.currentChoose}
                jxNum={this.jxNum}
                doNext={this.doNext}
                creatOne={this.creatOne}
              />
            }
          </TabPane>
          <TabPane tab={"组三复式"} key="4">
            {
              this.state.active === '4' &&
              <Z3FS
                type={this.data.type}
                pid={this.state.pid}
                atime={this.state.atime}
                yilou={this.state.yilou}
                lishi={this.state.lishi}
                listHeight={this.state.listHeight}
                currentChoose={this.props.currentChoose}
                jxNum={this.jxNum}
                doNext={this.doNext}
                creatOne={this.creatOne}
              />
            }
          </TabPane>
          <TabPane tab={"组六单式"} key="5">
            {
              this.state.active === '5' &&
              <Z6DS
                type={this.data.type}
                pid={this.state.pid}
                atime={this.state.atime}
                yilou={this.state.yilou}
                lishi={this.state.lishi}
                listHeight={this.state.listHeight}
                currentChoose={this.props.currentChoose}
                jxNum={this.jxNum}
                doNext={this.doNext}
                creatOne={this.creatOne}
              />
            }
          </TabPane>
          <TabPane tab={"组六复式"} key="6">
            {
              this.state.active === '6' &&
              <Z6FS
                type={this.data.type}
                pid={this.state.pid}
                atime={this.state.atime}
                yilou={this.state.yilou}
                lishi={this.state.lishi}
                listHeight={this.state.listHeight}
                currentChoose={this.props.currentChoose}
                jxNum={this.jxNum}
                doNext={this.doNext}
                creatOne={this.creatOne}
              />
            }
          </TabPane>
        </Tabs>
      </div>


    return (
      <div>
        {children && content}
        <div style={{display: children ? 'none' : ''}}>
          {content1}
        </div>
      </div>
    )
  }
}

export default IndexChild
