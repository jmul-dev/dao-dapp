import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { reducers } from "./reducers/";
import "./index.css";
import { AppRouter } from "./router/";
import * as serviceWorker from "./serviceWorker";

const store = createStore(reducers);

const env = process.env.NODE_ENV || "unknown";

ReactDOM.render(
	<Provider store={store}>
		<AppRouter store={store} env={env} />
	</Provider>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
