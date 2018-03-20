import React, {Component} from 'react';
import {Link} from 'react-router'
import {hashHistory} from 'react-router'
import {Modal} from 'antd-mobile'
import utils from '../../common/utils'
import {personal_center_info, loginout} from '../../Stubs/API'
import {List} from 'antd-mobile'
import dengji_icon from "../../Img/defalut_heard.png"
import CommonNavBar from "../CommonComts/CommonNavBar";
import '../../Style/My/My_Center.css'

const Modalalert = Modal.alert;
const Item = List.Item;
const ImgStyle = {
  'position': 'absolute',
  'top': '0.4rem',
  'right': '0.52632rem',
  'display': 'block',
  'width': '2.3rem',
  'height': '2.3rem',
  'borderRadius': '50%',
}
const Img = (props) => {
  console.log(props.url);
  return <img style={ImgStyle} src={props.url ? props.url : dengji_icon}/>
}

class MyCenter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userdata: {
        newuserphoto: dengji_icon,
        ipoint: '0',
        igradeid: '1'
      },
      username: localStorage.getItem('userName') && JSON.parse(localStorage.getItem('userName'))[0]
    }
    this.initialize = this.initialize.bind(this);
    this.goOut = this.goOut.bind(this);
  }

  componentWillMount() {
    this.initialize();
  }

  initialize() {
    personal_center_info('').then((d) => {
      this.setState({
        userdata: d['rows']['row']
      })
    }).catch((e) => {
      console.log(e);
    })
  }

  goOut() {
    const storage = window.localStorage
    for (var i = 0; i < storage.length; i++) {
      var key = storage.key(i);
      if (key != 'userName') {
        localStorage.removeItem(key)
      }
    }
    sessionStorage.clear();
    loginout().then((d) => {
      console.log(d)
      let getCode = d.code;
      hashHistory.push('/my')
    }).catch((e) => {
      console.log(e);
    })
  }

  render() {
    return (
      <div id="MyCenter" className="margin-top-20">
        <CommonNavBar
          title="个人中心"
        />
        <div className="div_37"></div>
        <List>
          <Item activeStyle={{backgroundColor: '#fff'}}
                extra={<Img url={this.state.userdata.newuserphoto}/>}
                style={{height: '3rem'}}
          >头像</Item>
          <Item activeStyle={{backgroundColor: '#fff'}} extra={this.state.username} onClick={() => {
          }}>用户名</Item>
        </List>
        <div className="div_45"></div>
        <List className="ListHeight">
          <Item activeStyle={{backgroundColor: '#fff'}} extra={`V${this.state.userdata.igradeid}`}
          >会员等级</Item>
          <Item activeStyle={{backgroundColor: '#fff'}} extra={parseInt(this.state.userdata.ipoint).toLocaleString()}
          >我的积分</Item>
        </List>
        <div className="div_68"/>
        <List className="ListHeight ListHeight1">
          <Item activeStyle={{backgroundColor: '#fff'}} onClick={this.goOut}>退出</Item>
        </List>
      </div>
    )
  }
}

export default MyCenter
