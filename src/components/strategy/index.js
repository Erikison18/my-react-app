import React, { useState } from 'react'
import { getData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin, Table } from 'antd';
import { getDaysBetween } from "../../common/js/utils";
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
        let getListPatch = await getData('/stock/strategy', {
            fmt: "json",
            size: 200,
            page: 1,
            order: "score", //score,sharpe_ratio,annual_return,max_withdraw,real_return
            category: "stock",
            count: "1,20",
            date_length: "1825,50000",
            annual_return: "0.5,100000000",
            asc: 0,
            _: 1634265880112,
        });
        let filterData = getListPatch.data.strategy_list.filter((item)=> {
            // console.log(item);
            let deltaDay = getDaysBetween(item.upd_date).toFixed(0);
            let realAR = ((Math.pow((parseInt(item.real_return) / 100) + 1, 365 / deltaDay) - 1) * 100).toFixed(2) + "%";
            item.deltaDay = deltaDay;
            item.realAR = realAR;
            let myReturn = false;
            // return item.score > 60 && item.return_score > 90 && item.real_score > 80 && item.risk_score > 30 && item.stability_score > 30;
            // && item.sharpe_ratio > 2 && parseFloat(item.max_withdraw) < 60;
            // && item.deltaDay > 365;
            // if (parseInt(item.realAR) > 100 && parseInt(item.annual_return) > 100 && item.deltaDay > 180) {
            if (parseInt(item.realAR) > 70 && parseInt(item.annual_return) > 70 && item.score > 60 && item.sharpe_ratio > 2 && item.deltaDay > 180) {
                myReturn = true;
            }
            return myReturn;
        });
        await dispatch({
            type: 'getList',
            payload: filterData
        });
        setLoadingData(false)
    }
    const columns = [
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
        },
        /*eslint-disable*/
        {
          title: 'ID',
          dataIndex: 'id',
          key: 'id',
          width: 80,
          render: (text) => {
            return <a href={`https://guorn.com/stock/strategy?sid=${text}`} target="_blank">链接</a>;
          },
        },
        /*eslint-disable*/
        {
          title: '总分',
          dataIndex: 'score',
          key: 'score',
          width: 80,
        },
        {
            title: '回测起始日期',
            dataIndex: 'start_date',
            key: 'start_date',
          },
        {
            title: '年化率',
            dataIndex: 'annual_return',
            key: 'annual_return',
        },
        {
            title: '最大回撤',
            dataIndex: 'max_withdraw',
            key: 'max_withdraw',
        },
        {
            title: '夏普比率',
            dataIndex: 'sharpe_ratio',
            key: 'sharpe_ratio',
        },
        {
            title: '实盘收益',
            dataIndex: 'real_return',
            key: 'real_return',
        },
        {
            title: '实盘天数',
            dataIndex: 'deltaDay',
            key: 'start_date',
        },
        {
            title: '实盘年化',
            dataIndex: 'realAR',
            key: 'start_date',
        },
        {
            title: '抗风险分数',
            dataIndex: 'risk_score',
            key: 'risk_score',
        },
        {
            title: '稳定性分数',
            dataIndex: 'stability_score',
            key: 'stability_score',
        },
        {
            title: '实盘分数',
            dataIndex: 'real_score',
            key: 'real_score',
        },
        {
            title: '收益分数',
            dataIndex: 'return_score',
            key: 'return_score',
        },
    ];

    return <div>
        <Button onClick={onClick}>onclick fetch</Button>
        <Spin spinning={loading}>
            <Table dataSource={list} columns={columns} rowKey={columns => columns.id} pagination={{pageSize: 100}} scroll={{ y: 800 }}/>
        </Spin>
    </div>
}

export default App