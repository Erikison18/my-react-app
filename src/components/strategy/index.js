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
        let getListPatch = await getData('/stock/strategy', {
            fmt: "json",
            size: 100,
            page: 1,
            order: "score", //score,sharpe_ratio,annual_return,max_withdraw,real_return
            category: "stock",
            count: "1,1",
            date_length: "3650,50000",
            annual_return: "1,100000000",
            asc: 0,
            _: 1634265880112,
        });
        await dispatch({
            type: 'getList',
            payload: getListPatch.data.strategy_list
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
          render: (text) => {
            return <a href={`https://guorn.com/stock/strategy?sid=${text}`} target="view_window">链接</a>;
          },
        },
        /*eslint-disable*/
        {
          title: '总分',
          dataIndex: 'score',
          key: 'score',
        },
        {
            title: '回测起始日期',
            dataIndex: 'start_date',
            key: 'start_date',
          },
        {
            title: '年化',
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
            title: '抗风险分数',
            dataIndex: 'risk_score',
            key: 'risk_score',
        },
        {
            title: '稳定性分数',
            dataIndex: 'stability_score',
            key: 'stability_score',
        },
    ];

    return <div>
        <Button onClick={onClick}>onclick fetch</Button>
        <Spin spinning={loading}>
            <Table dataSource={list} columns={columns} pagination={{pageSize: 100}}/>
        </Spin>
    </div>
}

export default App