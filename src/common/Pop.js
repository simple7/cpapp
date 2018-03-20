import React,{Component,PropTypes } from 'react'
import '../Style/Pop.css'
import { Popaction } from '../action/action.pop'
import { connect } from 'react-redux'

const defaultProps = {
    show: false,
    title: '',
    des:'',
    Rightbtn:'知道了',
    zIndex: 1000,
    onOk: () => {},
    onCancel: () => {},
}

const propTypes = {
    title: PropTypes.string,
    des: PropTypes.des,
    Rightbtn: PropTypes.Rightbtn,
    zIndex: PropTypes.number,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
}

class Pop extends Component {
    constructor(props) {

     super(props);
    }
    render() {
        const that = this;
        const { des, title, show, dispatch} = this.props
        console.log(this.props);

        return (
            <div id="Pop" style={{'display': (show)?'block':'none'}}>
                <div className="maskPop"></div>
                <div className="pop">
                    <div className="popTitle">{title}</div>
                    <div className="popBody">
                        <p>{des}</p>

                        <a className="popBtn" href="javascript:;" onClick={show => dispatch(Popaction(show))}>知道了</a>

                    </div>
                </div>
            </div>
        )
    }
}


function select(state){
    console.log(state);
    return {
        Popreduce : state.Popreduce
    }
}

export default connect(select)(Pop)
















