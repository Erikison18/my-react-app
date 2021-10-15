import React, { useState, useEffect } from 'react'
import { getData } from '../../common/js/fetch'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Spin } from 'antd';
import "./index.scss"

function App() {
    const [loading, setLoadingData] = useState(false);
    const [catData, setCatData] = useState({ id: "", url: "" });
    const [catListData, setCatListData] = useState([]);
    useEffect(async() => {
        // "proxy": "https://thatcopy.pw",
        fetch('https://thatcopy.pw/catapi/rest/').then((response) => {
            let promise = response.json();
            promise.then((catData) => {
                // console.log(catData, 99)
                setCatData(catData);
            });
        });
        let catListDataNew = await getData('https://cat-fact.herokuapp.com/facts/random', { type: "cat", amount: 6 })
        // console.log("catListData", catListData);
        console.log("catListDataNew--", catListDataNew);
        setCatListData(catListDataNew);
        // console.log("catListData--22", catListData);
    }, []);
    // redux
    const count = useSelector(state => {
        return state.number.number
    });
    const list = useSelector(state => {
        return state.list
    });
    const dispatch = useDispatch();
    async function onClick() {
        // console.log(list);
        setLoadingData(true)
        let getListPatch = await getData('https://cat-fact.herokuapp.com/facts/random', { animal_type: "cat", amount: 4 })
        console.log(getListPatch);
        await dispatch({
            type: 'getList',
            payload: getListPatch
        });
        setLoadingData(false)
        // console.log(list);
    }

    return <div>
        <h3>Fetch</h3>
        <h5>id: {catData.id}</h5>
        <img src={catData.url} className="cat-img"></img>
        <ul>
            {
                catListData.map((item) => {
                    return (<li key={item._id}>
                        {item.text}
                    </li>)
                })
            }
        </ul>
        <h3>Redux</h3>
        <p>
            <span>{count}</span>
            <button onClick={() => dispatch({type: 'reduceCount', count})}>-</button>
            <button onClick={() => dispatch({type: 'addCount', count})}>+</button>
        </p>
        <Button onClick={onClick}>onclick fetch</Button>
        <Spin spinning={loading}>
            <ul>
                    {
                        list.map((item) => {
                            return (<li key={item._id}>
                                {item.text}
                            </li>)
                        })
                    }
            </ul>
        </Spin>
    </div>
}

export default App