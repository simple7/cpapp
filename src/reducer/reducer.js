/**
 * Created by Administrator on 2017/10/25.
 * liuheng
 */
import {Popreduce} from './reducer.pop';
import {BankName, BankRegion, BankCardNum, BankCardInformation} from './reducer.bankdraw';
import  {KjResult} from "./reduce.find"
import  {HomeNavReduce, HomeNavState} from "./reduce.homenav"
import  {Match} from "./reduce.match"
import  {HomeBannerReduce,HomeMoreReduce} from "./reduce.home"
import {createStore, combineReducers} from 'redux';


const Add = combineReducers({
  Popreduce,
  BankName, // 提款绑定银行名称
  BankRegion, // 提款绑定地区
  BankCardNum, // 提款绑定卡号
  BankCardInformation, // 提款银行卡信息
  KjResult,          // 开奖结果
  HomeNavReduce, // nav
  Match,
  HomeBannerReduce,
  HomeMoreReduce,
  HomeNavState
})

export default createStore(Add);

