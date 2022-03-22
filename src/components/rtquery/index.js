/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { getData, postData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin, Table } from 'antd';
import "./index.scss"

function App() {
    const [loading, setLoadingData] = useState(false);
    // redux
    const list = useSelector(state => {
        return state.list
    });
    const list1 = useSelector(state => {
        return state.list1
    });
    const dispatch = useDispatch();

    let ticker = "605058"; //股票代码 000333,605058
    async function onClick() {
        setLoadingData(true)

        let getListPatch1 = await postData('/stock/rtquery?_xsrf=2%7C6034a5c7%7C3d89878125876e9e8ea0600d2b2a776a%7C1647869669', {
            bond: [],
            fund: [],
            index: [],
            meas_list: [],
            repo: [],
            stock: ["600519", "000858", "000333", "603288", "300760", "603259", "600276", "000651", "600690"]
        });

        let filterData = [];
        console.log(getListPatch1);
        for (const ikey in getListPatch1.data.stock) {
            console.log(ikey)
            let once = {};
            once = {...getListPatch1.data.stock[ikey], code: ikey, amount: 1000000 }
            filterData.push(once);
        }

        await dispatch({
            type: 'getList1',
            payload: {...getListPatch1.data, stock: filterData}
        });

        let getListPatch = await getData('/stock/rtquery', {
            ticker: ticker,
            category: "stock",
            book: 1,
            _: 1647920156082
        });

        await dispatch({
            type: 'getList',
            payload: getListPatch.data
        });
        setLoadingData(false)
    }
    const columns = [
        {
            title: '代码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '最新价格',
            dataIndex: 'closeprice',
            key: 'closeprice',
        },
        {
            title: '成交金额',
            dataIndex: 'value',
            key: 'value',
            render: (text) => {
                return <span>{(text / 10000).toFixed(2)} 万</span>;
            },
        },
        {
            title: '成交量',
            dataIndex: 'volume',
            key: 'volume',
            render: (text) => {
                return <span>{(text / 100).toFixed(2)} 手</span>;
            },
        },
        {
            title: '最新价格涨幅',
            dataIndex: 'changepct',
            key: 'changepct',
            render: (text) => {
                return <span>{(text * 100).toFixed(2)} %</span>;
            },
        },
        {
            title: '最新价格涨跌',
            dataIndex: 'change',
            key: 'change',
        },
        {
            title: '最新股数',
            dataIndex: 'amount',
            key: 'amount',
            render: (text, item) => {
                console.log(text, item);
                return <span>{(text / item.closeprice).toFixed(2)}</span>;
            },
        },
    ];
    let dataS = list[ticker] ? [{...list[ticker], code: ticker, amount: 1000000 }] : [];
    let dataS1 = list1["stock"] ? list1["stock"] : [];
    console.log(dataS, dataS1);

    return <div>
        <Button onClick={onClick}>onclick fetch</Button>
        <Spin spinning={loading}>
            <h1>单股</h1>
            <h2>实时时间：{list.realtime_ts}</h2>
            <Table dataSource={dataS} columns={columns} rowKey={columns => columns.code} pagination={{pageSize: 10000}} scroll={{ y: 800 }}/>
            <hr/>
            <h1>集合股</h1>
            <h2>实时时间：{list1.realtime_ts}</h2>
            <Table dataSource={dataS1} columns={columns} rowKey={c => c.code} pagination={{pageSize: 10000}} scroll={{ y: 800 }}/>
        </Spin>
    </div>
}

export default App