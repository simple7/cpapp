const pxtorem = require('postcss-pxtorem');

module.exports = {
    plugins: [
        require('autoprefixer')({}),
        pxtorem({
            rootValue: 57.0,
            propWhiteList: []
        })
    ]
}