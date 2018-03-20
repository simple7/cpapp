import React, {Component} from 'react'
import CommonNavBar from '../CommonComts/CommonNavBar'
import utils from '../../common/utils'
import '../../Style/CommonComts/linkPage.less'

class LinkPage extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      url: this.props.location.query.url,
      title: this.props.location.query.title,
      isWhite: this.props.location.query.isWhite,
    }
  }

  componentWillMount() {
    document.title = this.state.title || '9188彩票(触屏版)-竞彩,福利彩票,体育彩票,手机买彩票'
  }

  componentDidMount() {
    let h = document.documentElement ? document.documentElement.clientHeight : document.body.clientHeight;
    console.log(utils.setHeight())
    this.refs['iframe'].style.height = utils.setHeight() + 'px'
    let w = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
    this.refs['iframe'].style.width = w + 'px'
  }

  render() {
    return (
      <div id='link_page'>
        <CommonNavBar isWhite={this.state.isWhite} title={this.state.title}/>
        <div className='ifrDiv' ref="iframe">
          <iframe src={this.state.url} id="iframe" className="iframe" frameBorder="0"/>
        </div>
      </div>
    )

  }
}

export default LinkPage
