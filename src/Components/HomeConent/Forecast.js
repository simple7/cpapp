/**
 * Created by pc on 2017/8/11.
 */
import React, {Component} from 'react'
import { Forecast} from '../../Stubs/API'
import commonConfig from '../../config/commonConfig'
import '../../Style/HomeConent/home_forecast.css'
class ForecastCont extends Component {
    constructor(props){
        super(props);
        this.state={
            artileList:[]
        }
        this.initialize = this.initialize.bind(this);
    }
    componentWillMount() {
        this.initialize();
    }

    initialize(){
        const that = this;
        Forecast({name:"html5yuce"}).then(result=>{
            console.log('------------')
            console.log(result)
            if(result.code==0){
                that.setState({
                    artileList:result.rows.row
                })
            }
        }).catch(error=>{
            console.log(error)
        })
    }
    render() {
        console.log(this.state)
        return (
            <section className="inyc">
                <p className="clearfix">
                    <strong>今日预测</strong>
                    <a href="/yuce/">更多</a>
                </p>
                <div id="yuce">
                    {
                        this.state.artileList&&this.state.artileList.map(function (item,index) {
                            return(
                                <a href={commonConfig.domain+item.arcurl} key={index}>
                                    <span><em>{item.name}</em>{item.title}</span>
                                    <i className="rightArrow"></i>
                                </a>
                            )
                        })
                    }
                </div>
            </section>
        )
    }
}
export default ForecastCont;
