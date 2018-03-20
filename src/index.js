import React, {Component} from 'react'
import {render} from 'react-dom'

import {Router, Route, browserHistory, hashHistory} from 'react-router'
import RouteConfig from './Route/Route'
import axios from 'axios';
import './Stubs/API'
import './Style/common.css'
import {Provider} from 'react-redux';
import store from './reducer/reducer'
import commonConfig from './config/commonConfig'
import {browser} from './common/AppApi'

//token允许跨域执行
axios.defaults.withCredentials = true;

function GetUrlParam(paraName) {
  let url = document.location.toString();
  let secIndex = url.indexOf('#')
  let objStr = url.substring(url.indexOf('?') + 1, secIndex);
  console.log(objStr)
  if (objStr.length > 1) {
    let arrPara = objStr.split("&");
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
  }
  return "";
}

function CreateScriptEl(url){
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);
  return;
}

let agent = GetUrlParam('agent') || '3002'
localStorage.setItem('agent', agent)
//具体参数对应含义参照commonConfig.js
if (sessionStorage.getItem('headFlag') === null) {
  let flag = GetUrlParam('flag') || '0';
  if (browser.versions._weixin) {
    flag = '1';
  }
  //出现头部广告框的时候
  if (flag === '0' || flag === '1' || flag === '3' || flag === '6') {
    sessionStorage.setItem('footState', '1')
  }
  let {headFlag, homePop, homeLogo} = commonConfig.switchFlag[flag]
  sessionStorage.setItem('headFlag', headFlag)
  sessionStorage.setItem('homePop', homePop)
  sessionStorage.setItem('homeLogo', homeLogo)
}
if(agent != commonConfig.source.default){
  if(agent == commonConfig.source.chelun){
    CreateScriptEl(commonConfig.JSSDKUrl['chelun']);
  }
}

render((
  <Provider store={store}>
    <Router
      history={hashHistory}
      routes={RouteConfig}
    ></Router>
  </Provider>
), document.getElementById('app'))
