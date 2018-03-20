import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Accordion, Flex, Button, List, Toast, Modal, WingBlank} from 'antd-mobile'
import utils from '../../../common/utils'
import moment from 'moment'
import {Link, hashHistory} from 'react-router'
import '../../../Style/Find/tttq/tuiqiu.less'

const Item = List.Item
const Brief = Item.Brief
const alert = Modal.alert;

export default class TuiQiu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateHidden: true,
      last10Days: utils.getLastDays(10, 'YYYY-MM-DD'),
      hasRecommend: true,
      showRecommend: true
    }
    this.handleClickDate = this.handleClickDate.bind(this)
    this.showRecommend = this.showRecommend.bind(this)
  }

  handleClickDate() {
    this.setState({
      dateHidden: !this.state.dateHidden
    })
  }

  showRecommend(){
    this.setState({
      showRecommend: !this.state.showRecommend
    })
  }
  render() {
    const that = this;
    return (
      <div className="tttq">
        <header>
          <div className="header">
            <Link to="/find" className="back"></Link>
            <h1>天天推球</h1>
            <span id="command" onClick={this.handleClickDate} className="choose-date">
            </span>
            <ul id="listDate" hidden={this.state.dateHidden}>
              {
                this.state.last10Days.map((item, index) => {
                  return (
                    <li key={index} id={moment(item).format('YYMMDD')}>{item}</li>
                  )
                })
              }
            </ul>
          </div>
        </header>

        <figure className="fg-noClas">
          <img src={require('../../../Img/Find/tttq/banner.png')} style={{width: '100%'}}/>
        </figure>

        <article hidden={this.state.hasRecommend} className="zwtj">
          <figure>
            <img src={require("../../../Img/Find/tttq/wtj.png")} style={{width: '100%'}}/>
          </figure>
          <span>暂无推荐</span>
          <p>暂时没有比赛可推荐，请稍后再来哦~</p>
        </article>

        <div hidden={!this.state.hasRecommend} id="cont_">
          <article className={this.state.showRecommend?"text textHover":"text"} id="lctj">
            <section className="title">
              <h2>临场推荐</h2>
              <p>近30天推荐30场，命中21场（返奖率108%）</p>
              <span onClick={this.showRecommend}><em></em></span>
            </section>

            <div id="lctjCont" hidden={!this.state.showRecommend}>
                <div className="tz tzHit">
                  <p className="pTitle">周六011&nbsp;08-12 22:00开赛</p>
                  <div className="spfzpk">
                    <span className="cur">
                      <em>埃弗顿<i className="green"></i></em>
                      <cite>胜</cite>
                    </span>
                    <span className="spfvs cur">
                      <em>VS</em>
                      <cite>平</cite>
                    </span>
                    <span>
                      <em>斯托克城</em>
                      <cite>胜</cite>
                    </span>
                  </div>
                  <div className="spfpl">
                    <span>赔率1.60</span>
                    <span className="spfvs">赔率3.35</span>
                    <span>赔率4.85</span>
                  </div>
                </div>
              <p>
                <strong>解析：</strong>
                <br/>
                埃弗顿本赛季流失头号前锋卢卡库，同时迎回在曼联没有位置的鲁尼,且近5轮保持不败状态不俗，且主场作战，此役看好埃弗顿主场取得开门红。
              </p>
            </div>
          </article>
        </div>
      </div>
    )

  }
}
