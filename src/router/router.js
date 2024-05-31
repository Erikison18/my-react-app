import React, { Suspense, lazy }from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
// import GameChess from "../components/gameChess";
// import CoreContent from "../components/coreContent";
// import SeniorGuidance from "../components/seniorGuidance";
const Sell = lazy(() => import('../components/sell'));
const SellF = lazy(() => import('../components/sellF'));
const SellFilter = lazy(() => import('../components/SellFilter'));
const TradeHistory = lazy(() => import('../components/tradeHistory'));
const Instruction = lazy(() => import('../components/instruction'));
const Performance = lazy(() => import('../components/performance'));
const Rtquery = lazy(() => import('../components/rtquery'));

const BasicRoute = () => (
    <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/sell" push />} />
                <Route exact path="/sell" component={Sell}/>
                <Route exact path="/sellF" component={SellF}/>
                <Route exact path="/sellFilter" component={SellFilter}/>
                <Route exact path="/tradeHistory" component={TradeHistory}/>
                <Route exact path="/instruction" component={Instruction}/>
                <Route exact path="/performance" component={Performance}/>
                <Route exact path="/rtquery" component={Rtquery}/>
            </Switch>
        </Suspense>
    </HashRouter>
);

export default BasicRoute;
