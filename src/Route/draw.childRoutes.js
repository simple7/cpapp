/* 选择开户银行 */
const bankOpen = {
    path: 'bankOpen',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Drawing/BankOpen.js').default)
        })
    }
}
/* 银行卡提款规则 */
const rules = {
    path: 'rules',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Drawing/Rules.js').default)
        })
    }
}
/* 银行卡信息 提款 */
const bankInfo = {
    path: 'bankInfo',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Drawing/BankInfo.js').default)
        })
    }
}

const bankEdit = {
    path: 'bankEdit',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Drawing/bankEdit.js').default)
        })
    }
}

/* 提款 */
const bankDrawing = {
    path: 'bankDrawing',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Drawing/BankDrawing.js').default)
        })
    }
}
/* 银行卡信息  */
const bankInfo1 = {
    path: 'bankInfo1',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Drawing/BankInfo1.js').default)
        })
    }
}

/* 提款成功页 */
const success = {
  path: 'success',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Drawing/success.js').default)
    })
  }
}

export default [bankOpen, rules, bankInfo, bankInfo1, bankEdit, bankDrawing, success]

/*
/!* 身份证正反面 *!/
const applyCard = {
  path: 'applyCard',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Drawing/applyCard.js').default)
    })
  }
}

/!* 银行卡正面 *!/
const applyCard1 = {
  path: 'applyCard1',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Drawing/applyCard1.js').default)
    })
  }
}
/!* 申请成功页 *!/
const applyCard2 = {
  path: 'applyCard2',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Drawing/applyCard2.js').default)
    })
  }
}

/!* 银行卡信息审核中 *!/
const applyCard3 = {
  path: 'applyCard3',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/Drawing/applyCard3.js').default)
    })
  }
}*/

