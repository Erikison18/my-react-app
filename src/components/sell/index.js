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
            let dt = new Date("2013/01/01");
            if (d.getTime() > dt.getTime()) {
                myReturn = false;
            // } else if (item.score > 65 && item.sharpe_ratio > 3 && parseFloat(item.max_withdraw) < 40) {
            // } else if (item.score > 70 && item.sharpe_ratio > 3) {
            // } else if (item.sharpe_ratio > 4) {
            // } else if (parseInt(item.max_withdraw) < 20) {
            // } else if (parseInt(item.real_days) > 1000) {
            // } else if (parseInt(item.real_return) > 400) {
            // } else if (parseInt(item.live_excess_return) > 400) {
            // } else if (parseInt(item.year_return) > 100) {
            // } else if (item.score > 75) {
            // } else if (parseInt(item.cnt) > 10) {
            } else if (parseInt(item.live_annual_return) > 80 && parseInt(item.annual_return) > 80 && item.score > 60 && item.sharpe_ratio > 0.5) {
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
          title: '??????',
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
            return <a href={`https://guorn.com/stock/strategy?sid=${text}`} target="_blank">??????</a>;
          },
        },
        /*eslint-disable*/
        {
          title: '??????',
          dataIndex: 'score',
          key: 'score',
          render: (text) => {
            return <span>{parseFloat(text).toFixed(2)}</span>;
          },
        },
        {
            title: '??????????????????',
            dataIndex: 'start_date',
            key: 'start_date',
          },
        {
            title: '?????????',
            dataIndex: 'annual_return',
            key: 'annual_return',
        },
        {
            title: '????????????',
            dataIndex: 'max_withdraw',
            key: 'max_withdraw',
        },
        {
            title: '????????????',
            dataIndex: 'sharpe_ratio',
            key: 'sharpe_ratio',
        },
        {
            title: '????????????',
            dataIndex: 'real_days',
            key: 'real_days',
        },
        {
            title: '????????????',
            dataIndex: 'real_return',
            key: 'real_return',
        },
        {
            title: '???????????????',
            dataIndex: 'live_annual_return',
            key: 'live_annual_return',
        },
        {
            title: '??????????????????',
            dataIndex: 'live_excess_return',
            key: 'live_excess_return',
        },
        {
            title: '????????????',
            dataIndex: 'trend_score',
            key: 'trend_score',
        },
        {
            title: '??????????????????',
            dataIndex: 'year_return',
            key: 'year_return',
        },
        {
            title: '???????????????',
            dataIndex: 'cnt',
            key: 'cnt',
        },
        {
            title: '????????????',
            dataIndex: 'mall_capacity',
            key: 'mall_capacity',
        },
        {
            title: '??????????????????',
            dataIndex: 'quarter_return',
            key: 'quarter_return',
        },
        {
            title: '??????????????????',
            dataIndex: 'month_return',
            key: 'month_return',
        },
        // {
        //     title: '??????',
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