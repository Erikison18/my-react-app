/* eslint-disable react/display-name */
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
    const list1 = useSelector(state => {
        return state.list1
    });
    const dispatch = useDispatch();
    async function onClick() {
        setLoadingData(true)
        let getListPatch = await getData('/stock/strategy', {
            fmt: "json",
            sid: "6005.R.142948956507590", //963.R.175377259140843、6005.R.151273379239841、6005.R.142948956507590、5598.R.96574918314022、1474054.R.221587820465062、515577.R.166374950966612
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

        let holdings_meas = getListPatch.data.holdings.sheet_data.meas_data;
        let holdings_col = getListPatch.data.holdings.sheet_data.col;
        let daily_chart = getListPatch.data.daily_chart.sheet_data.meas_data[1];
        let len = daily_chart.length;
        let holdingsData = [];
        for (let index = 0; index < holdings_meas[0].length; index++) {
            let holding = {
                index: index + 1,
                date: getListPatch.data.holdings_date,
                Position: holdings_meas[2][index],
                IncreaseRatio: holdings_meas[3][index],
                BuyPrice: holdings_col[0].rng[index],
                EndPrice: holdings_col[1].rng[index],
                amount: holdings_meas[2][index] * 1000000 / holdings_col[1].rng[index],
                calRatio: (holdings_col[1].rng[index] / holdings_col[0].rng[index]) - 1,
                myRatio1: daily_chart[len - 1],
                myRatio2: daily_chart[len - 2],
                myRatio3: daily_chart[len - 3],
                myRatio4: daily_chart[len - 4],
            }
            holdingsData.push(holding);
        }
        console.log(holdingsData);

        await dispatch({
            type: 'getList',
            payload: filterData
        });
        await dispatch({
            type: 'getList1',
            payload: holdingsData
        });
        setLoadingData(false)
    }
    const columns1 = [
        {
            title: '序号',
            dataIndex: 'index',
            key: 'index',
        }, {
            title: '日期',
            dataIndex: 'date',
            key: 'date',
        }, {
            title: '当前仓位',
            dataIndex: 'Position',
            key: 'Position',
            render: (text) => {
                return <span>{(text * 100).toFixed(4)}%</span>;
            },
        } , {
            title: '累计涨幅',
            dataIndex: 'IncreaseRatio',
            key: 'IncreaseRatio',
            render: (text) => {
                return <span>{(text * 100).toFixed(4)}%</span>;
            },
        } , {
            title: '计算涨幅',
            dataIndex: 'calRatio',
            key: 'calRatio',
            render: (text) => {
                return <span className="orange">{(text * 100).toFixed(4)}%</span>;
            },
        } , {
            title: '收盘价股数',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => {
                return <span className="orange">{(text * 1).toFixed(2)}</span>;
            },
        }, {
            title: '买入价格',
            dataIndex: 'BuyPrice',
            key: 'BuyPrice',
            render: (text) => {
                return <span>{(text * 1).toFixed(2)}</span>;
            },
        } , {
            title: '最近收盘价',
            dataIndex: 'EndPrice',
            key: 'EndPrice',
            render: (text) => {
                return <span>{(text * 1).toFixed(2)}</span>;
            },
        } , {
            title: '最近一日涨幅',
            dataIndex: 'myRatio1',
            key: 'myRatio1',
            render: (text) => {
                return <span>{(text * 100).toFixed(2)}%</span>;
            },
        } , {
            title: '最近二日涨幅',
            dataIndex: 'myRatio2',
            key: 'myRatio2',
            render: (text) => {
                return <span>{(text * 100).toFixed(2)}%</span>;
            },
        } , {
            title: '最近三日涨幅',
            dataIndex: 'myRatio3',
            key: 'myRatio3',
            render: (text) => {
                return <span>{(text * 100).toFixed(2)}%</span>;
            },
        } , {
            title: '最近四日涨幅',
            dataIndex: 'myRatio4',
            key: 'myRatio4',
            render: (text) => {
                return <span>{(text * 100).toFixed(2)}%</span>;
            },
        }];
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
            <h2>持仓信息</h2>
            <Table dataSource={list1} columns={columns1} rowKey={columns => columns.index} pagination={{pageSize: 100}} scroll={{ y: 800 }}/>
            <h2>历史调仓</h2>
            <Table dataSource={list} columns={columns} rowKey={columns => columns.index} pagination={{pageSize: 10000}} scroll={{ y: 800 }}/>
        </Spin>
    </div>
}

export default App