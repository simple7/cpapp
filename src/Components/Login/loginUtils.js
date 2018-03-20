import utils from '../../common/utils'
import {Toast} from 'antd-mobile'

export const phoneCheck = phone => {
  let value = phone.value.replace(/\D/g, '')
  if (phone.value.trim() === '') {
    Toast.info('请输入手机号！', 1, () => {
      phone.value = '';
      phone.focus();
    }, false)

    return false
  } else if (!utils.checkPhone(value)) {
    Toast.info('手机号格式有误！', 1, () => {
      phone.focus();
    }, false)
    return false
  } else {
    return true
  }
}

export const userPassCheck = (userName, password) => {
  var len = password.length;
  var re = /^[\da-zA-Z\u4E00-\u9FA5]{4,16}$/;
  var cs = /^[\d]{7,}$/;
  var cat = /^[\x20-\x7f]+$/;
  var pw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/g;
  if (userName == "" && len == 0) {
    Toast.info('请输入用户名和密码', 1,null,false);
    return false;
  } else if (userName == "") {
    Toast.info('请输入用户名', 1,null,false);
    return false;
  } else if (len == 0) {
    Toast.info("请输入密码", 1,null,false);
    return false;
  } else if (!(re.test(userName))) {
    Toast.info('用户名不符合规则，用户名需为4-16位（支持数字、字母、汉字及其组合）', 2,null,false);
    return false;
  } else if (cs.test(userName)) {
    Toast.info('不允许包含6个以上（不包括6个）的连续数字', 2,null,false);
    return false;
  } else if (len < 6) {
    Toast.info('您输入的密码不能低于6位', 1.5,null,false);
    return false;
  } else if (len > 20) {
    Toast.info('您输入的密码不能超过20位', 1.5,null,false);
    return false;
  } else if (password === userName) {
    Toast.info('密码不能够与用户名一致！请重新输入', 2,null,false);
    return false;
  } else if (!(pw.test(password))) {
    Toast.info('为保证账户安全，密码需为6-20位数字和字母的组合', 2,null,false);
    return false;
  } else {
    return true
  }
}

export const saveUserName = value => {
  let local = localStorage.getItem('userName');
  if (local) {
    let userArr = JSON.parse(local)
    if (userArr.indexOf(value) !== -1) {
      userArr = userArr.slice(0, userArr.indexOf(value)).concat(userArr.slice(userArr.indexOf(value) + 1))
    }
    userArr.unshift(value);
    userArr = userArr.slice(0,5);
    localStorage.setItem('userName', JSON.stringify(userArr));
  } else {
    let arr = [value]
    localStorage.setItem('userName', JSON.stringify(arr))
  }
}
