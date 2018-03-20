export const bankCard = {
    path: 'bankCard',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/recharge/BankCard.js').default)
        })
    }
}
export const bankAdd = {
    path: 'addBank',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/recharge/AddBank.js').default)
        })
    }
}
export const cardManageIndex = {
  path: 'cardManageIndex',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/recharge/cardManageIndex.js').default)
    })
  }
}
export const rechageConfirm = {
  path: 'rechageConfirm',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/recharge/ConfirmRecharge.js').default)
    })
  }
}
export const creditInfo = {
  path: 'creditInfo',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/recharge/CreditInfo.js').default)
    })
  }
}
export const result = {
    path: 'result',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/recharge/Result.js').default)
        })
    }
}
export const cardManage = {
    path: 'cardManage',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/recharge/cardManage.js').default)
        })
    }
}
