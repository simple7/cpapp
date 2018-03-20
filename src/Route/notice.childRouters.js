/**
 * Created by Administrator on 2017/11/15.
 */


const noticePage = {path: 'noticePage',
  getComponent(nextState, cb) {
  require.ensure([], (require) => {
    cb(null, require('../Components/CommonComts/LinkPage.js').default)
  })
}
}

export default [noticePage]
