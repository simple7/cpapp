import React, { Component } from "react";

class FootDesc extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {hid, state} = this.props;
    return (
      <div className="programmefootDesc">
        {state && <p>*上述sp值仅为投注时的参考值，非计奖sp值</p>}
        {hid && <p>方案编号: {hid}</p>}
      </div>
    );
  }
}

export default FootDesc
