/**/

const order = {
  path: 'order',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/order.js').default)
    })
  }
}
const useRed = {
  path: 'useRed',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/LotteryBetting/useRed.js').default)
    })
  }
}

const linkPage = {
  path: 'linkPage',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/CommonComts/LinkPage.js').default)
    })
  }
}
const loginChild1 = {
  path: 'login',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Login/index.js').default)
    })
  }
}
const loginChild2 = {
  path: 'loginChild',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Login/Login.js').default)
    })
  }
}
const editMobile = {
  path: 'editMobile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/EditMobile').default)
    })
  }
}
const editIdCard = {
  path: 'editIdCard',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/EditIdCard').default)
    })
  }
}
const wanfa = {
  path: 'wanfa',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/wanFa/index').default)
    })
  }
}
const zst = {
  path: 'zst',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/zoushitu/index').default)
    })
  }
}
export default [order,useRed,linkPage,loginChild1,loginChild2,editMobile,editIdCard,wanfa,zst]

