import React, {Component} from "react";

class LotteryNum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: "--:--后截止",
      time1: "",
      ClassState: false,
      serverTime: this.props.serverTime,
    };
    this.settime = "";
    this.settime1 = "";
    this.serverTime1 = '';
    this.setIntervalClose = this.setIntervalClose.bind(this);
    this.setIntervalKaij = this.setIntervalKaij.bind(this);
    this.diffToString = this.diffToString.bind(this);
    this.eachClock = this.eachClock.bind(this);
    this.Setsubstring = this.Setsubstring.bind(this);
    this.arrValue = this.arrValue.bind(this);
    this.ClassStateChange = this.ClassStateChange.bind(this);
    this.totalShowJudge = this.totalShowJudge.bind(this);
    this.ballColor = this.ballColor.bind(this);
    this.sscWanfa = this.sscWanfa.bind(this);
  }

  componentDidMount() {
    const {HistoryStage, nowStage} = this.props;
    const hs = HistoryStage;
    if (hs && hs[0].c) {
      this.setState(
        {
          time1: hs[0].c.split(",")
        },
        () => {
          clearInterval(this.settime1);
        }
      );
    } else {
      clearInterval(this.settime1);
      this.setIntervalKaij(nowStage, "开奖");
    }
    clearInterval(this.settime);
    this.setIntervalClose(nowStage, "截止");
  }

  componentWillUnmount() {
    clearInterval(this.settime);
    clearInterval(this.settime1);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nowStage && nextProps.HistoryStage) {
      const hs = nextProps.HistoryStage;
      if (hs[0].c) {
        this.setState(
          {
            time1: hs[0].c.split(",")
          },
          () => {
            clearInterval(this.settime1);
          }
        );
      } else {
        clearInterval(this.settime1);
        this.setIntervalKaij(nextProps.nowStage, "开奖");
      }
      clearInterval(this.settime);
      this.setIntervalClose(nextProps.nowStage, "截止");
    }
    if(nextProps.serverTime){
      this.setState({
        serverTime: nextProps.serverTime
      },()=> {
        this.serverTime1 = nextProps.serverTime;
      })
    }
  }

  setIntervalClose(fu, type) {
    const that = this;
    if (fu) {
      this.settime = setInterval(function () {
        that.eachClock(fu.t, type, 'close');
      }, 1e3);
    }
  }

  setIntervalKaij(fu, type) {
    const that = this;
    if (fu) {
      this.settime1 = setInterval(function () {
        that.eachClock(fu.a, type, 'kaij');
      }, 1e3);
    }
  }

  diffToString(num) {
    var unit = [8.64e7, 3.6e6, 6e4, 1e3, 1],
      date = [];
    var cn = "\u5929,\u65f6,\u5206,\u79d2,\u6beb\u79d2".split(",");
    for (var i = 0, l = unit.length; i < l; i++) {
      date[i] = parseInt(num / unit[i]);
      num %= unit[i];
    }
    return date;
  }

  eachClock(fu, type, Stype) {
    const {HistoryStage, nowStage, HistoryStageFunc} = this.props;
    let nowDate = 0;
    if(!this.serverTime1){
      this.serverTime1 = this.state.serverTime;
    }
    if(Stype == 'close'){
      nowDate = new Date(this.state.serverTime).getTime();
    }else{
      nowDate = new Date(this.serverTime1).getTime();
    }
    let fnDate = new Date(fu.replace(/-/g,'/')).getTime();
    let mtime = fnDate - nowDate;
    if(Stype == 'close'){
      this.setState({
        serverTime: Number(nowDate)+1000
      });
    }else{
      this.serverTime1 = Number(nowDate)+1000
    }
    if (mtime >= 0) {
      let timeout = this.diffToString(mtime);
      let msg = "";
      if (timeout[1] == 0) {
        msg = `${this.Strjoint(timeout[2])}:${this.Strjoint(timeout[3])}`;
      } else {
        msg = `${timeout[1]}:${timeout[2]}:${this.Strjoint(timeout[3])}`;
      }
      if (type == "截止") {
        this.setState({
          time: `${msg}后${type}`
        });
      } else if (type == "开奖") {
        this.setState({
          time1: `${msg}后${type}`
        });
      }
    } else {
      if (type == "截止") {
        this.setState({
          time: `已截止`
        });
        //clearInterval(this.settime);
        HistoryStageFunc();
      } else if (type == "开奖") {
        //clearInterval(this.settime1);
        HistoryStageFunc();
      }
    }
  }

  Setsubstring(str) {
    const {gid} = this.props;
    let slen = 0;
    if (gid == 59 || gid == 55) {
      slen = 8;
    } else if (gid == '04') {
      slen = 6;
    }
    if (str) {
      const p = str.p;
      const len = p.length;
      return p.substring(slen, len);
    }
  }

  Strjoint(str) {
    if (str) {
      return String(str).length == 2 ? str : `0${str}`;
    }
    return str || "00";
  }

  arrValue(arr) {
    if (arr) {
      let total = 0;
      for (let i = 0; i < arr.length; i++) {
        total += Number(arr[i]);
      }
      return total;
    }
  }

  ClassStateChange() {
    const {ClassState} = this.state;
    this.setState({
      ClassState: !ClassState
    });
  }

  totalShowJudge(gid, c) {
    if (c) {
      if (gid == '59' || gid == '55') {
        return false;
      } else if (gid == '04') {
        return <span className="color999" dangerouslySetInnerHTML={{ __html: this.sscWanfa(c)}}></span>
      } else if (gid == '10') {
        return (
          <span className="color999">
        和值<i>{this.arrValue(c)}</i>
      </span>
        )
      }
    }
  }

  sscWanfa(c) {
    const {active} = this.props;
    const strarr = JSON.stringify(c.slice(2))
    let count = 0;
    if (active == '2' || active == '3') {
      for (let i = 2; i < c.length; i++) {
        if ((strarr.match(new RegExp(c[i], "g")).length) > 1) {
          count++
        }
      }
      if (count == 2) {
        return '组三'
      } else {
        return '组六'
      }
    } else if (active == '9') {
      for (let i = 3; i < c.length; i++) {
        count += c[i];
      }
      return `和值<span>${Number(c[3]) + Number(c[4])}</span>`
    } else if (active == '10') {
      let dans1 = c[3];
      let dans2 = c[4];
      return `${this.danshuang(dans1)}${this.danshuang(dans2)}`;
    }
  }

  danshuang(ds) {
    let desc = '';
    if (ds >= 5) {
      desc += '大'
    } else {
      desc += '小'
    }
    if (ds % 2 == 0) {
      desc += '双'
    } else {
      desc += '单'
    }
    return desc
  }

  ballColor(it) {
    const {gid} = this.props;
    if (gid) {
      if (gid == '59' || gid == '55' || gid == '04') {
        return gid == '04' ? it : this.Strjoint(it)
      }
    }
  }

  render() {
    const {
      HistoryStage,
      nowStage,
      HistoryStageFunc,
      active,
      gid
    } = this.props;
    const {time, time1, ClassState} = this.state;
    let kaijp = HistoryStage && HistoryStage[0].p;
    let HSReverse = JSON.parse(JSON.stringify(HistoryStage));
    HSReverse = HSReverse && HSReverse.reverse();
    return (
      <div>
        <section
          className="beforePeriods"
          style={{display: ClassState ? "block" : "none"}}
        >
          {HSReverse &&
          HSReverse.map((item, index) => {
            const c = item.c.split(",");
            return item.p != kaijp ? (
              <ul className="ul_1 clearfix" key={index}>
                <li className="li_1">{this.Setsubstring(item)}期</li>
                <li className="li_2">
                    <span className="color78">
                      {c.map((it, index1) => {
                        let content = this.ballColor(it)
                        return (
                          <span key={index1}>{content}</span>
                        )
                      })}
                      {this.totalShowJudge(gid, c)}
                    </span>
                </li>
              </ul>
            ) : (
              ""
            );
          })}
        </section>
        <section className="beforePeriods" onClick={this.ClassStateChange}>
          <ul className="ul_1 clearfix" style={{background: "#FEF6F4"}}>
            <li className="li_1">
              {this.Setsubstring(HistoryStage && HistoryStage[0])}期
            </li>
            <li className="li_2">
              <span className="color78">
                {time1 && time1 instanceof Array
                  ? time1.map((item, index) => {
                    let content = this.ballColor(item)
                    return (
                      <span key={index}>{content}</span>
                    )
                  })
                  : time1}
                {time1 && time1 instanceof Array ?
                  this.totalShowJudge(gid, time1) : ''}
              </span>
            </li>
          </ul>
          <ul className="ul_1 clearfix" style={{background: "#fff"}}>
            <li className="li_1">{this.Setsubstring(nowStage)}期</li>
            <li className="li_2">
              <span className="color78">{time}</span>
            </li>
          </ul>
        </section>
        <section className="currentPeriods">
          <p className={ClassState ? `arrowP up` : `arrowP`}/>
          {/* 加上 up 箭头向上*/}
        </section>
      </div>
    );
  }
}

export default LotteryNum;
