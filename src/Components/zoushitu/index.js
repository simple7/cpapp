'use strict'
import React, {Component} from 'react'
import "../../Style/lotteryBetting/zoushitu.less"
import CommonNavBar from '../CommonComts/CommonNavBar'
import utils from '../../common/utils'
import Xuan11x5 from './11xuan5'
import Fucai3D from './fucai3d'
import Kuai3 from './kuai3'
import Pailie5 from './pailie5'
import Shuangseqiu from './shuangseqiu'
import lotteryInfo from '../../config/lotteryInfo'

export default class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      listHeight: '',
      type: ''
    }
    this.rule = {
      ssq: <Shuangseqiu type='ssq' />,
      x11x5: <Xuan11x5 type='x11x5'/>,
      y11x5: <Xuan11x5 type='y11x5'/>,
      dlt: <Shuangseqiu type='dlt'/>,
      fc3d: <Fucai3D type='fc3d'/>,
      pl3: <Fucai3D type='pl3'/>,
      k3: <Kuai3 type='k3'/>,
      pl5: <Pailie5 type='pl5'/>
    }
  }

  componentWillMount() {
    let query = this.props.location.query || {}
    this.setState({
      type: query.type || 'ssq'
    })
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  render() {
    let {type} = this.state
    return (
      <div>
        <CommonNavBar
          title={lotteryInfo.lot(lotteryInfo.zstLottery[type])+'走势图'}
        />
        <div className="listDivView" style={{height: this.state.listHeight}}>
          {this.rule[type]}
        </div>
      </div>
    )
  }
}
