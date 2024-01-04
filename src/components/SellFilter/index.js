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
        // 2024.01.02评测:回测6年+；实盘1年+；回测年化100%+；实盘年化100%+；
        // let ids = [
        //     "1940772.R.254996897061838",
        //     "5598.R.162680572925185",
        //       "1695870.R.253658166732531",
        //       "1012300.R.170580949014401",
        //       "1279778.R.246117453490728",
        //       "1583483.R.237674887028068",
        //       "2032861.R.247270131703851",
        //       "1452889.R.244756075924928",
        //       "28136.R.246264154553379",
        //       "491607.R.247765135930511",
        // ];
        // 2024.01.02评测:回测6年+；实盘1年+；回测年化80%+；实盘年化80%+；
        // let ids = ['1987658.R.249303189570031', '1006112.R.247834653553473', '1006112.R.252759109103558', '1583483.R.237674887028068', '491607.R.247765135930511', '1741855.R.253795450734562', '2166209.R.254870750849633', '1279778.R.246117453490728', '1050839.R.235160344133016', '2032861.R.247270131703851', '1844365.R.250030975232771', '984097.R.244908735090784', '1937100.R.241474389636598', '521238.R.237836041811035', '1452889.R.244756075924928', '28136.R.246264154553379', '984097.R.244904327390000', '1431826.R.252709438301621', '1865972.R.248234624349974', '5598.R.162680572925185', '521238.R.251386427541501', '521238.R.253534111900120', '1695870.R.250128581892049', '1106650.R.231375607920330', '1012300.R.190764145094543', '204307.R.230228507909440', '1695870.R.253658166732531', '439009.R.250355459000786', '1012300.R.170580949014401', '5598.R.96574918314022', '1113127.R.257438533915168', '1070440.R.156880567349191', '1546304.R.247849136582766', '1006112.R.253290178395278', '1012300.R.188609638776192', '7501.R.176512303332120', '1012300.R.233869078314092', '1940772.R.254996897061838', '16705.R.257330102266758'];
        // 2024.01.03评测:回测6年+；实盘2年+；回测年化100%+；实盘年化80%+；
        let ids = ['5598.R.162680572925185', '1012300.R.170580949014401', '5598.R.96574918314022', '1070440.R.156880567349191', '1012300.R.188609638776192'];

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
            render: (text, row) => {
                return <span>{row.trade_summary.avg_holding_position}</span>;
            },
        },
        {
            title: "月收益中值",
            dataIndex: "monthly_statistics",
            key: "monthly_statistics",
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
            title: "月标准差",
            dataIndex: "monthly_statistics1",
            key: "monthly_statistics1",
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
            title: "最近一年收益",
            dataIndex: "yearly_statistics",
            key: "yearly_statistics",
            render: (text, row) => {
                return (
                    <span>
                        {row.yearly_statistics.sheet_data.meas_data[0][
                            row.yearly_statistics.sheet_data.meas_data[0].length - 2
                        ] * 100}
                        %
                    </span>
                );
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
        {
            title: "回测开始日期",
            dataIndex: "start_date",
            key: "price",
            render: (text, row) => {
                return <span>{row.start_date}</span>;
            },
        },
        {
            title: "实盘开始日期",
            dataIndex: "upd_date",
            key: "price",
            render: (text, row) => {
                return <span>{row.upd_date}</span>;
            },
        },
        {
            title: "实盘天数",
            dataIndex: "price",
            key: "price",
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[8][0]}</span>;
            },
        },
        {
            title: "实盘收益",
            dataIndex: "price",
            key: "price",
            render: (text, row) => {
                return <span>{row.summary2.sheet_data.meas_data[9][0] * 100}%</span>;
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
