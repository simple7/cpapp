const editMobile = {
  path: 'editMobile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/EditMobile.js').default)
    })
  }
}
const mobileResult = {
  path: 'mobileResult',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/MobileResult.js').default)
    })
  }
}
const editIdCard = {
  path: 'editIdCard',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/EditIdCard.js').default)
    })
  }
}
const idCardResult = {
  path: 'idCardResult',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/IdCardResult.js').default)
    })
  }
}
const editPassword = {
  path: 'editPassword',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/EditPassword.js').default)
    })
  }
}
const replaceMobile = {
  path: 'replaceMobile',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/AccountSafe/replaceMobile.js').default)
    })
  }
}
const SetPassword = {
  path: 'SetPassword',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/CommonComts/SetNewPwd').default)
    })
  }
}
export default [editMobile,mobileResult,editIdCard,idCardResult,editPassword,replaceMobile,SetPassword]
