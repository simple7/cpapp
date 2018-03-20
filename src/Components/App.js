import React, {Component} from 'react'
import TabBarExample from './HomeNav/HomeNav'
import {connect} from 'react-redux'
import {AppJiek} from '../common/AppApi'

//import { Login ,banner_h5} from '../Stubs/API';
class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    let Path = this.props.router.routes;
    let nowPath = this.props.router.location.pathname;
    const HaveNav = ['index', 'match', 'find', 'my'];
    return (
      <div style={{height: '100%'}}>
        {this.props.children}

        {
          (HaveNav.indexOf(Path[Path.length - 1].path) !== -1 || nowPath === '/') ? <TabBarExample/> : ''
        }
      </div>

    )
  }
}

function select(state) {
  return {
    showState: state.HomeMoreReduce,
  }
}

module.exports = connect(select)(App)
