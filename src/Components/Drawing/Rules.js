'use strict'
import React, {Component} from 'react'

import '../../Style/Drawing/drawRules.css'

import CommonNavBar from '../CommonComts/CommonNavBar'
class BankAdd extends Component {

  render() {
    return (
      <div id="drawRules">
        <CommonNavBar title="提款规则" />
        <table className="paytime_table" cellSpacing="0" cellPadding="0">
          <tbody>
          <tr>
            <th width="28%" className="t">银行</th>
            <th width="72%" className="t">提款到账时间</th>
          </tr>
          <tr>
            <td>工商银行</td>
            <td rowSpan="2">21:00之前申请的提款，当天到账，最快2小时；<br/>21:00之后申请的提款，第二天到账</td>
          </tr>
          <tr>
            <td>招商银行</td>
          </tr>
          <tr>
            <td>交通银行</td>
            <td>18:00之前申请的提款，当天到账，最快4小时;<br/>18:00之后申请的提款，第二天到账</td>
          </tr>
          <tr>
            <td>建设银行</td>
            <td rowSpan="2">18:00之前申请的提款，当天到账，最快2小时；<br/>18:00之后申请的提款，第二天到账</td>
          </tr>
          <tr>
            <td>农业银行</td>
          </tr>
          <tr>
            <td>光大银行</td>
            <td rowSpan="6">17:00之前申请的提款，当天到账；<br/>17:00之后申请的提款，第二天到账</td>
          </tr>
          <tr>
            <td>民生银行</td>
          </tr>
          <tr>
            <td>兴业银行</td>
          </tr>
          <tr>
            <td>中信银行</td>
          </tr>
          <tr>
            <td>浦发银行</td>
          </tr>
          <tr>
            <td>平安银行</td>
          </tr>
          <tr>
            <td>中国银行</td>
            <td>16:00之前申请的提款，当天到账；<br/>16:00之后申请的提款，第二天到账</td>
          </tr>
          <tr>
            <td>广发银行</td>
            <td rowSpan="2">17:30之前申请的提款，第二天到账；<br/>17:30之后申请的提款，第三天到账</td>
          </tr>
          <tr>
            <td>华夏银行</td>
          </tr>
          <tr>
            <td style={{height:'5rem'}}>邮储银行</td>
            <td>工作日12:00之前申请的提款，当天会处理；其他时间申请的提款，下个工作日到账</td>
          </tr>
          <tr>
            <td style={{height:'5rem'}}>其他银行</td>
            <td>21：00之前申请的提款，当天会处理；<br/>21：00之后申请的提款，第二天会处理；具体到账时间视银行系统繁忙程度
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <span style={{color:'#ff3300'}}>注意：</span>
              <p> 1、以上到账时间仅供参考，银行系统维护、节假日到账时间稍有延后，具体以银行到账时间为准。</p>
              <p>2、提款不收取手续费，每次最少提款10元，为防止恶意提现，每日提款次数最多3次(提款处理中与提款成功次数之和)。</p>
              <p>3、为了防止套现和洗钱，借记卡单笔充值后需消费充值金额50%后才能提现；微信、支付宝及信用卡充值本金需100%消费。奖金可随时申请提款。</p>
              <p>4、周一至周日09:00-21:00的提款申请当天处理，21:00以后的提款申请延至第二天处理(法定假日处理时间另行公示)。到账时间为1~3个银行工作日，3个工作日还未到账，请联系客服。</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default BankAdd
