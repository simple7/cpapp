'use strict'
import React, {Component} from 'react'
import {zst} from '../../Stubs/API'
import lotteryInfo from '../../config/lotteryInfo'
import CommonFilter from './commonFilter'
import _ from 'lodash'
import Table from 'rc-table';
import utils from '../../common/utils'
import 'rc-table/assets/index.css';
import "../../Style/lotteryBetting/zst.less"


class Shuangseqiu extends Component {
  constructor() {
    super(...arguments);
    this.tableConfig = {
      childWidth: 40
    }
    this.state = {
      listHeight: '',
      currentShow: '',
      pid: 30,
      ylShow: true,
      tjShow: true,
      columns: [{title: '', dataIndex: 'pid', key: 'red_0', className: 'firstCloumn', fixed: 'left'},
      ],
      tableData: [],
      dataList: {}
    }
    this.info = {
      red: 33,
      blue: 16,
    }

    this.gid = ''
    this.getData = this.getData.bind(this)
    this.getSwitch = this.getSwitch.bind(this)
    this.renderData = this.renderData.bind(this)
    this.tjHelp = this.tjHelp.bind(this)
  }


  //传递弹出层设置
  getSwitch(obj) {
    console.log(obj)
    let {qici, yilou, tj} = obj
    this.setState({
      pid: qici,
      ylShow: yilou,
      tjShow: tj,
    },()=>{
        this.getData(this.gid, this.state.pid)
    })
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  componentWillMount() {
    console.log('===', this.props.listHeight)
    let type = this.props.type
    if(type==='dlt'){
      this.info={
        red:35,
        blue:12
      }
    }
    this.gid = lotteryInfo.zstLottery[type]
    this.getData(this.gid, this.state.pid)
    /* this.setState({
       headFlag: sessionStorage.getItem("headFlag"),
     })*/
    let columns = _.cloneDeep(this.state.columns)
    for (let i = 1; i <= this.info.red; i++) {
      let t = ('0' + i).substr(-2)
      columns.push(
        {title: t, dataIndex: 'red_' + i, key: 'red_' + i, className: 'redChild'}
      )
    }
    for (let i = 1; i <= this.info.blue; i++) {
      let t = ('0' + i).substr(-2)
      columns.push(
        {title: t, dataIndex: 'blue_' + i, key: 'blue_' + i, className: 'blueChild'}
      )
    }
    this.setState({
      columns: columns
    })
  }

  getData(gid, pid) {
    zst(gid, pid).then(res => {
      if (res.row) {
        this.setState({
          dataList: res
        }, () => {
          this.renderData()
        })
      }
    })
  }

  renderData() {
    let {ylShow,tjShow} = this.state
    let dataList = _.cloneDeep(this.state.dataList)
    if (dataList.row) {
      let tableData = []
      _.each(dataList.row, (item, index) => {
        let pid = item.pid.substr(-3)
        let red0 = item['red0'].split(',')
        let red1 = item['red1'].split(',')
        let red2 = item['red2'].split(',')
        let blue = item['blue'].split(',')
        let red = _.concat(red0, red1, red2)
        let oneData = {}
        oneData.pid = pid+'期'
        _.each(red, (item1, index1) => {
          let key = 'red_' + (index1 + 1)
          oneData[key] =
            item1 === '0' ?
              <span className="redBall">{('0' + (index1 + 1)).substr(-2)}</span>
              : <span style={{visibility: ylShow ? "" : "hidden"}}>{item1}</span>;
        })
        _.each(blue, (item2, index2) => {
          let key = 'blue_' + (index2 + 1)
          oneData[key] =
            item2 === '0' ? <span className="blueBall">{('0'+(index2+1)).substr(-2)}</span> :
              <span style={{visibility: ylShow ? "" : "hidden"}}>{item2}</span>;
        })
        oneData.key = 'data_child_' + (index + 1)
        tableData.push(oneData)
      })
      if(tjShow){
        //出现次数
        let dis = dataList.dis;
        let dis_data = this.tjHelp(dis, '出现次数','cxcs')
        dis_data.key = 'cxcs'
        tableData.push(dis_data)
        //平均遗漏
        let avg = dataList.avg;
        let avg_data = this.tjHelp(avg, '平均遗漏','pjyl')
        avg_data.key = 'pjyl'
        tableData.push(avg_data)

        //最大遗漏
        let mmv = dataList.mmv;
        let mmv_data = this.tjHelp(mmv, '最大遗漏','zdyl')
        mmv_data.key = 'zdyl'
        tableData.push(mmv_data)

        //最大连出
        let mlv = dataList.mlv;
        let mlv_data = this.tjHelp(mlv, '最大连出','zdlc')
        mlv_data.key = 'zdlc'
        tableData.push(mlv_data)
      }
      this.setState({
        tableData: tableData
      })
    }
  }

  tjHelp(obj, title,className) {
    let red0 = obj['red0'].split(',')
    let red1 = obj['red1'].split(',')
    let red2 = obj['red2'].split(',')
    let blue = obj['blue'].split(',')
    let red = _.concat(red0, red1, red2)
    let data = {
      pid: <span className={className}>{title}</span>
    }
    _.each(red, (item1, index1) => {
      let key = 'red_' + (index1 + 1)
      data[key] = <span className={className}>{item1}</span>;
    })
    _.each(blue, (item2, index2) => {
      let key = 'blue_' + (index2 + 1)
      data[key] = <span className={className}>{item2}</span>;
    })
    return data
  }



  render() {
    let {tjShow, columns, tableData, listHeight} = this.state
    console.log(listHeight)
    return (
      <div className="ssqZst">
        <CommonFilter fun={this.getSwitch}/>
        {
          listHeight && tableData.length > 0 &&
          <Table columns={columns} scroll={{x: 1650, y: listHeight - 40}} data={tableData} style={{width: '100%'}}/>
        }
      </div>
    )
  }
}

export default Shuangseqiu

