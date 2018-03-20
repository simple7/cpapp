/*出票明细*/
/* 出票明细 */
const cpmx = {
  path: "cpmx",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/ticketDetails.js").default);
    });
  }
};

/*竞彩足球*/
const jczq = {
  path: "jczq",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/jczq/jczq.js").default);
    });
  }
};

/*竞彩篮球*/
const jclq = {
  path: "jclq",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/jclq/jclq.js").default);
    });
  }
};

/*胜负过关 && 北京单场*/
const bjdc = {
  path: "bjdc",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/bjdc/bjdc.js").default);
    });
  }
};

/*任选九 && 胜负彩*/
const sfr9 = {
  path: "sfr9",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/sfr9/sfr9.js").default);
    });
  }
};
/*任选九 && 胜负彩*/
const szc = {
  path: "szc",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/szc/index.js").default);
    });
  }
};

/*组合详情*/
const cpxq = {
  path: "cpxq",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/combinationDetails.js").default);
    });
  }
};

/*追号详情*/
const zhxq = {
  path: "zhxq",
  getComponent(nextState, cb) {
    require.ensure([], require => {
      cb(null, require("../Components/PlanDetail/zhxq/index.js").default);
    });
  }
};

export default [cpmx, jczq, jclq, bjdc, sfr9, szc, cpxq, zhxq];
