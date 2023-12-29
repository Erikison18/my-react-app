import React, { Suspense, lazy }from 'react';
import {HashRouter, Route, Switch, Redirect} from 'react-router-dom';
// import GameChess from "../components/gameChess";
// import CoreContent from "../components/coreContent";
// import SeniorGuidance from "../components/seniorGuidance";
const GameChess = lazy(() => import('../components/gameChess/index.tsx'));
const CoreContent = lazy(() => import('../components/coreContent'));
const SeniorGuidance = lazy(() => import('../components/seniorGuidance'));
const Api = lazy(() => import('../components/api'));
const Hook = lazy(() => import('../components/hook'));
const Faq = lazy(() => import('../components/faq'));
const Redux = lazy(() => import('../components/redux'));
const Strategy = lazy(() => import('../components/strategy'));
const Sell = lazy(() => import('../components/sell'));
const SellFilter = lazy(() => import('../components/SellFilter'));
const TradeHistory = lazy(() => import('../components/tradeHistory'));
const Instruction = lazy(() => import('../components/instruction'));
const Performance = lazy(() => import('../components/performance'));
const Rtquery = lazy(() => import('../components/rtquery'));

class About extends React.Component{
    render() {
      return <h3>About</h3>
    }
}

const BasicRoute = () => (
    <HashRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <Switch>
                <Route exact path="/" render={() => <Redirect to="/sell" push />} />
                <Route exact path="/gameChess" component={GameChess}/>
                <Route exact path="/coreContent" component={CoreContent}/>
                <Route exact path="/seniorGuidance" component={SeniorGuidance}/>
                <Route exact path="/api" component={Api}/>
                <Route exact path="/hook" component={Hook}/>
                <Route exact path="/faq" component={Faq}/>
                <Route exact path="/redux" component={Redux}/>
                <Route exact path="/about" component={About}/>
                <Route exact path="/strategy" component={Strategy}/>
                <Route exact path="/sell" component={Sell}/>
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
