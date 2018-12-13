import * as React from "react";
import App from "./App";
import { Router, Route, browserHistory } from "react-router";
import { TAODetails } from "./components/TAODetails/TAODetails";

class AppRouter extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" exact component={App} />
				<Route path="/tao/:id" component={TAODetails} />
			</Router>
		);
	}
}

export { AppRouter };
