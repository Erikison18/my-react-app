import React, { useState } from 'react'
import { getData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin, Table } from 'antd';
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
        let getListPatch = await getData('/stock/strategy/sell', {
            fmt: "json",
            all: 1,
            uid: "null",
            size: 1000000,
            page: "profile",
            name_only: 1,
            order: "score", //score,sharpe_ratio,annual_return,max_withdraw,real_return,live_annual_return
            asc: 0,
            _: 1636335971777,
        });
        let filterData = getListPatch.data.filter((item)=> {
            console.log(item);
            let myReturn = false;
            let d = new Date(item.start_date);
            let dt = new Date("2014/11/01");
            if (d.getTime() > dt.getTime()) {
                myReturn = false;
            // } else if (item.score > 65 && item.sharpe_ratio > 2 && parseFloat(item.max_withdraw) < 40) {
            // } else if (item.score > 60) {
            // } else if (parseInt(item.cnt) > 10) {
            } else if (parseInt(item.live_annual_return) > 90 && parseInt(item.annual_return) > 90) {
                myReturn = true;
            } else {
                myReturn = false;
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
          render: (text) => {
            return <span>{parseFloat(text).toFixed(2)}</span>;
          },
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
            title: '实盘天数',
            dataIndex: 'real_days',
            key: 'real_days',
        },
        {
            title: '实盘收益',
            dataIndex: 'real_return',
            key: 'real_return',
        },
        {
            title: '实盘年化率',
            dataIndex: 'live_annual_return',
            key: 'live_annual_return',
        },
        {
            title: '实盘超额收益',
            dataIndex: 'live_excess_return',
            key: 'live_excess_return',
        },
        {
            title: '起势分数',
            dataIndex: 'trend_score',
            key: 'trend_score',
        },
        {
            title: '最近一年收益',
            dataIndex: 'year_return',
            key: 'year_return',
        },
        {
            title: '最近一季收益',
            dataIndex: 'quarter_return',
            key: 'quarter_return',
        },
        {
            title: '最近一月收益',
            dataIndex: 'month_return',
            key: 'month_return',
        },
        {
            title: '持仓股票数',
            dataIndex: 'cnt',
            key: 'cnt',
        },
        {
            title: '资金容量',
            dataIndex: 'mall_capacity',
            key: 'mall_capacity',
        },
        // {
        //     title: '描述',
        //     dataIndex: 'desc',
        //     key: 'desc',
        // },
    ];

    return <div>
        <Button onClick={onClick}>onclick fetch</Button>
        <Spin spinning={loading}>
            <Table dataSource={list} columns={columns} rowKey={columns => columns.id} pagination={{pageSize: 100}} scroll={{ y: 800 }}/>
        </Spin>
    </div>
}

export default App