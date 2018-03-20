/**
 * Created by pc on 2017/8/11.
 */
import React, {Component} from 'react'
import '../../Style/HomeConent/RollNumber.css'
class RllNumber extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NumberList: [3, 2, 4, 5, 6, 7, 33, 11],
      rotateIndex: 0
    }
    this.initialize = this.initialize.bind(this);
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
    this.initialize();
    this.MakeRoll();
  }

  initialize() {

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
    clearInterval(time);
    _this.setState({
      rotateIndex: 0
    })
    var time = setInterval(() => {
      if (_this.state.rotateIndex < 8) {
        let count = _this.state.rotateIndex + 2;
        _this.setState({
          rotateIndex: count
        })
      } else {
        //随机出数
        let RollNumberRed = _this.RollNumber(1, 33, 6).sort(function (a, b) {
          return a - b;
        });
        let RollNumberBlue = _this.RollNumber(1, 16, 1);
        _this.setState({
          NumberList: RollNumberRed.concat(RollNumberBlue)
        });
        //停止旋转
        _this.setState({
          rotateIndex: 7
        })
        clearInterval(time)
      }
    }, 100)
  }

  ChangeNum() {
    const _this = this;
    _this.MakeRoll();
  }

  render() {
    const _this = this;
    return (
      <div className="inText" id="handy">
        <div className="clearfix inms">
          <span>
            <strong>双色球</strong>
             2元中1000万
          </span>
          <em onClick={_this.ChangeNum}>换一注</em>
        </div>
        <div className="kjball clearfix" id="ball">
          {
            _this.state.NumberList.map((item, index) => {
              if (index > 2) {
              } else {
                var letindex = (0 < index) && index <= _this.state.rotateIndex ? 'rotate_jx' : ''
              }
              return (
                <em key={index} className={
                  `${index != (_this.state.NumberList.length - 1) ? '' : 'blue'}
                                ${
                    (_this.state.rotateIndex != 7) && (index <= _this.state.rotateIndex) ? 'rotate_jx' : ''
                    }`
                }>{item}</em>
              )
            })
          }
          <a href="javascript:;">购买</a>
        </div>
      </div>
    )
  }
}
export default RllNumber;
