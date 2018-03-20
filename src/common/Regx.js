import {Toast} from 'antd-mobile'

let Regx = {

  /*********身份证校验*****/

  /*省,直辖市代码表*/
  provinceAndCitys: {
    11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江",
    31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东",
    45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏",
    65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
  },


  /*每位加权因子*/
  powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],

  /*第18位校检码*/
  parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],
  /*性别*/
  genders: {male: "男", female: "女"},

  /*校验15位或18位的身份证号码
  * params {idCardNo} 号码
  * */
  checkIdCardNo: function (idCardNo) {
    //15位和18位身份证号码的基本校验
    var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
    if (!check) return false;
    //判断长度为15位或18位
    if (idCardNo.length == 15) {
      return check15IdCardNo(idCardNo);
    } else if (idCardNo.length == 18) {
      return check18IdCardNo(idCardNo);
    } else {
      return false;
    }

    //校验15位的身份证号码
    function check15IdCardNo(idCardNo) {
      //15位身份证号码的基本校验
      var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
      if (!check) return false;
      //校验地址码
      var addressCode = idCardNo.substring(0, 6);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      var birDayCode = '19' + idCardNo.substring(6, 12);
      //校验日期码
      return checkBirthDayCode(birDayCode);
    }

    //校验18位的身份证号码
    function check18IdCardNo(idCardNo) {
      //18位身份证号码的基本格式校验
      var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
      if (!check) return false;
      //校验地址码
      var addressCode = idCardNo.substring(0, 6);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      //校验日期码
      var birDayCode = idCardNo.substring(6, 14);
      check = checkBirthDayCode(birDayCode);
      if (!check) return false;
      //验证校检码
      return checkParityBit(idCardNo);
    }

    /*校验地址码*/
    function checkAddressCode(addressCode) {
      var check = /^[1-9]\d{5}$/.test(addressCode);
      if (!check) return false;
      if (Regx.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
        return true;
      } else {
        return false;
      }
    }

    /*校验日期码*/
    function checkBirthDayCode(birDayCode) {
      var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
      if (!check) return false;
      var yyyy = parseInt(birDayCode.substring(0, 4), 10);
      var mm = parseInt(birDayCode.substring(4, 6), 10);
      var dd = parseInt(birDayCode.substring(6), 10);
      var xdata = new Date(yyyy, mm - 1, dd);
      if (xdata > new Date()) {
        return false;//生日不能大于当前日期
      } else if (( xdata.getFullYear() == yyyy ) && ( xdata.getMonth() == mm - 1 ) && ( xdata.getDate() == dd )) {
        return true;
      } else {
        return false;
      }
    }

    /*验证校检码*/
    function checkParityBit(idCardNo) {
      var parityBit = idCardNo.charAt(17).toUpperCase();
      if (getParityBit(idCardNo) == parityBit) {
        return true;
      } else {
        return false;
      }
    }

    /*计算校检码*/
    function getParityBit(idCardNo) {
      var id17 = idCardNo.substring(0, 17);
      /*加权 */
      var power = 0;
      for (var i = 0; i < 17; i++) {
        power += parseInt(id17.charAt(i), 10) * parseInt(Regx.powers[i]);
      }
      /*取模*/
      var mod = power % 11;
      return Regx.parityBit[mod];
    }

    function formateDateCN(day) {
      var yyyy = day.substring(0, 4);
      var mm = day.substring(4, 6);
      var dd = day.substring(6);
      return yyyy + '-' + mm + '-' + dd;
    }
  },

  /***********身份证校验结束************/

  /**
   * 姓名校验
   * @param name 名称
   * @returns {boolean}
   */
  checkName(name) {
    if (/^[\u4E00-\u9FA5|·•●.。]+$/.test(name))
      return true;
    else
      return false
  },
  /**
   * 手机号校验
   * @param phone
   * @param ref  input对象
   * @param flag 不传则用默认toast
   * @param text 不传则用默认toast
   * @returns {boolean}
   */
  checkIsPhone(phone,ref, flag, text, text2) {
    if (phone.trim() === '') {
      if (!flag) {
        Toast.info('请输入手机号！', 1, () => {
        }, false)
      } else {
        Toast.info(text, 1, () => {
        }, false)
      }
      ref.focus()
      return false
    } else if (!(/^1[34578]\d{9}$/).test(phone)) {
      if (!flag) {
        Toast.info('手机号格式有误！', 1, () => {
        }, false)
      } else {
        Toast.info(text2, 1, () => {
        }, false)
      }
      ref.focus()
      return false
    } else {
      return true
    }
  },
  checkPassword(password,ref,userName){
   let pw = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/g;
   let len = password.length
    if (len < 6) {
      Toast.info('您输入的密码不能低于6位', 1,null,false);
      ref.focus()
      return false;
    } else if (len > 20) {
      Toast.info('您输入的密码不能超过20位', 1,null,false);
      ref.focus()
      return false;
    } else if (password === userName) {
      Toast.info('密码不能够与用户名一致！请重新输入', 1,null,false);
      ref.focus()
      return false;
    } else if (!(pw.test(password))) {
      Toast.info('密码为6-20的字母、数字组合', 1,null,false);
      ref.focus()
      return false;
    } else {
      return true
    }
  }
}

export default Regx
