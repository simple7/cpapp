const recharge = {
  gateway: {
    sft: {
      jjk: '4004', //盛付通借记卡
      xyk: '4005'  //盛付通信用卡
    },
    jdzf: {
      jjk: '5005',
      xyk: '5008'
    },
    ldys: {
      jjk: '8002',
      xyk: '8005'
    },
  },
  recType: {
    sft: '7',
    alipay: '18',
    weixin: '19',
    qq: '25',
    jdzf: '23',
    ldys: '26',
    '7': 'sft',
    '18': 'alipay',
    '19': 'weixin',
    '25': 'qq',
    '23': 'jdzf',
    '26': 'ldys'
  },
  id: {
    '4': 'new',
    '2': 'alipay',
    '3': 'weixin',
    '20': 'qq',
    '7': 'sft',
    '13': 'ldys',
    '12': 'jdzf',
    '6': 'jdzf',
    '8': 'ldys'
  }
}
export default recharge
