import React, {Component} from 'react'
import CommonNavBar from "../../CommonComts/CommonNavBar";
import {hashHistory} from 'react-router'
import {appgonggaolist} from '../../../Stubs/API'
import utils from '../../../common/utils'
import moment from 'moment';
import commonConfig from '../../../config/commonConfig'
import '../../../Style/Find/notice/notice.less'

class GongGao extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      listHeight:'',
      appgonggaolist: []
    }
  }

  componentWillMount() {
    appgonggaolist().then(result => {
      if (result.code === '0') {
        let row = result.row
        if (utils.checkIsArr(row)) {
          this.setState({
            appgonggaolist: row
          })
        } else {
          this.setState({
            appgonggaolist: [row]
          })
        }
      }
    })
  }
  componentDidMount() {
    console.log(123);
    let h = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    this.setState({
      listHeight:(h - 74) + 'px'
    })
  }

  render() {
    let {children} = this.props;
    let content;
    if (children) {
      content = children
    } else {
      content =
        <div id="noticeList">
          <CommonNavBar style={{height: '44px'}} title="系统公告"/>
          <div className="list_div" ref="list_div" style={{height:this.state.listHeight}}>
            {this.state.appgonggaolist.map((item, index) => {
              return (
                <a className="child"
                   key={index}
                   onClick={() => {
                     hashHistory.push({
                       pathname: '/noticeList/noticePage',
                       query: {
                         url: commonConfig.mobileDomain + item.arcurl,
                         title: '系统公告'
                       }
                     })
                   }}
                >
                  <span className="left_span">{item.ntitle}</span>
                  <span className="right_span">{moment(parseInt(item.ndate) * 1000).format('MM-DD')}</span>
                </a>
              )

            })}
          </div>
        </div>
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}

export default GongGao
