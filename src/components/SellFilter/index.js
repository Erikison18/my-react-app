import React, { useState } from "react";
import { getData } from "../../common/js/fetch";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin, Table } from "antd";
import "./index.scss";

function App() {
    const [loading, setLoadingData] = useState(false);
    // redux
    const list = useSelector((state) => {
        return state.list;
    });
    const dispatch = useDispatch();
    async function getDetails(id) {
        let getListPatch = await getData("/stock/strategy", {
            fmt: "json",
            sid: id,
            _: 1703835306348,
        });
        return getListPatch;
    }
    async function onClick() {
        setLoadingData(true);
        let ids = [
            "5598.R.162680572925185",
            "1583483.R.237674887028068",
            //   "1279778.R.246117453490728",
            //   "1452889.R.244756075924928",
            //   "28136.R.246264154553379",
            //   "1695870.R.253658166732531",
            //   "2032861.R.247270131703851",
            //   "491607.R.247765135930511",
        ];
        let resList = [];
        for (let index = 0; index < ids.length; index++) {
            const el = ids[index];
            let res = await getDetails(el);
            resList.push(res.data);
        }
        console.log(resList, "resList");
        await dispatch({
            type: "getList",
            payload: resList,
        });
        setLoadingData(false);
    }
    const columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "收益",
            dataIndex: "return_score",
            key: "return_score",
        },
        {
            title: "抗风险",
            dataIndex: "risk_score",
            key: "risk_score",
        },
        {
            title: "流动性",
            dataIndex: "liquidity_score",
            key: "liquidity_score",
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
            title: "年化率",
            dataIndex: "annual_return",
            key: "annual_return",
        },
        {
            title: "最大回撤",
            dataIndex: "max_withdraw",
            key: "max_withdraw",
        },
        {
            title: "夏普比率",
            dataIndex: "sharpe_ratio",
            key: "sharpe_ratio",
        },
        {
            title: "信息比率",
            dataIndex: "summary2",
            key: "summary2",
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[5][0]}</span>;
            },
        },
        {
            title: "收益波动率",
            dataIndex: "summary2",
            key: "summary21",
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[4][0] * 100}%</span>;
            },
        },
        {
            title: "Alpha",
            dataIndex: "summary2",
            key: "summary22",
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[7][0] * 100}%</span>;
            },
        },
        {
            title: "创新高最长天数",
            dataIndex: "summary23",
            key: "summary23",
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[8][0]}</span>;
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
            title: "平均交易收益",
            dataIndex: "avg_trade_return",
            key: "avg_trade_return",
            render: (text, row) => {
                return <span>{row.trade_summary.avg_trade_return}</span>;
            },
        },
        {
            title: "月收益中值",
            dataIndex: "monthly_statistics",
            key: "monthly_statistics",
            render: (text, row) => {
                return <span>{row.monthly_statistics.sheet_data.meas_data[0][row.yearly_statistics.sheet_data.meas_data[0].length - 2] * 100}</span>;
            },
        },
        {
            title: "月标准差",
            dataIndex: "monthly_statistics1",
            key: "monthly_statistics1",
            render: (text, row) => {
                return <span>{row.monthly_statistics.sheet_data.meas_data[0][row.yearly_statistics.sheet_data.meas_data[0].length - 1] * 100}%</span>;
            },
        },
        {
            title: "最近一年收益",
            dataIndex: "yearly_statistics",
            key: "yearly_statistics",
            render: (text, row) => {
                return <span>{row.yearly_statistics.sheet_data.meas_data[0][row.yearly_statistics.sheet_data.meas_data[0].length - 1] * 100}%</span>;
            },
        },
        {
            title: "持仓股票数",
            dataIndex: "ideal_count",
            key: "ideal_count",
            render: (text, row) => {
                return <span>{row.defn.ideal_count}</span>;
            },
        },
        {
            title: "调仓时点",
            dataIndex: "price",
            key: "price",
            render: (text, row) => {
                return <span>{row.defn.price}</span>;
            },
        },
    ];

    return (
        <div>
            <Button onClick={onClick}>onclick fetch</Button>
            <span>{list.length}</span>
            <Spin spinning={loading}>
                <Table
                    dataSource={list}
                    columns={columns}
                    rowKey={(columns) => columns.id}
                    pagination={{ pageSize: 100 }}
                    scroll={{ y: 800 }}
                />
            </Spin>
        </div>
    );
}

export default App;
