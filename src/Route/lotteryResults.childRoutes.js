//高频彩
export const kuai3 = {
  path: 'k3',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/gaopincai/k3.js').default)
    })
  }
}
export const yunduojin11 = {
  path: '11x5',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/gaopincai/11x5.js').default)
    })
  }
}
//竞技彩
export const lanqiu = {
  path: 'jclq',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/jingjicai/jingcailanqiu.js').default)
    })
  }
}
export const zuqiuJingcai = {
  path: 'jczq',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/jingjicai/jingcaizuqiu.js').default)
    })
  }
}
export const zuqiuDanchang = {
  path: 'zqdc',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/jingjicai/zuqiudanchang.js').default)
    })
  }
}
export const shengfucai = {
  path: 'sfc',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/jingjicai/shengfucai.js').default)
    })
  }
}
export const shengfucaiAll = {
  path: 'sfcList',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/jingjicai/shengfucaiAll.js').default)
    })
  }
}
export const shengfuGuoGuan = {
  path: 'sfgg',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/jingjicai/shengfuguoguan.js').default)
    })
  }
}
//数字彩
export const ssq = {
  path: 'ssq',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/shuzicai/ssq.js').default)
    })
  }
}
export const ssqAll = {
  path: 'ssqList',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/shuzicai/ssqAll.js').default)
    })
  }
}
export const fucai3D = {
  path: 'fc3d',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/shuzicai/fucai3D.js').default)
    })
  }
}
export const fucai3DAll = {
  path: 'fc3dList',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Find/shuzicai/fucai3DAll.js').default)
    })
  }
}

export default [kuai3, yunduojin11, lanqiu, zuqiuJingcai, zuqiuDanchang, shengfucai, shengfucaiAll,
  ssq, ssqAll, fucai3D, fucai3DAll, shengfuGuoGuan]
