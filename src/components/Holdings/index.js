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
            // 郭丰铭-小市值希望之窗
            user_name: "郭丰铭",
            uid: "19618",
            account_id: "5690",
            value: "19618.R.204022637009833",
            label: "小市值希望之窗",
            time: "13:15"
        }, {
            // 在风中-小市值g1345
            user_name: "在风中",
            uid: "5598",
            account_id: "5200",
            value: "5598.R.162680572925185",
            label: "小市值g1345",
            time: "13:45"
        }, {
            // 在风中-小市值-实时G
            user_name: "在风中",
            uid: "5598",
            account_id: "5200",
            value: "5598.R.301044015109487",
            label: "小市值-实时G",
            time: "14:30"
        }, {
            // 不羁之风-科技小盘轮动精选2号
            user_name: "不羁之风",
            uid: "2019941",
            // account_id: "23904",
            account_id: "27441",
            value: "2019941.R.305312512268852",
            label: "科技小盘轮动精选2号",
            time: "13:30"
        // }, {
        //     // 不羁之风-国九创国九创
        //     user_name: "不羁之风",
        //     uid: "2019941",
        //     // account_id: "23904",
        //     account_id: "27441",
        //     value: "2019941.R.323985435594363",
        //     // value: "2019941.R.305313655477018",
        //     // value: "2019941.R.342186970380705",
        //     // value: "2019941.R.306346502632765",
        //     // value: "2019941.R.305733773398174",
        //     // value: "2019941.R.295108219443517",
        //     label: "国九创国九创",
        //     time: "13:30"
        }, {
            // 不羁之风-中小板科技市场精选7
            user_name: "不羁之风",
            uid: "2019941",
            // account_id: "23904",
            account_id: "27441",
            // value: "2019941.R.305313655477018",
            value: "2019941.R.342186970380705",
            // value: "2019941.R.306346502632765",
            // value: "2019941.R.305733773398174",
            // value: "2019941.R.295108219443517",
            label: "中小板科技市场精选7",
            time: "13:30"
        // }, {
        //     // gy96188-全市场五铢S国九2507优化-2
        //     user_name: "gy96188",
        //     uid: "686240",
        //     account_id: "23846",
        //     value: "686240.R.337455490615018",
        //     label: "全市场五铢S国九2507优化-2",
        //     time: "13:15"
            // value: "686240.R.334285645702528",
            // label: "央企三少（舞）国九2506",
            // time: "14:15"
        }, {
            // 求索88-3只次新2择时_w
            user_name: "求索88",
            uid: "17566",
            account_id: "18013",
            value: "17566.R.291833160952481",
            label: "3只次新2择时_w",
            time: "09:45"
        }, {
            // ijonas-行业妖走
            user_name: "ijonas",
            uid: "2324734",
            account_id: "21706",
            value: "2324734.R.302214984591092",
            label: "行业妖走",
            time: "14:30"
        }, {
            // https://guorn.com/stock/strategy?sid=2451418.R.316688813035409
            // 小舞靓化- 小舞-电子自用
            user_name: "小舞靓化",
            uid: "2451418",
            account_id: "22105",
            value: "2451418.R.331209621573150",
            label: "【九紫离火】科技",
            time: "14:30"
            // value: "2451418.R.330975617229707",
            // label: "【九紫离火】电子",
            // time: "10:00"
            // value: "2451418.R.316688813035409",
            // label: "小舞-电子",
            // time: "10:00"
        }, {
            // 朱培诚-牛气冲天-3股$典藏版
            user_name: "朱培诚",
            uid: "1012300",
            account_id: "18543",
            value: "1012300.R.233869364415671",
            label: "牛气冲天-3股$典藏版",
            time: "13:15"
        }, {
            // 暮山紫-jl全市场10股缩成4股 年化162%
            user_name: "暮山紫",
            uid: "2198339",
            account_id: "20169",
            // value: "2198339.R.288822403681472",
            // label: "jl全市场10股缩成4股 年化162%",
            value: "2198339.R.301697954733820",
            label: "jl全市场10股 110%22hc",
            time: "09:40"
        }, {
            // soontime-超级大盘4股再调优排房t
            user_name: "soontime",
            uid: "724575",
            account_id: "16156",
            value: "724575.R.316732309402489",
            label: "双虎出山新国九tt",
            time: "14:00"
            // value: "724575.R.321138005933067",
            // label: "动起来三四股",
            // time: "14:00"
            // value: "724575.R.303739927643364",
            // label: "二骑绝尘1k排房新国九t",
            // time: "13:45"
            // value: "724575.R.312204969173140",
            // label: "超级大盘二三股",
            // time: "09:45"
            // value: "724575.R.306326684990285",
            // label: "超级大盘四股新国九排房含科",
            // strategy_id: "724575.R.294857625640072",
            // strategy_name: "超级大盘4股再调优排房t",
        }, {
            // 希望之雨-希雨$高稳定高信息10股策略
            user_name: "希望之雨",
            uid: "295937",
            account_id: "13823",
            // value: "295937.R.292774604683421",
            // label: "希雨$中国核心资产5股",
            value: "295937.R.299458266897734",
            label: "希雨$高稳定高信息10股策略",
            time: "13:45"
        }, {
            // 小舞策略-电子行业10股
            user_name: "小舞策略",
            uid: "2404957",
            account_id: "22124",
            value: "2404957.R.307991494404319",
            label: "电子行业10股",
            time: "10:00"
        }, {
            // 非胡爱涨停-高稳定10股策略
            user_name: "非胡爱涨停",
            uid: "260679",
            account_id: "15630",
            value: "260679.R.277407750716702",
            label: "高稳定10股策略",
            time: "14:00"
        }, {
            // 数峰天远-半导体计算机10股择时r63
            user_name: "数峰天远",
            uid: "2247095",
            account_id: "23862",
            value: "2247095.R.325361605703277",
            label: "半导体计算机10股择时r63",
            time: "14:00"
        }, {
            // 量化小子-动量10股
            user_name: "量化小子",
            uid: "1884978",
            account_id: "17055",
            value: "1884978.R.295438708238620",
            label: "动量10股",
            time: "11:30"
        }, {
            // 核袭东京-高收益低回撤
            user_name: "核袭东京",
            uid: "2612510",
            account_id: "22372",
            value: "2612510.R.336750825930425",
            label: "高收益低回撤",
            time: "收盘价"
        }, {
            user_name: "-----------------------",
            uid: "-----------------------",
            account_id: "-----------------------",
            value: "-----------------------",
            label: "-----------------------",
            time: "-----------------------",
        }, {
            // 宋公明-AH比价四五股日调新国九
            user_name: "宋公明",
            uid: "2318801",
            account_id: "18241",
            value: "2318801.R.302986690279376",
            label: "AH比价四五股日调新国九",
            time: "09:45"
        }, {
            // 金玉昌明-超级大盘无创二三股
            user_name: "金玉昌明",
            uid: "2401863",
            account_id: "22349",
            value: "2401863.R.317557129656643",
            label: "超级大盘无创二三股",
            time: "09:45"
        }, {
            // 风控优选-大盘4股低回撤年化30%(万物生一号）
            user_name: "风控优选",
            uid: "2579649",
            account_id: "21945",
            value: "2579649.R.312497183303252",
            label: "大盘4股低回撤年化30%(万物生一号）",
            time: "14:15"
        }, {
            // cy8-数字经济-财务增强20股
            user_name: "cy8",
            uid: "2416551",
            account_id: "22374",
            value: "2416551.R.302307904321591",
            label: "数字经济-财务增强20股",
            time: "14:30"
        }, {
            // 金亦求金-价值为王
            user_name: "金亦求金",
            uid: "2441116",
            account_id: "23522",
            value: "2441116.R.321128217180294",
            label: "价值为王",
            time: "14:30"
        }, {
            // 北京老张-小2行业趋势升级版
            user_name: "北京老张",
            uid: "1183660",
            account_id: "17061",
            value: "1183660.R.299538527118465",
            label: "小2行业趋势升级版",
            time: "14:30"
        }, {
            // 招财猫量化-招财猫-IQ猫5股V4
            user_name: "招财猫量化",
            uid: "1452889",
            account_id: "15631",
            value: "1452889.R.319547018197341",
            label: "招财猫-IQ猫5股V4",
            time: "--:--"
        }, {
            // 宋公明-两个黄鹂新国九
            user_name: "宋公明",
            uid: "2318801",
            account_id: "18241",
            value: "2318801.R.299589768156234",
            label: "两个黄鹂新国九",
            time: "14:30"
        }, {
            // 金玉昌明-超跌反弹无创4股新国九
            user_name: "金玉昌明",
            uid: "2401863",
            account_id: "22349",
            value: "2401863.R.314302162686599",
            label: "超跌反弹无创4股新国九",
            time: "14:30"
        }, {
            // 土豆量化-基金组合1号
            user_name: "土豆量化",
            uid: "2433398",
            account_id: "21908",
            value: "2433398.R.298551905968798",
            label: "基金组合1号",
            time: "10:30"
        }, {
            // Hang_ccccc-10股科技赛道含创
            user_name: "Hang_ccccc",
            uid: "1893461",
            account_id: "18976",
            value: "1893461.R.306018932394342",
            label: "10股科技赛道含创",
            time: "14:30"
        }, {
            // 小舞靓化-【价值稳健】高息10股
            user_name: "小舞靓化",
            uid: "2451418",
            account_id: "22105",
            value: "2451418.R.319410051847750",
            label: "【价值稳健】高息10股",
            time: "14:30"
        }, {
            // 不喜欢了可以改改-2025-1800指数增强择时-0924
            user_name: "不喜欢了可以改改",
            uid: "12302",
            account_id: "5735",
            value: "12302.R.312410265885621",
            label: "2025-1800指数增强择时-0924",
            time: "日均成交价"
            // value: "12302.R.303151459701990",
            // label: "2025-1800指数增强择时-0924",
            // strategy_id: "12302.R.297728398929369",
            // strategy_name: "1800指数增强-0407",
        }, {
            // 差不多就行-5支中小狮子
            user_name: "差不多就行",
            uid: "146303",
            account_id: "21608",
            // value: "146303.R.281801103402666",
            // label: "5支中小狮子",
            value: "146303.R.295792952469616",
            label: "全市场5支踩涨停1",
            time: "14:30"
        },
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
        let select = strategyList.find(e => e.value === value) || {};
        setStrategyObjectData({ ...select, strategy_id: select.value, strategy_name: select.label })
    };

    // 默认选中
    const defaultValue = strategyList[0].value
    useEffect(() => {
        // 模拟页面加载的异步操作，比如数据获取
        setTimeout(() => {
            handleChange(defaultValue)
        }, 100); // 假设页面加载完成需要3秒
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
            <p>user_name: <a
                href={`https://guorn.com/user/home?uid=${strategyObject.uid}&page=talkall`}
                target="_blank"
            >
                {strategyObject.user_name}
            </a></p>
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
            <p>time:{strategyObject.time}</p>
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
