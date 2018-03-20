import React, {Component} from 'react'
import moment from 'moment'

export default class Pl3Head extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      historyShow: false
    }
  }

  render() {
    return (
      <div>
        <section className="beforePeriods" style={{display: this.state.historyShow ? "" : "none"}}>
          {
            this.props.lishi.map(item => {
              let sum = 0;
              return (
                <ul className="ul_1 clearfix" key={'head_' + item.pid}>
                  <li className="li_1">{item.pid.substr(-3) + '期'}</li>
                  <li className="li_2">
                    {
                      item.code.map((it, ind) => {
                        sum += +it
                        return (
                          <span key={item.pid + '_' + ind}>{it}</span>
                        )
                      })
                    }
                    {this.props.active && this.props.active === '2' ?
                      <span className="color999">和值
                      <i>{sum}</i>
                      </span>
                      :
                      <span className="color999">{item.t}</span>
                    }
                  </li>
                </ul>
              )
            })
          }
        </section>
        <section className="currentPeriods">
          <div className="currentPeriodsBox clearfix">
            <div className="currentPeriodsBox_fl">{this.props.pid.substr(-3) + '期'}</div>
            <div className="currentPeriodsBox_fr">
              <p>{moment(this.props.atime).format('MM-DD HH:mm') + '截止'}</p>
            </div>
          </div>
          <p className={this.state.historyShow ? "arrowP up" : "arrowP"}
             onClick={() => {
               this.setState({
                 historyShow: !this.state.historyShow
               })
             }}/>
        </section>
      </div>
    )
  }
}
