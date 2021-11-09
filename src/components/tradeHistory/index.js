import React, { useState } from 'react'
import { getData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin, Table } from 'antd';
// import { getDaysBetween } from "../../common/js/utils";
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
            sid: "963.R.175377259140843",
            _: 1636450021989,
        });
        let meas_data = getListPatch.data.trade_history.sheet_data.meas_data;
        let row = getListPatch.data.trade_history.sheet_data.row;
        let filterData = meas_data[2].map((item, index)=> {
            // console.log(item, index);
            let once = {};
            once.index = index + 1;
            once.startPrice = Math.round(meas_data[0][index] * 100) / 100;
            once.endPrice = Math.round(meas_data[1][index] * 100) / 100;
            once.return = (item * 100).toFixed(4) + "%";
            once.stockCode = row[0].data[1][index];
            once.stockName = row[1].data[1][index];
            once.industry = row[2].data[1][index];
            once.secondIndustry = row[3].data[1][index];
            once.startDate = row[4].data[1][index];
            once.endDate = row[5].data[1][index];
            // let deltaDay = getDaysBetween(item.upd_date).toFixed(0);
            // let realAR = ((Math.pow((parseInt(item.real_return) / 100) + 1, 365 / deltaDay) - 1) * 100).toFixed(2) + "%";
            // item.deltaDay = deltaDay;
            // item.realAR = realAR;
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
            title: '股票',
            dataIndex: 'stockName',
            key: 'stockName',
            // eslint-disable-next-line react/display-name
            render: (text, item) => {
                return <span>{text}<a href={`https://xueqiu.com/S/SZ${item.stockCode}`} target="_blank" rel="noreferrer">{item.stockCode}</a></span>;
            },
        },
        {
            title: '行业分类',
            dataIndex: 'industry',
            key: 'industry',
            // eslint-disable-next-line react/display-name
            render: (text, item) => {
                return <span>{text} -- {item.secondIndustry}</span>;
            },
        },
        {
            title: '买入日期',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: '卖出日期',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: '买入价格(前复权)',
            dataIndex: 'startPrice',
            key: 'startPrice',
        },
        {
            title: '卖出价格(前复权)',
            dataIndex: 'endPrice',
            key: 'endPrice',
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