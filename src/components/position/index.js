import React, { useState } from "react";
import { getData } from "../../common/js/fetch";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin, Table } from "antd";
import "./index.scss";

function App() {
    const [loading, setLoadingData] = useState(false);
    const [total, setTotalData] = useState({});
    // redux
    const list = useSelector((state) => {
        return state.list;
    });
    const dispatch = useDispatch();
    async function onClick() {
        setLoadingData(true);
        let filterData = [
            '423.R.79459948017710',
            '19618.R.204022637009833',
            // '146303.R.281801103402666',
            // '146303.R.295792952469616',
            '260679.R.277407750716702',
            '521238.R.297432708073366',
            // '828326.R.289293697353718',
            '1844365.R.260104575065819',
            '1988780.R.248201731546738',
            '2156774.R.271699894333487',
            // '2211548.R.305049047131441',
            // '2324734.R.302476411904396',
            '2451418.R.305501482507007',
        ]
        console.log(filterData, "filterData");

        // 调详情接口，取详情数据时
        const asyncMap = async (array, asyncFunc) => {
            const results = await Promise.all(
                array.map(async (item) => {
                    return await asyncFunc(item);
                })
            );
            return results;
        };
        const delayedSquares = asyncMap(filterData, async (id) => {
            let strategy = await getData("/stock/strategy", {
                fmt: "json",
                sid: id,
                _: 1733462294511,
            });
            console.log(strategy.data)
            if (strategy.data.redirect) {
                // 有重定向
                strategy = await getData(strategy.data.redirect, {
                    fmt: "json",
                    sid: id,
                    _: 1733462294511,
                });
            }

            return {
                id,
                ...(strategy.data || {}),
            };
        });
        // 使用async/await等待结果
        (async () => {
            const squares = await delayedSquares;
            console.log(squares, "squares"); // 输出
            let total = {};
            let avg_holding_position = 0;
            let now_holding_position = 0;
            squares.map(row => {
                console.log(row, "row")
                avg_holding_position += parseFloat(row.trade_summary.avg_holding_position)
                now_holding_position += parseFloat(row.position_chart.sheet_data.meas_data[0][
                    row.position_chart.sheet_data.meas_data[0].length - 1
                ])
            })
            avg_holding_position = avg_holding_position / squares.length;
            now_holding_position = now_holding_position / squares.length;
            total = { name: "合计", avg_holding_position, now_holding_position }
            setTotalData(total)

            await dispatch({
                type: "getList",
                payload: squares,
            });
            setLoadingData(false);
        })();
    }
    let columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            fixed: "left",
            width: 100,
        },
        /*eslint-disable*/
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 60,
            fixed: "left",
            render: (text) => {
                return (
                    <a
                        href={`https://guorn.com/stock/strategy?sid=${text}`}
                        target="_blank"
                    >
                        链接
                    </a>
                );
            },
        },
        /*eslint-disable*/
        {
            title: "总分",
            dataIndex: "score",
            key: "score",
            width: 70,
            render: (text) => {
                return <span>{parseFloat(text || '0').toFixed(2)}</span>;
            },
        },
        {
            title: "作者",
            dataIndex: "username",
            key: "username",
            width: 100,
            render: (text, record) => {
                return (
                    <a
                        href={`https://guorn.com/user/home?uid=${record.uid || "001"}&page=talkall`}
                        target="_blank"
                    >
                        {text}
                    </a>
                );
            },
        },
        {
            title: "回测起始日期",
            dataIndex: "start_date",
            key: "start_date",
            width: 110,
        },
        {
            title: "年化率",
            dataIndex: "annual_return",
            key: "annual_return",
            width: 100,
        },
        {
            title: "最大回撤",
            dataIndex: "max_withdraw",
            key: "max_withdraw",
            width: 100,
            render: (text, row) => {
                return <span className="orange">{text}</span>;
            },
        },
        {
            title: "夏普比率",
            dataIndex: "sharpe_ratio",
            key: "sharpe_ratio",
            width: 100,
        },
        {
            title: "实盘天数",
            dataIndex: "real_days",
            key: "real_days",
        },
        {
            title: "实盘收益",
            dataIndex: "real_return",
            key: "real_return",
        },
        {
            title: "实盘年化率",
            dataIndex: "live_annual_return",
            key: "live_annual_return",
        },
        {
            title: "实盘超额收益",
            dataIndex: "live_excess_return",
            key: "live_excess_return",
        },
        {
            title: "持仓股票数",
            dataIndex: "cnt",
            key: "cnt",
        },
        {
            title: "资金容量",
            dataIndex: "mall_capacity",
            key: "mall_capacity",
        },
        {
            title: "最近一年收益",
            dataIndex: "year_return",
            key: "year_return",
        },
        {
            title: "最近一季收益",
            dataIndex: "quarter_return",
            key: "quarter_return",
        },
        {
            title: "最近一月收益",
            dataIndex: "month_return",
            key: "month_return",
        },
        {
            title: "下一个交易日",
            dataIndex: "next_trade_date",
            key: "next_trade_date",
            width: 100,
        },
        {
            title: "交易模型",
            dataIndex: "model",
            key: "model",
        },
        {
            title: "标签",
            dataIndex: "tag",
            key: "tag",
        },
        {
            title: "描述",
            dataIndex: "desc",
            key: "desc",
            width: 100,
            ellipsis: true,
        },
    ];

    const lowVolatilityColumns = [
        {
            title: "收益分",
            dataIndex: "return_score",
            key: "return_score",
        },
        {
            title: "抗风险",
            dataIndex: "risk_score",
            key: "risk_score",
        },
        {
            title: "稳定性",
            dataIndex: "stability_score",
            key: "stability_score",
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
            width: 60,
            render: (text, row) => {
                return <span>{row.defn ? row.defn.timing : '-'}</span>;
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
                return <span className="red">{row.avg_holding_position || row.trade_summary.avg_holding_position}</span>;
            },
        },
        {
            title: "当前持仓仓位",
            dataIndex: "position_chart",
            key: "position_chart",
            width: 100,
            render: (text, row) => {
                return (
                    <span className="red">
                        {
                            row.now_holding_position ||
                            row.position_chart.sheet_data.meas_data[0][
                            row.position_chart.sheet_data.meas_data[0].length - 1
                            ]
                        }
                    </span>
                );
            },
        },
        {
            title: "当前换股率",
            dataIndex: "turnover_chart",
            key: "turnover_chart",
            width: 100,
            render: (text, row) => {
                return (
                    <span>
                        {
                            row.turnover_chart ?
                                row.turnover_chart.sheet_data.meas_data[0][
                                row.turnover_chart.sheet_data.meas_data[0].length - 1
                                ] : "-"
                        }
                    </span>
                );
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
                return <span>{text * 100}</span>;
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

    columns = [...columns, ...lowVolatilityColumns];

    return (
        <div>
            <Button onClick={onClick}>onclick fetch</Button>
            <p>length：{list.length}</p>
            <p>合计-平均持仓仓位：{total.avg_holding_position} </p>
            <p>合计-当前持仓仓位：{total.now_holding_position} </p>
            <br />
            <Spin spinning={loading}>
                <Table
                    dataSource={list}
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={{ pageSize: 100 }}
                    scroll={{ y: 800, x: 5000 }}
                />
            </Spin>
        </div>
    );
}

export default App;
