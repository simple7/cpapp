'use strict'
import React, {Component} from 'react'
import setImg from "../../Img/set.png"

class Kuai3 extends Component {

  render() {
    return (
      <div className="">
        <div className="tab">
          <div className="on">
            <span>号码分布</span>
          </div>
          <div>
            <span>和值</span>
          </div>
        </div>
        {/*号码分布*/}
        {/*<!--期次和号码固定-->*/}
        <div className="flexFixed zstFlex">
          <div className="flex3">期次</div>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div className="flex6">三不同</div>
          <div className="flex6">二同号</div>
        </div>
        {/*<!--内容-->*/}
        <div className="zstView">

          <div className="zstFlex">
            <div className="flex3">001</div>
            <div className="on">
              <span>2</span>
            </div>
            <div className="on">
              <span>2</span>
            </div>
            <div className="on">
              <span>2</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div className="flex6 onGreen">三不同</div>
            {/*onGreen*/}
            <div className="flex6">6</div>
            {/*onBlue*/}
          </div>
          <div className="zstFlex">
            <div className="flex3">001</div>
            <div className="on">
              <span>2</span>
              <span className="blue2">2</span>{/*blue2 green3*/}
            </div>
            <div className="on">
              <span>2</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div className="flex6">6</div>
            {/*onGreen*/}
            <div className="flex6 onBlue">二同号</div>
            {/*onBlue*/}
          </div>

          {/*<!--统计-->*/}
          <div>
            <div className="zstFlex purpleViwe">
              <div className="flex3">出现次数</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div className="flex6">7</div>
              <div className="flex6">7</div>
            </div>
            <div className="zstFlex cyanView">
              <div className="flex3">平均遗漏</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div className="flex6">6</div>
              <div className="flex6">6</div>
            </div>
            <div className="zstFlex brownView">
              <div className="flex3">最大遗漏</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div className="flex6">8</div>
              <div className="flex6">8</div>
            </div>
            <div className="zstFlex blueView">
              <div className="flex3">最大连出</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div>1</div>
              <div className="flex6">20</div>
              <div className="flex6">12</div>
            </div>
          </div>
        </div>
        {/*和值*/}
        {/*期次*/}
        <div className="flexFixed zstFlex" style={{display: 'none'}}>
          <div className="flex2">期次</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
          <div>6</div>
          <div>7</div>
          <div>8</div>
          <div>9</div>
          <div>10</div>
          <div>11</div>
          <div>12</div>
          <div>13</div>
          <div>14</div>
          <div>15</div>
          <div>16</div>
          <div>17</div>
          <div>18</div>
        </div>
        {/*走势图*/}
        <div className="zstView" style={{display: 'none'}}>
          <div className="zstFlex">
            <div className="flex2">001</div>
            <div className="on">{/*后区选中是 onBlue*/}
              <span>1</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>3</span>
            </div>
            <div>
              <span>4</span>
            </div>
            <div>
              <span>5</span>
            </div>
            <div>
              <span>6</span>
            </div>
            <div>
              <span>7</span>
            </div>
            <div>
              <span>8</span>
            </div>
            <div>
              <span>9</span>
            </div>
            <div>
              <span>10</span>
            </div>
            <div>
              <span>11</span>
            </div>
            <div>
              <span>12</span>
            </div>
            <div>
              <span>13</span>
            </div>
            <div>
              <span>14</span>
            </div>
            <div>
              <span>15</span>
            </div>
            <div>
              <span>16</span>
            </div>
          </div>
          <div className="zstFlex">
            <div className="flex2">001</div>
            <div className="on">
              <span>1</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>3</span>
            </div>
            <div>
              <span>4</span>
            </div>
            <div>
              <span>5</span>
            </div>
            <div>
              <span>6</span>
            </div>
            <div>
              <span>7</span>
            </div>
            <div>
              <span>8</span>
            </div>
            <div>
              <span>9</span>
            </div>
            <div>
              <span>10</span>
            </div>
            <div>
              <span>11</span>
            </div>
            <div>
              <span>12</span>
            </div>
            <div>
              <span>13</span>
            </div>
            <div>
              <span>14</span>
            </div>
            <div>
              <span>15</span>
            </div>
            <div>
              <span>16</span>
            </div>
          </div>
          <div className="zstFlex">
            <div className="flex2">001</div>
            <div className="on">
              <span>1</span>
            </div>
            <div>
              <span>2</span>
            </div>
            <div>
              <span>3</span>
            </div>
            <div>
              <span>4</span>
            </div>
            <div>
              <span>5</span>
            </div>
            <div>
              <span>6</span>
            </div>
            <div>
              <span>7</span>
            </div>
            <div>
              <span>8</span>
            </div>
            <div>
              <span>9</span>
            </div>
            <div>
              <span>10</span>
            </div>
            <div>
              <span>11</span>
            </div>
            <div>
              <span>12</span>
            </div>
            <div>
              <span>13</span>
            </div>
            <div>
              <span>14</span>
            </div>
            <div>
              <span>15</span>
            </div>
            <div>
              <span>16</span>
            </div>
          </div>

          <div className="zstFlex purpleViwe">
            <div className="flex2">出现次数</div>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
            <div>11</div>
            <div>12</div>
            <div>13</div>
            <div>14</div>
            <div>15</div>
            <div>16</div>
          </div>
          <div className="zstFlex cyanView">
            <div className="flex2">平均遗漏</div>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
            <div>11</div>
            <div>12</div>
            <div>13</div>
            <div>14</div>
            <div>15</div>
            <div>16</div>
          </div>
          <div className="zstFlex brownView">
            <div className="flex2">最大遗漏</div>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
            <div>11</div>
            <div>12</div>
            <div>13</div>
            <div>14</div>
            <div>15</div>
            <div>16</div>
          </div>
          <div className="zstFlex blueView">
            <div className="flex2">最大连出</div>
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
            <div>9</div>
            <div>10</div>
            <div>11</div>
            <div>12</div>
            <div>13</div>
            <div>14</div>
            <div>15</div>
            <div>16</div>
          </div>
        </div>

        {/*<!-- 设置 -->*/}
        <div className="setView">
          <img src={setImg}/>
        </div>
        <div className="maskView"></div>
        {/*<!-- pop -->*/}
        <div className="popView">
          <div className="popHead">走势图设置</div>
          <div className="popBody">
            <div className="popTitle">期次</div>
            <div className="popTxt popTxt1">
              <span className="on">近30期</span>
              <span>近50期</span>
              <span>近100期</span>
            </div>
            <div className="popTitle">遗漏</div>
            <div className="popTxt popTxt2">
              <span className="on">显示遗漏</span>
              <span>隐藏遗漏</span>
            </div>
            <div className="popTitle">统计</div>
            <div className="popTxt popTxt2">
              <span>显示统计</span>
              <span className="on">隐藏统计</span>
            </div>
          </div>
          <div className="popFoot">
            <div>取消</div>
            <div>确定</div>
          </div>
        </div>
      </div>
    )
  }
}

export default Kuai3

