import { Router, Route, hashHistory, IndexRedirect } from 'react-router';

export default () => {

    return (
        <Router history={hashHistory}>
            <Route path="/" component={null}>
                <IndexRedirect to="" />
                <Route>
                    <Route path="index" component={null} />
                </Route>
            </Route>
        </Router>
    )
} 