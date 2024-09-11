import React, { useState, useEffect } from "react";
import { getData } from "../../common/js/fetch";
import { useSelector, useDispatch } from "react-redux";
import { Select, Button, Spin, Table } from "antd";
import "./index.scss";

function App() {
    const [loading, setLoadingData] = useState(false);

    // let account_id = '';//围观盘id
    // let strategy_id = '';// 策略ids
    // let strategy_name = '';//策略名
    let strategyList = [
        {
            // soontime-超级大盘4股再调优排房t
            account_id: "16156",
            value: "724575.R.306326684990285",
            label: "超级大盘四股新国九排房含科",
            // strategy_id: "724575.R.294857625640072",
            // strategy_name: "超级大盘4股再调优排房t",
        }, {
            // 不喜欢了可以改改-2024-1800指数增强-0609-1
            account_id: "5735",
            value: "12302.R.303151459701990",
            label: "2024-1800指数增强-0609-1",
            // strategy_id: "12302.R.297728398929369",
            // strategy_name: "1800指数增强-0407",
        }, {
            // 希望之雨-希雨$中国核心资产5股
            account_id: "13823",
            value: "295937.R.292774604683421",
            label: "希雨$中国核心资产5股",
        }, {
            // 差不多就行-5支中小狮子
            account_id: "21608",
            value: "146303.R.281801103402666",
            label: "5支中小狮子",
        }
    ];
    // redux
    // let strategyObject = {
    // 中神通-价值白马低波精选V1.11-3
    // account_id: "21737",
    // strategy_id: "1963841.R.300447300509430",
    // strategy_name: "价值白马低波精选V1.11-3",

    // soontime-小舞-长乐未央
    // account_id: "21845",
    // strategy_id: "2451418.R.303158813210240",
    // strategy_name: "小舞-长乐未央",
    // strategy_id: "2451418.R.303547478264033",
    // strategy_name: "小舞-稳如老狗",
    // strategy_id: "2451418.R.306052190067946",
    // strategy_name: "小舞-你是电你是光",

    // 非胡爱涨停-高稳定10股策略
    // account_id: "15630",
    // strategy_id: "260679.R.277407750716702",
    // strategy_name: "高稳定10股策略",

    // 价值涅槃-科技电子赛道10股2019
    // account_id: "21757",
    // strategy_id: "1006112.R.279887763174985",
    // strategy_name: "科技电子赛道10股2019",

    // 金玉昌明-大中盘为主无创四五股新国九
    // account_id: "19795",
    // strategy_id: "2401863.R.300103034470417",
    // strategy_name: "大中盘为主无创四五股新国九",

    // 宋公明-AH比价四五股2017对冲版
    // account_id: "18241",
    // strategy_id: "2318801.R.283480938374323",
    // strategy_name: "AH比价四五股2017对冲版",

    // 在风中-小市值g1345
    // account_id: "5200",
    // strategy_id: "5598.R.162680572925185",
    // strategy_name: "小市值g1345",

    // ksong-小市值20只（new2择时）
    // account_id: "20910",
    // strategy_id: "423.R.300930249180282",
    // strategy_name: "小市值20只（new2择时）",
    // }
    let total = 0;
    const [totalAmount, setTotalAmountData] = useState(0);
    const [strategy_info, setStrategyInfoData] = useState({});
    const [strategyObject, setStrategyObjectData] = useState({});

    const list = useSelector((state) => {
        return state.list;
    });
    const dispatch = useDispatch();

    const handleChange = (value) => {
        let selected = strategyList.find(e => e.value === value) || {};
        setStrategyObjectData({ ...selected, strategy_id: selected.value, strategy_name: selected.label })
    };

    // 默认选中
    const defaultValue = "724575.R.306326684990285"
    useEffect(() => {
        // 模拟页面加载的异步操作，比如数据获取
        setTimeout(() => {
            handleChange(defaultValue)
        }, 1000); // 假设页面加载完成需要3秒
    }, []);

    async function onClick() {
        setLoadingData(true);
        let getListPatch = await getData("trader/holdings", {
            account_id: strategyObject.account_id,
            live: 1,
            _: 1717573563447,
        });

        let filterData = (getListPatch.data.holding_list || []).filter((item) => {
            let myReturn = false;
            if (item[strategyObject.strategy_id] > 0) {
                // 有仓位
                myReturn = true;
                total += item[strategyObject.strategy_id] * item["price"]
                setTotalAmountData(total);
            } else {
                myReturn = false;
            }
            return myReturn;
        });
        console.log(filterData, "filterData");

        await dispatch({
            type: 'getList',
            payload: filterData
        });


        let _info = (getListPatch.data.holding_summary || []).find((item) => {
            return item.strategy_id === strategyObject.strategy_id;
        });
        setStrategyInfoData(_info || {});
        console.log(_info, "_info");

        setLoadingData(false)
    }
    let columns = [
        {
            title: "名称",
            dataIndex: "name",
            key: "name",
            width: 120,
            fixed: "left",
        },
        /*eslint-disable*/
        {
            title: "代码",
            dataIndex: "ticker",
            key: "ticker",
            width: 120,
            render: (text) => {
                return (
                    <a
                        href={`https://guorn.com/stock/strategy?sid=${text}`}
                        target="_blank"
                    >
                        {text}
                    </a>
                );
            },
        },
        /*eslint-disable*/
        {
            title: "行业",
            dataIndex: "group",
            key: "group",
            width: 120,
        },
        {
            title: "当日涨幅",
            dataIndex: "today_pct",
            key: "today_pct",
            width: 120,
            render: (text, record) => {
                return record['today_pct'] * 100;
            },
        },
        {
            title: "价格",
            dataIndex: "price",
            key: "price",
            width: 120,
        },
        // {
        //     title: "持有股数(other)",
        //     dataIndex: "other",
        //     key: "other",
        //     width: 120,
        // },
        {
            title: "持有市值",
            dataIndex: "value",
            key: "value",
            width: 120,
        },
        {
            title: "持有股数",
            dataIndex: "ticker0",
            key: "ticker0",
            render: (text, record) => {
                return record[strategyObject.strategy_id];
            },
            width: 160,
        },
        {
            title: "持有市值(计算)",
            dataIndex: "ticker1",
            key: "ticker1",
            width: 120,
            render: (text, record) => {
                return record[strategyObject.strategy_id] * record["price"];
            },
        },
        {
            title: "持有比例(计算)",
            dataIndex: "ticker2",
            key: "ticker2",
            width: 120,
            render: (text, record) => {
                return (record[strategyObject.strategy_id] * record["price"]) / totalAmount;
            },
        },
        {
            title: "描述",
            dataIndex: "info",
            key: "info",
            width: 100,
            ellipsis: true,
        },
    ];

    return (
        <div>
            <Select
                defaultValue={defaultValue}
                style={{ width: 300 }}
                onChange={handleChange}
                options={strategyList}
            />
            <Button onClick={onClick}>onclick fetch</Button>
            <p>account_id: <a
                href={`https://guorn.com/trader/home?live=1&id=${strategyObject.account_id}`}
                target="_blank"
            >
                {strategyObject.account_id}
            </a></p>
            <p>strategy_name: <a
                href={`https://guorn.com/stock/strategy?sid=${strategyObject.strategy_id}`}
                target="_blank"
            >
                {strategyObject.strategy_name}
            </a></p>
            <p>list.length:{list.length - 1}</p>
            <p>totalAmount: {totalAmount}</p>
            <p>strategy_info仓位: {strategy_info.position * 100}</p>
            <p>strategy_info今日涨幅: {strategy_info.today_pct * 100}</p>

            <Spin spinning={loading}>
                <Table
                    dataSource={list}
                    columns={columns}
                    rowKey={(columns) => columns.name}
                    pagination={{ pageSize: 100 }}
                    scroll={{ y: 800 }}
                />
            </Spin>
        </div>
    );
}

export default App;
