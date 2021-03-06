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
            size: 20000,
            page: 1,
            order: "score", //score,sharpe_ratio,annual_return,max_withdraw,real_return
            category: "stock",
            // count: "1,20",
            // count: "1,500",
            date_length: "3000,50000", //1826, 3650
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
            // if (parseInt(item.realAR) > 70 && parseInt(item.annual_return) > 70 && item.score > 60 && item.sharpe_ratio > 2 && item.deltaDay > 180) {
            if (parseInt(item.realAR) > 80 && parseInt(item.annual_return) > 80 && item.deltaDay > 365) {
                myReturn = true;
            }
            // if(item.liquidity_score < 85) {
            //     myReturn = false;
            // }
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
          width: 80,
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
            dataIndex: 'real_return',
            key: 'real_return',
        },
        {
            title: '????????????',
            dataIndex: 'deltaDay',
            key: 'start_date',
        },
        {
            title: '????????????',
            dataIndex: 'realAR',
            key: 'start_date',
        },
        {
            title: '???????????????',
            dataIndex: 'risk_score',
            key: 'risk_score',
        },
        {
            title: '???????????????',
            dataIndex: 'stability_score',
            key: 'stability_score',
        },
        {
            title: '????????????',
            dataIndex: 'real_score',
            key: 'real_score',
        },
        {
            title: '????????????',
            dataIndex: 'return_score',
            key: 'return_score',
        },
        {
            title: '???????????????',
            dataIndex: 'liquidity_score',
            key: 'liquidity_score',
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