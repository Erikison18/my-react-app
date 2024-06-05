import React, { useState } from "react";
import { getData } from "../../common/js/fetch";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin, Table } from "antd";
import "./index.scss";

function App() {
    const [loading, setLoadingData] = useState(false);
    // redux
    const account_id = "21737";//围观盘id
    const strategy_id = "1963841.R.300447300509430";// 策略ids
    let total = 0;
    const [totalAmount, setTotalAmountData] = useState(0);

    const list = useSelector((state) => {
        return state.list;
    });
    const dispatch = useDispatch();
    async function onClick() {
        setLoadingData(true);
        let getListPatch = await getData("trader/holdings", {
            account_id,
            live: 1,
            _: 1717573563447,
        });

        let filterData = (getListPatch.data.holding_list || []).filter((item) => {
            let myReturn = false;
            if (item[strategy_id] > 0) {
                // 有仓位
                myReturn = true;
                total += item[strategy_id] * item["price"]
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
            title: "价格",
            dataIndex: "price",
            key: "price",
            width: 120,
        },
        {
            title: "持有股数",
            dataIndex: "ticker0",
            key: "ticker0",
            render: (text, record) => {
                return record[strategy_id];
            },
            width: 160,
        },
        {
            title: "持有市值",
            dataIndex: "ticker1",
            key: "ticker1",
            width: 120,
            render: (text, record) => {
                return record[strategy_id] * record["price"];
            },
        },
        {
            title: "持有比例",
            dataIndex: "ticker2",
            key: "ticker2",
            width: 120,
            render: (text, record) => {
                return (record[strategy_id] * record["price"]) / totalAmount;
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
            <Button onClick={onClick}>onclick fetch</Button>
            <p>list.length:{list.length}</p>
            <p>totalAmount: {totalAmount}</p>
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
