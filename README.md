## 2017彩票项目重构 ByReact


>5.9188.com


## Build Setup

``` bash
	# install dependencies
	npm install

	# 配置nginx
	start nginx

	# 打包项目到__build__目录
  npm run dev

	# server with hot reload at localhost:3000
	npm run start

	# build for production with minification
	npm run build
```

## UI视图 默认样式


## <a id='a'>默认无数据状态<a>

 无数据的默认状态 ,样式为全局样式 ,html结构如下:

```html
<div className="emptyRedBox">
  <p>客官，暂无数据哟~</p>
</div>
```

如下图:
![默认样式图片](http://gitlab.gs.9188.com/caiyi.html5/Lottery/raw/b5aacc4acd2e2109c77c3654fac073108c54f6da/Lottery-2017/UI_DefaultStyleImg/DefaultNoDateStyle.png)


## 参数说明

### 新版链接：https://5.9188.com/new/?agent=3033&flag=5#/

注意?拼接位置

- agent：渠道号
- flag：需要头部标识
