import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {NavBar} from 'antd-mobile'

class CommonNavBar extends Component {
  constructor(props) {
    super(props)
    this.defaultClickLft = this.defaultClickLft.bind(this);
  }

  defaultClickLft() {
    hashHistory.goBack();
  }

  render() {
    if (sessionStorage.getItem('headFlag')) {
      console.log(sessionStorage.getItem('headFlag'))
      return null;
    } else {
      if (this.props.isWhite) {
        return (
          <NavBar className="myNav whiteNav"
                  mode="light"
                  onLeftClick={this.props.onLeftClick || this.defaultClickLft}
                  rightContent={this.props.rightContent || ''}
          >{this.props.title || ''}</NavBar>
        )
      } else {
        return (
          <NavBar className="myNav"
                  mode="dark"
                  onLeftClick={this.props.onLeftClick || this.defaultClickLft}
                  rightContent={<div
                    onClick={() => {
                      hashHistory.push('/index')
                      /*setTimeout(()=>{

                      },10)*/
                    }} className="home"/>}
                  style={{position: 'relative', height: '44px', zIndex: 2, backgroundColor: '#FC5638'}}
          >{this.props.title || ''}</NavBar>
        )
      }
    }
  }
}



export default CommonNavBar
