'use strict'
import React, {Component} from 'react'
import WanFa11X5 from './11x5'
import WanFaDLT from './dlt'
import WanFaFC3D from './fc3D'
import WanFaP3 from './p3'
import WanFaP5 from './p5'
import WanFaQLC from './qlc'
import WanFaQXC from './qxc'
import WanFaSSC from './ssc'
import WanFaSSQ from './ssq'
import WanFaYue11x5 from './yue11x5'
import CommonNavBar from '../CommonComts/CommonNavBar'
import utils from '../../common/utils'

export default class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      type: this.props.location.query.type || 'ssq',
      flag: this.props.location.query.flag || '1',
      listHeight: ''
    }
    this.rule = {
      ssq: <WanFaSSQ/>,
      dlt: <WanFaDLT/>,
      qlc: <WanFaQLC/>,
      qxc: <WanFaQXC/>,
      pl5: <WanFaP5/>,
      fc3d: <WanFaFC3D/>,
      pl3: <WanFaP3/>,
      ssc: <WanFaSSC/>,
      x11x5: <WanFa11X5/>,
      y11x5: <WanFaYue11x5/>,
    }
  }

  componentDidMount() {
    this.setState({
      listHeight: utils.setHeight()
    })
  }

  render() {
    let {type, flag} = this.state
    return (
      <div>
        <CommonNavBar
          title={flag === '1' ? '玩法说明' : '奖金对照'}
        />
        <div className="listDivView" style={{height: this.state.listHeight}}>
          {this.rule[type]}
        </div>
      </div>
    )
  }
}
