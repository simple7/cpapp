const redExplain = {
  path: 'redExplain',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/RedPackage/RedExplain.js').default)
    })
  }
}

const redExchange = {
  path: 'redExchange',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/RedPackage/RedExchange.js').default)
    })
  }
}
const redUse = {
  path: 'redUse',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('../Components/RedPackage/RedUse.js').default)
    })
  }
}

export default [redExplain,redExchange,redUse]

