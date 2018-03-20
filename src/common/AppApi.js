/**
 * Created by pc on 2017/7/11.
 */
import utils from './utils'
import {authorizeToCL} from '../Stubs/API'
import commonConfig from '../config/commonConfig'
import {Toast} from 'antd-mobile'

/* 判断设备 */
export const browser = {
  versions: function () {
    var u = navigator.userAgent, app = navigator.appVersion;
    return {
      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 || u.indexOf('Linux') > -1, //android终端
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1, //是否web程序，没有头部与底部
      _weixin: u.toLowerCase().indexOf("micromessenger") > -1,// 微信
      qq: u.match(/\sQQ/i) == " qq" //是否QQ
    };
  }(),
}

/* 调用app中的方法 */
export const AppJiek = {
  appLogin: function () {//原生登录接口
    if (browser.versions.android) {//登录调用原生接口
      window.caiyiandroid.clickAndroid(3, '');
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('clickIosLogin');
    }
  },
  moBind: function () {
    if (browser.versions.android) {//绑定手机号调用原生接口
      window.caiyiandroid.clickAndroid(5, '');
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('callBackIOS', '1');
    }
  },
  cardBind: function () {
    if (browser.versions.android) {//绑定身份证调用原生接口
      window.caiyiandroid.clickAndroid(6, '');
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('callBackIOS', '2');
    }
  },
  ChargeMoney: function () {// 充值
    if (browser.versions.android) {
      window.caiyiandroid.clickAndroid(7, '');
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('callBackIOS', '3');
    }
  },
  TurnGo: function (name, url) { //地址跳转
    if (browser.versions.android) {
      window.caiyiandroid.callback_03(name, url);
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('callback_03', url);
    }
  },
  BandBind: function () { //银行卡
    if (browser.versions.android) {
      window.caiyiandroid.callback_05('');
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('callback_05');
    }

  },
  GoIndexApp: function () { //去首页
    if (browser.versions.android) {
      window.caiyiandroid.callback_06('');
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('callback_06');
    }
  },
  AppTitle: function (title) { //向app传递title
    if (browser.versions.android) {
      window.caiyiandroid.callback_07(title);
    }
    if (browser.versions.ios) {
      WebViewJavascriptBridge.callHandler('callback_07', title);
    }
  },
  CheckApp: function () {
    if (browser.versions.android) {
      if (window.caiyiandroid) {
        return true;
      } else {
        return false;
      }
    }
    if (browser.versions.ios) { //检查是否为app打开页面
      try {
        WebViewJavascriptBridge.callHandler();
        return true;
      } catch (e) {
        return false;
      }
    }
  },
  /*开启app*/
  OpenAppJudge(e) {
    const et = e.target;
    const config = {
      android: 'caiyi://mobilelottery/app',
      ios: 'caiyi9188Lotterynomal://',
      href: 'https://t.9188.com'
    };
    if (browser.versions._weixin) {
      if (AppJiek.WeiXinAppOpenTip()) return false;
    }
    if (browser.versions.android) {
      et.href = config.android;
    } else if (browser.versions.ios) {
      et.href = config.ios;
    }
    setTimeout(function () {
      location.href = config.href;
    }, 2000);
  },
  /*微信下点击开启app 显示遮罩*/
  WeiXinAppOpenTip() {
    let downloadDivId = document.getElementById('downloadDiv');
    if (!downloadDivId) {
      let _d = document;
      let _b = _d.body;
      let downloadDiv = _d.createElement("div");
      downloadDiv.setAttribute("id", "downloadDiv");
      if (browser.versions.android) {
        downloadDiv.setAttribute('class', "download_android");
      } else if (browser.versions.ios) {
        downloadDiv.setAttribute('class', "download_ios");
      }
      _b.appendChild(downloadDiv);
      downloadDivId = document.getElementById('downloadDiv');
      utils.CancelEvent();
      downloadDivId.onclick = () => {
        document.body.removeChild(document.getElementById('downloadDiv'))
        utils.RemovEvent();
      };
      return true;
    }
  },
  hideDownload() {
    try {
      document.body.removeChild(document.getElementById('downloadDiv'))
    } catch (err) {
      console.log(err);
    }
    return;
  },
  /* 第三方app登录检测
   * (先检查登录,若未登录, 检查渠道是否为第三方,如果是走第三方授权登录，否者走fn)
   * fn (function) 回调函数
   * isLogin (boolean) 是否登录 可以为空
   * */
  async thirdAppLoginCheck(fn, isflag) {
    const agent = localStorage.getItem('agent');
    let flag = false;
    if (typeof isflag == 'boolean') {
      flag = isflag;
    } else {
      flag = await utils.checkLogin();
    }
    if (commonConfig.source.chelun == agent && !flag) {
      ChelunApp.chelunApp(isflag);
    } else if (typeof fn == 'function') {
      fn()
    }
    return false;
  }
};

/* 车轮App接口 */
export const ChelunApp = {
  /* 车轮appid */
  chelunappid: 'dde7338db65d796eece576f5e69c5194',

  /* 判断是否需要刷新当前页面 */
  isflag: '',

  /* 获取车轮 openID */
  chelunopenID() {
    chelunJSBridge.loginByChelun(ChelunApp.chelunappid, (res) => {
      if (res.coed == 1) {
        return res.data
      } else {
        alert(res.message)
      }
    })
  },

  /* 获取车轮 accessToken */
  chelunaccessToken() {
    chelunJSBridge.invoke(ChelunApp.chelunappid, (res) => {
      if (res.code == 1) {
        ChelunApp.sendOpenid_Token(res.data);
      }
    })
  },

  /* 向后端发送车轮 openid & Token  */
  sendOpenid_Token(data) {
    let params = {};
    const appid = data.openID;
    const accesstoken = data.accessToken
    const stime = new Date().getTime()
    const signmsg = `appid=${appid}&accesstoken=${accesstoken}&stime=${stime}`
    const source = localStorage.getItem('agent');
    params.appid = appid;
    params.accesstoken = accesstoken;
    params.stime = stime;
    params.signmsg = utils.aesEnCode(signmsg);
    params.source = source;
    authorizeToCL(params).then((res) => {
      if (res.code == '0') {
        if(typeof ChelunApp.isflag == 'boolean' && !ChelunApp.isflag){
          location.reload();
        }
      } else {
        Toast.info(res.desc, 2, null, false)
      }
    })
  },

  /* 第三方车轮中是否登录 */
  chelunApp(flag){
    ChelunApp.isflag = '';
    try {
      chelunJSBridge.isLogin((res) => {
        if(typeof flag != 'boolean') ChelunApp.isflag = false;
        if (res.code == 1) {
          ChelunApp.chelunaccessToken()
        } else if (res.code == -1) {
          chelunJSBridge.toLogin((res) => {
            if (res.code == 1) {
              ChelunApp.chelunaccessToken()
            } else if (res.code == -1) {
            }
          })
        }
      })
    } catch (e) {
      console.log(e);
      return false;
    }
  }
};
