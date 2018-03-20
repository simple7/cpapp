import React, {Component} from 'react'
import _ from 'lodash'
import Lottery from '../../config/lotteryInfo'

export default class OrderChild extends Component {
  constructor() {
    super(...arguments)
    this.type = {
      zx: '1',
      hz: '2',
      z3ds: '3',
      z3fs: '4',
      z6ds: '5',
      z6fs: '6'
    }
  }

  render() {
    let list = this.props.list
    let gid = this.props.gid
    let arr = [];
    if (gid === Lottery.type.SSQ || gid === Lottery.type.DLT || gid === Lottery.type.QLC) {
      _.each(list, (item, index) => {
        let red = item.red;
        let blue = item.blue;
        arr.push(
          <p key={"szcList_" + index}>
            {
              red.map((it, ind) => {
                return (
                  <span key={"szcC_r_" + ind}>{it}</span>
                )
              })
            }
            {blue.map((it, ind) => {
              return (
                <span className="blueColor" key={"szcC_b_" + ind}>{it}</span>
              )
            })
            }
          </p>
        )

      })
    } else if (gid === Lottery.type.PL3 || gid === Lottery.type.FC3D) {
      let code = ''
      _.each(list, (item, index) => {
        if (item.type === this.type.zx) {
          let {m0, m1, m2} = item.data;
          code = m0.join(' ') + '|' + m1.join(' ') + '|' + m2.join(' ');
        } else if (item.type === this.type.hz) {
          let {m0} = item.data;
          code = m0.join(' ');
        } else if (item.type === this.type.z3ds || item.type === this.type.z6ds) {
          let {m0, m1, m2} = item.data;
          code = m0 + ' ' + m1 + ' ' + m2;
        } else if (item.type === this.type.z3fs || item.type === this.type.z6fs) {
          let {m0} = item.data;
          code = m0.join(' ')
        }
        arr.push(
          <p key={"szcList_" + index}>
            <span>{code}</span>
          </p>
        )
      })
    } else if (gid === Lottery.type.QXC || gid === Lottery.type.PL5) {
      let code = ''
      _.each(list, (item, index) => {
        if (gid === Lottery.type.QXC) {
          code = item.m0.join(' ') + '|' + item.m1.join(' ') + '|' + item.m2.join(' ') + '|' + item.m3.join(' ') + '|' + item.m4.join(' ') + '|' + item.m5.join(' ') + '|' + item.m6.join(' ')
        } else {
          code = item.m0.join(' ') + '|' + item.m1.join(' ') + '|' + item.m2.join(' ') + '|' + item.m3.join(' ') + '|' + item.m4.join(' ')
        }
        arr.push(
          <p key={"szcList_" + index}>
            <span>{code}</span>
          </p>
        )
      })
    } else if (gid === Lottery.type.GD11X5 || gid === Lottery.type.HB11X5) {
      let code = '';
      _.each(list, (item, index) => {
        let unit = item.unit;
        let ten = item.ten;
        let hun = item.hun;
        arr.push(
          <p key={"szcList_" + index}>
            {
              unit.map((it, ind) => {
                return (
                  <span key={"szcC_r_" + ind}>{it}</span>
                )
              })
            }
            {ten.length > 0 && <span>|</span>}
            {ten.map((it, ind) => {
              return (
                <span key={"szcC_r_" + ind}>{it}</span>
              )
            })
            }
            {hun.length > 0 && <span>|</span>}
            {hun.map((it, ind) => {
              return (
                <span key={"szcC_r_" + ind}>{it}</span>
              )
            })
            }
          </p>
        )
      })
    } else if (gid === Lottery.type.SSC) {
      let code = '';
      _.each(list, (item, index) => {
        let unit = item.unit;
        let ten = item.ten;
        let hun = item.hun;
        let kil = item.kil;
        let mir = item.mir;
        arr.push(
          <p key={"szcList_" + index}>
            {mir.map((it, ind) => {
              return (
                <span key={"szcC_r_" + ind}>{it}</span>
              )
            })
            }
            {mir.length > 0 && <span>|</span>}
            {kil.map((it, ind) => {
              return (
                <span key={"szcC_r_" + ind}>{it}</span>
              )
            })
            }
            {kil.length > 0 && <span>|</span>}
            {hun.map((it, ind) => {
              return (
                <span key={"szcC_r_" + ind}>{it}</span>
              )
            })
            }
            {hun.length > 0 && <span>|</span>}
            {ten.map((it, ind) => {
              return (
                <span key={"szcC_r_" + ind}>{it}</span>
              )
            })
            }
            {ten.length > 0 && <span>|</span>}
            {
              unit.map((it, ind) => {
                return (
                  <span key={"szcC_r_" + ind}>{it}</span>
                )
              })
            }
          </p>
        )
      })
    }
    return (
      <div className="ssqOrderNum">
        {arr}
      </div>
    )
  }


}
