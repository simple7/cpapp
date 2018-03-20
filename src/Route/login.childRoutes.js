
export const registerTel = {
    path: 'registerTel',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Login/RegisterTel.js').default)
        })
    }
}

export const registerUser = {
    path: 'registerUser',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Login/RegisterUser.js').default)
        })
    }
}

export const forgetPassword = {
    path: 'forgetPassword',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Login/ForgetPassword.js').default)
        })
    }
}

export const protocol = {
    path: 'protocol',
    getComponent(nextState, cb) {
        require.ensure([], (require) => {
            cb(null, require('../Components/Login/Protocol.js').default)
        })
    }
}
