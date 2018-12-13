import * as React from "react";
import App from "./App";
import { Router, Route, browserHistory } from "react-router";
import { TAODetails } from "./components/TAODetails/TAODetails";
import { Meet } from "./components/Meet/Meet";

class AppRouter extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" exact component={App} />
				<Route path="/tao/:id" component={TAODetails} />
				<Route path="/meet/:id" component={Meet} />
			</Router>
		);
	}
}

export { AppRouter };
