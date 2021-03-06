/* eslint-disable react/display-name */
import React, { useState } from 'react'
import { getData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin, Table } from 'antd';
// import { getDaysBetween } from "../../common/js/utils";
import "./index.scss"

function App() {
    Array.prototype.avg = function (call) {
        let type = Object.prototype.toString.call(call);
        let sum = 0;
        if (type === '[object Function]') {
            sum = this.reduce((pre, cur, i) => pre + call(cur, i), 0);
        } else {
            sum = this.reduce((pre, cur) => pre + cur);
        }
        return sum / this.length;
    }

    const [loading, setLoadingData] = useState(false);
    // redux
    const list = useSelector(state => {
        return state.list
    });
    const list1 = useSelector(state => {
        return state.list1
    });
    const kely = useSelector(state => {
        return state.kely
    });

    const dispatch = useDispatch();
    async function onClick() {
        setLoadingData(true)
        let getListPatch = await getData('/stock/strategy', {
            fmt: "json",
            sid: "515577.R.166374950966612",
            //963.R.175377259140843、6005.R.151273379239841、6005.R.142948956507590、
            //5598.R.96574918314022、1474054.R.221587820465062、515577.R.166374950966612
            //1012300.R.170580949014401、515577.R.166374950966612
            _: 1636450021980,
        });

        // 计算历史调仓
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

        // 计算持仓股
        let holdings_meas = getListPatch.data.holdings.sheet_data.meas_data;
        let holdings_col = getListPatch.data.holdings.sheet_data.col;
        let daily_chart = getListPatch.data.daily_chart.sheet_data.meas_data[1];
        let len = daily_chart.length;
        let holdingsData = [];
        let BuyPrice0 = holdings_col[0].rng[0];
        let EndPrice0 = holdings_col[1].rng[0];
        let calRatio0 = (holdings_col[1].rng[0] / holdings_col[0].rng[0]) - 1;
        let BuyPrice1 = holdings_col[0].rng[1];
        let EndPrice1 = holdings_col[1].rng[1];
        let calRatio1 = (holdings_col[1].rng[1] / holdings_col[0].rng[1]) - 1;
        console.log(`calRatio0=${calRatio0},calRatio1=${calRatio1}`);

        for (let index = 0; index < holdings_meas[0].length; index++) {
            let amount = NaN;
            let BuyPrice = NaN;
            let EndPrice = NaN;
            let calRatio = NaN;
            let IncreaseRatio = holdings_meas[3][index];
            if (IncreaseRatio >= calRatio0 - 0.0001 && IncreaseRatio <= calRatio0 + 0.0001) {
                amount = holdings_meas[2][index] * 1000000 / BuyPrice0;
                BuyPrice = BuyPrice0;
                EndPrice = EndPrice0;
                calRatio = calRatio0;
            }
            if (IncreaseRatio >= calRatio1 - 0.0001 && IncreaseRatio <= calRatio1 + 0.0001) {
                amount = holdings_meas[2][index] * 1000000 / BuyPrice1;
                BuyPrice = BuyPrice1;
                EndPrice = EndPrice1;
                calRatio = calRatio1;
            }
            let holding = {
                index: index + 1,
                date: getListPatch.data.holdings_date,
                Position: holdings_meas[2][index],
                IncreaseRatio: holdings_meas[3][index],
                BuyPrice,
                EndPrice,
                amount,
                calRatio,
                myRatio1: daily_chart[len - 1],
                myRatio2: daily_chart[len - 2],
                myRatio3: daily_chart[len - 3],
                myRatio4: daily_chart[len - 4],
            }
            holdingsData.push(holding);
        }
        console.log(holdingsData);

        // 计算日凯利公式仓位
        let daily_meas_return = getListPatch.data.daily_chart.sheet_data.meas_data[1];
        let filterDailyDataUp = [];
        let filterDailyDataDown = [];
        for (let index = 0; index < daily_meas_return.length; index++) {
            const el = daily_meas_return[index];
            if (el > 0) {
                filterDailyDataUp.push(el)
            } else if(el < 0) {
                filterDailyDataDown.push(el)
            }
        }
        let kely_b = filterDailyDataUp.avg() / Math.abs(filterDailyDataDown.avg()); //日赔率
        let kely_p = filterDailyDataUp.length / daily_meas_return.length //日成功概率
        let d_kely = (kely_b * kely_p - (1 - kely_p)) / kely_b
        console.log(kely_b, kely_p)
        // 计算周凯利公式仓位
        let week_meas_return = getListPatch.data.week_chart.sheet_data.meas_data[1];
        let filterWeekDataUp = [];
        let filterWeekDataDown = [];
        for (let index = 0; index < week_meas_return.length; index++) {
            const el = week_meas_return[index];
            if (el > 0) {
                filterWeekDataUp.push(el)
            } else if(el < 0) {
                filterWeekDataDown.push(el)
            }
        }
        let kely_b1 = filterWeekDataUp.avg() / Math.abs(filterWeekDataDown.avg()); //日赔率
        let kely_p1 = filterWeekDataUp.length / week_meas_return.length //日成功概率
        let d_kely1 = (kely_b1 * kely_p1 - (1 - kely_p1)) / kely_b
        console.log(kely_b1, kely_p1)
        // 计算月凯利公式仓位
        let month_meas_return = getListPatch.data.month_chart.sheet_data.meas_data[1];
        let filterMonthDataUp = [];
        let filterMonthDataDown = [];
        for (let index = 0; index < month_meas_return.length; index++) {
            const el = month_meas_return[index];
            if (el > 0) {
                filterMonthDataUp.push(el)
            } else if(el < 0) {
                filterMonthDataDown.push(el)
            }
        }
        let kely_b2 = filterMonthDataUp.avg() / Math.abs(filterMonthDataDown.avg()); //赔率
        let kely_p2 = filterMonthDataUp.length / month_meas_return.length //成功概率
        let d_kely2 = (kely_b2 * kely_p2 - (1 - kely_p2)) / kely_b2
        console.log(kely_b2, kely_p2)
        // 计算次数凯利公式仓位
        let kely_b3 = parseFloat(getListPatch.data.trade_summary.avg_positive_return) / Math.abs(parseFloat(getListPatch.data.trade_summary.avg_negative_return)); //赔率
        let kely_p3 = parseFloat(getListPatch.data.trade_summary.win_ratio) / 100 //成功概率
        let d_kely3 = (kely_b3 * kely_p3 - (1 - kely_p3)) / kely_b3
        console.log(kely_b3, kely_p3)

        await dispatch({
            type: 'getList',
            payload: filterData
        });
        await dispatch({
            type: 'getList1',
            payload: holdingsData
        });
        await dispatch({
            type: 'getKely',
            payload: {
                timer: d_kely3,
                daily: d_kely,
                week: d_kely1,
                month: d_kely2
            }
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
            <h1>凯利公式：次数仓位{kely.timer * 100}%  /  日仓位{kely.daily * 100}%  /   周仓位{kely.week * 100}% /    月仓位{kely.month * 100}%</h1>
            <h2>持仓信息</h2>
            <Table dataSource={list1} columns={columns1} rowKey={columns => columns.index} pagination={{pageSize: 100}} scroll={{ y: 800 }}/>
            <h2>历史调仓</h2>
            <Table dataSource={list} columns={columns} rowKey={columns => columns.index} pagination={{pageSize: 10000}} scroll={{ y: 800 }}/>
        </Spin>
    </div>
}

export default App