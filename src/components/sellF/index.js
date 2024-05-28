/* eslint-disable */
import React, { useState } from 'react'
import { getData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin, Table } from 'antd';
import "./index.scss"

// 数字数组去掉最大值取平均
const calculateAverageWithoutMax = (numbers) => {
    // 对数组进行升序排序
    numbers.sort((a, b) => a - b);
    // 去掉最大值
    numbers.pop();
    // 计算剩余数字的平均值
    const sum = numbers.reduce((total, num) => total + num, 0);
    const average = sum / numbers.length;
    return average;
}

function App() {
    const [loading, setLoadingData] = useState(false);
    const TableType = "lowVolatility"; // normaml 正常 || lowVolatility 小市值低波动 || stableDividend 稳定红利
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
        let ids = [];
        let filterData = (getListPatch.strategy_list || []).filter((item) => {
            let myReturn = false;
            let d = new Date(item.start_date);
            let dt = new Date("2018/01/01");
            if (d.getTime() > dt.getTime()) {
                myReturn = false;
                // } else if (item.score > 65 && item.sharpe_ratio > 3 && parseFloat(item.max_withdraw) < 40) {
                // } else if (item.score > 70 && item.sharpe_ratio > 3) {
                // } else if (item.sharpe_ratio > 4) {
                // } else if (parseInt(item.max_withdraw) < 20) {
                // } else if (parseInt(item.real_return) > 400) {
                // } else if (parseInt(item.live_excess_return) > 400) {
                // } else if (parseInt(item.year_return) > 100) {
                // } else if (item.score > 75 && item.sharpe_ratio > 3.5) {
                // } else if (parseInt(item.cnt) > 10) {
            } else if (parseInt(item.real_days) < 365) {
                myReturn = false;
            } else if (parseInt(item.max_withdraw) > 30) {
                myReturn = false;
            } else if (TableType === 'stableDividend' && parseInt(item.max_withdraw) > 20) {
                myReturn = false;
            } else if (TableType === 'stableDividend' && parseInt(item.live_annual_return) > 20 && parseInt(item.annual_return) > 20) {
                ids.push(item.id)
                myReturn = true;
            } else if (parseInt(item.live_annual_return) > 60 && parseInt(item.annual_return) > 80 && item.score > 65 && item.sharpe_ratio > 2) {
                ids.push(item.id)
                myReturn = true;
            } else {
                myReturn = false;
            }
            return myReturn;
        });
        // ids = ['489244.R.262653878598528', '1183660.R.263132236046055', '1279778.R.263573089073150', '1300960.R.266930384285073', '1873010.R.263348862734458', '1012300.R.233869078314092', '1992979.R.266436350686359', '1987658.R.246118064821010']
        ids = [
            '489244.R.262653878598528',
            '1183660.R.263132236046055',
            '1279778.R.263573089073150',
            // '1300960.R.266930384285073',
            '1873010.R.263348862734458',
            '1012300.R.233869078314092',
            '1992979.R.266436350686359',
            '1987658.R.246118064821010'
        ]
        // ids固定
        filterData = filterData.filter((item) => {
            return ids.includes(item.id);
        })
        console.log(filterData, 'filterData-filter')
        console.log(ids, 'ids')

        if (TableType === 'lowVolatility' || TableType === 'stableDividend') {
            // 调详情接口，取详情数据时
            const asyncMap = async (array, asyncFunc) => {
                const results = await Promise.all(array.map(async item => {
                    return await asyncFunc(item);
                }));
                return results;
            };
            const delayedSquares = asyncMap(ids, async (e) => {
                let strategy = await getData('/stock/strategy', {
                    fmt: "json",
                    sid: e,
                    _: 1636450021980,
                });
                let arrYear = strategy.data.year_chart.sheet_data.meas_data[1];
                arrYear.pop();
                let avgYears = calculateAverageWithoutMax(arrYear);

                return {
                    ...e,
                    ...(strategy.data || {}),
                    avgYears,
                };
            });
            // 使用async/await等待结果
            (async () => {
                const squares = await delayedSquares;
                console.log(squares); // 输出
                await dispatch({
                    type: 'getList',
                    payload: squares
                });
                setLoadingData(false)
            })();
        } else {
            // 不调详情接口，取详情数据时
            await dispatch({
                type: 'getList',
                payload: filterData
            });
            setLoadingData(false)
        }
    }
    let columns = [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
        },
        /*eslint-disable*/
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            fixed: 'left',
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
            title: '作者',
            dataIndex: 'user_name',
            key: 'user_name',
            render: (text, record) => {
                return <a href={`https://guorn.com/user/home?uid=${record.uid}&page=talkall`} target="_blank">{text}</a>;
            },
        },
        {
            title: '回测起始日期',
            dataIndex: 'start_date',
            key: 'start_date',
            width: 100,
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
            title: '持仓股票数',
            dataIndex: 'cnt',
            key: 'cnt',
        },
        {
            title: '资金容量',
            dataIndex: 'mall_capacity',
            key: 'mall_capacity',
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
            title: '下一个交易日',
            dataIndex: 'next_trade_date',
            key: 'next_trade_date',
            width: 100,
        },
        // {
        //     title: '起势分数',
        //     dataIndex: 'trend_score',
        //     key: 'trend_score',
        // },
        {
            title: '交易模型',
            dataIndex: 'model',
            key: 'model',
        },
        {
            title: '标签',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            width: 100,
            ellipsis: true
        },
    ];

    const lowVolatilityColumns = [
        {
            title: "收益分",
            dataIndex: "return_score",
            key: "return_score",
        },
        {
            title: '抗风险',
            dataIndex: 'risk_score',
            key: 'risk_score',
        },
        {
            title: '稳定性',
            dataIndex: 'stability_score',
            key: 'stability_score',
        },
        {
            title: "实盘",
            dataIndex: "real_score",
            key: "real_score",
        },
        {
            title: "信息比率",
            dataIndex: "summary2",
            key: "summary2",
            width: 100,
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[5][0]}</span>;
            },
        },
        {
            title: "收益波动率",
            dataIndex: "summary2",
            key: "summary21",
            width: 100,
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[4][0] * 100}%</span>;
            },
        },
        {
            title: "Alpha",
            dataIndex: "summary2",
            key: "summary22",
            width: 100,
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[7][0] * 100}%</span>;
            },
        },
        {
            title: "创新高最长天数",
            dataIndex: "maxdrop_day",
            key: "maxdrop_day",
            render: (text, row) => {
                return <span>{row.trade_summary.maxdrop_day}</span>;
            },
        },
        {
            title: "平均持有天数",
            dataIndex: "trade_summary",
            key: "trade_summary",
            render: (text, row) => {
                return <span>{row.trade_summary.avg_holding_days}</span>;
            },
        },
        {
            title: "交易赢率",
            dataIndex: "win_ratio",
            key: "win_ratio",
            render: (text, row) => {
                return <span>{row.trade_summary.win_ratio}</span>;
            },
        },
        {
            title: "换股次数",
            dataIndex: "sell_count",
            key: "sell_count",
            render: (text, row) => {
                return <span>{row.trade_summary.sell_count}</span>;
            },
        },
        {
            title: "停牌股票比例",
            dataIndex: "suspend_ratio",
            key: "suspend_ratio",
            render: (text, row) => {
                return <span>{row.trade_summary.suspend_ratio}</span>;
            },
        },
        {
            title: "大盘择时",
            dataIndex: "timing",
            key: "timing",
            render: (text, row) => {
                return <span>{row.defn.timing}</span>;
            },
        },
        {
            title: "平均交易收益",
            dataIndex: "avg_trade_return",
            key: "avg_trade_return",
            render: (text, row) => {
                return <span>{row.trade_summary.avg_trade_return}</span>;
            },
        },
        {
            title: "平均持仓仓位",
            dataIndex: "avg_holding_position",
            key: "avg_holding_position",
            width: 100,
            render: (text, row) => {
                return <span>{row.trade_summary.avg_holding_position}</span>;
            },
        },
        {
            title: "当前持仓仓位",
            dataIndex: "position_chart",
            key: "position_chart",
            width: 100,
            render: (text, row) => {
                return <span className='red'>{row.position_chart.sheet_data.meas_data[0][row.position_chart.sheet_data.meas_data[0].length - 1]}</span>
            },
        },
        {
            title: "当前换股率",
            dataIndex: "turnover_chart",
            key: "turnover_chart",
            render: (text, row) => {
                return <span>{row.turnover_chart.sheet_data.meas_data[0][row.turnover_chart.sheet_data.meas_data[0].length - 1]}</span>
            },
        },
        {
            title: "月收益中值",
            dataIndex: "monthly_statistics",
            key: "monthly_statistics",
            width: 100,
            render: (text, row) => {
                return (
                    <span>
                        {row.monthly_statistics.sheet_data.meas_data[0][
                            row.monthly_statistics.sheet_data.meas_data[0].length - 2
                        ] * 100}
                    </span>
                );
            },
        },
        {
            title: "年收益去大取平均",
            dataIndex: "avgYears",
            key: "avgYears",
            width: 100,
            render: (text) => {
                return (
                    <span>
                        {text * 100}
                    </span>
                );
            },
        },
        {
            title: "月标准差",
            dataIndex: "monthly_statistics1",
            key: "monthly_statistics1",
            width: 100,
            render: (text, row) => {
                return (
                    <span>
                        {row.monthly_statistics.sheet_data.meas_data[0][
                            row.monthly_statistics.sheet_data.meas_data[0].length - 1
                        ] * 100}
                        %
                    </span>
                );
            },
        },
        {
            title: "调仓时点",
            dataIndex: "price",
            key: "price",
            width: 100,
            render: (text, row) => {
                return <span>{row.defn.price}</span>;
            },
        },
    ];
    if (TableType === 'lowVolatility' || TableType === 'stableDividend') {
        columns = [...columns, ...lowVolatilityColumns];
    }

    return <div>
        <Button onClick={onClick}>onclick fetch</Button><span>{list.length}</span>
        <Spin spinning={loading}>
            <Table dataSource={list} columns={columns} rowKey={columns => columns.id} pagination={{ pageSize: 100 }} scroll={{ y: 800, x: 2500 }} />
        </Spin>
    </div>
}

export default App