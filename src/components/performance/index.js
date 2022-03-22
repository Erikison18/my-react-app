import React, { useState } from 'react'
import { getData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin } from 'antd';
import "./index.scss"

function App() {
    const [loading, setLoadingData] = useState(false);
    // redux
    const list = useSelector(state => {
        return state.list
    });
    const dispatch = useDispatch();
    async function onClick() {
        setLoadingData(true)

        let myGR = [
          "营业利润增长（大）",
          "净资产增长（大）",
          "净利润增长（大）",
          "5年净资产收益率（大）",
          "毛利润增长（大）",
          "股息率（大）",
          "预期盈利增长（大）",
          "资产回报率（大）",
          "扣非净资产回报率（大）",
          "10日成交额（小）",
          "成交量（小）",
          "60日涨幅（小）",
          "股价振幅比率10日均值（大）",
          "利润总额增长（大）",
          "60日平均成交量（小）",
          "80日乖离率(小）",
          "经营现金流量净额同比增长（大）",
          "历史贝塔（小）",
          "总资产周转率（大）",
          "250日收益波动率（小）",
          "流通市值（小）",
          "预期营收增长（大）",
          "市销率（小）",
          "市净率（小）",
          "产权比率（大）",
          "市盈率（小）",
          "动态市盈率（小）",
          "收盘价（小）",
          "销售净利率（大）",
          "中性20日换手率(小)",
          "营业利润率（大）",
          "总市值（小）",
          "5年资产回报率（大）",
          "流动比率（大）",
          "负债资产率（小）",
          "存货周转率（大）",
          "营业收入增长（大）",
          "销售毛利率（大）",
        ];
        let getListPatch = await getData('/stock/query/performance', {
            pool_id: 4, //	中证1000
            // pool_id: 0, //	全市场
            // pool_id: 1, //	上证50
            // pool_id: 2, //  沪深300
            // pool_id: 3, //  中证500
            _: 1638340050744,
        });
        for (let index = 0; index < getListPatch.data.performance.length; index++) {
            const element = getListPatch.data.performance[index];
            let iNumber = myGR.indexOf(element.factor);
            if (iNumber !== -1) {
                myGR.splice(iNumber, 1);
            }
        }

        let filterData = myGR;
        await dispatch({
            type: 'getList',
            payload: filterData
        });
        setLoadingData(false)
    }

    return <div>
        <Button onClick={onClick}>onclick fetch</Button>
        <Spin spinning={loading}>
            <ol>
                {
                    list.length && list.map((item, index)=> {
                        return <li key={index}>{item}</li>
                    })
                }
            </ol>
        </Spin>
    </div>
}

export default App