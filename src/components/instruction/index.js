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
        let getListPatch = await getData('/stock/instruction', {
            fmt: "json",
            amount: 1000000,
            sid: "5598.R.96574918314022",
            _: 1636512993654,
        });
        let meas_data = getListPatch.data.sheet_data.meas_data;
        let filterData = meas_data[2].map((item, index)=> {
            console.log(item, index);
            let once = {};
            once.index = index + 1;
            once.amount = meas_data[0][index];
            once.position = (meas_data[1][index] * 100);
            once.price = meas_data[3][index];
            return once;
        });
        await dispatch({
            type: 'getList',
            payload: filterData
        });
        setLoadingData(false)
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: '信号',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: '目标仓位',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '参考价',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '涨幅',
            dataIndex: 'return',
            key: 'return',
        },
    ];

    return <div>
        <Button onClick={onClick}>onclick fetch</Button>
        <Spin spinning={loading}>
            <Table dataSource={list} columns={columns} rowKey={columns => columns.index} pagination={{pageSize: 10000}} scroll={{ y: 800 }}/>
        </Spin>
    </div>
}

export default App