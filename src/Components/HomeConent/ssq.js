/**
 * Created by pc on 2017/8/11.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import utils from '../../common/utils'
import '../../Style/HomeConent/ssq.less'

class RllNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NumberList: [3, 2, 4, 5, 6, 7, 33, 11],
      rotateIndex: 0
    }
    this.RollNumber = this.RollNumber.bind(this);
    this.ChangeNum = this.ChangeNum.bind(this);
    this.MakeRoll = this.MakeRoll.bind(this);
  }

  componentWillMount() {
    const _this = this;
    let RollNumberRed = _this.RollNumber(1, 33, 6).sort(function (a, b) {
      return a - b;
    });
    let RollNumberBlue = _this.RollNumber(1, 16, 1);

    this.setState({
      NumberList: RollNumberRed.concat(RollNumberBlue)
    })
    this.MakeRoll();
  }

  componentWillUnmount() {
    clearInterval(this.time);
  }
  RollNumber(starNum, totalNum, len, isRepeat) {
    let absNum = Math.abs(totalNum - starNum) + 1;
    let repl = 0;
    let o = {}, _r = new Array(len), i = 0, s, j = 1;
    while (i < len) {
      s = parseInt(Math.random() * absNum + starNum);
      if (!isRepeat) {
        s = ((a, s) => {
          for (let i = 0; i < a.length;) {
            if (a[i++] == s) {
              return null;
            }
          }
          return s;
        })(_r, s);
        s != null && ( _r[i++] = s);
      } else {
        _r[i++] = s;
      }
    }
    return _r
  }

  MakeRoll() {
    const _this = this;
    clearInterval(this.time);
    _this.setState({
      rotateIndex: 0
    })
    this.time = setInterval(() => {
      if (_this.state.rotateIndex < 8) {
        let count = _this.state.rotateIndex + 2;
        _this.setState({
          rotateIndex: count
        })
      } else {
        //随机出数
        let RollNumberRed =  utils.math.padArray( _this.RollNumber(1, 33, 6)).sort(function (a, b) {
          return a - b;
        });
        let RollNumberBlue = utils.math.padArray(_this.RollNumber(1, 16, 1));
        _this.setState({
          NumberList: RollNumberRed.concat(RollNumberBlue)
        });
        //停止旋转
        _this.setState({
          rotateIndex: 7
        })
        clearInterval(this.time)
      }
    }, 100)
  }

  async ChangeNum() {
    await this.MakeRoll();
  }

  render() {
    return (
      <div className="ssqNumber">
        <div className="ssqNumber_1">
          <span className="span1">双色球</span>
          <span className="span2">2元中1000万</span>

          <div className='ssqNumber_11'>
            <span className="span3">每周二 四 日 21:15开奖</span><span className="refreshBox" onClick={this.ChangeNum}></span>
          </div>
        </div>
        <div className="ssqNumber_2">
          <div className="clearfix ballBox">
            {
              this.state.NumberList.map((item, index) => {
                return (
                  <span key={index} className=
                    {`${index != (this.state.NumberList.length-1) ?'': 'ballBlue'}
                      ${(this.state.rotateIndex != 7) && (index <= this.state.rotateIndex) ? 'ballRed rotate_jx' : 'ballRed'}`}
                  >{item}</span>
                )
              })
            }
          </div>
          <div className="ssqNumber_22" onClick={() => {
            if(this.state.NumberList.length === 7){
              let arr = utils.math.padArray(this.state.NumberList)
              let code = arr.slice(0, 6).join(',') + '|' + arr.slice(6).join(',')
              console.log(code)
              clearInterval(this.time);
              hashHistory.push({
                pathname: '/ssqBet',
                query: {
                  code: code,
                }
              })
            }
          }}>立即投注
          </div>
        </div>
      </div>
    )
  }
}

export default RllNumber;
