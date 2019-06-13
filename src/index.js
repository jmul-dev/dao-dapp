import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { reducers } from "./reducers/";
import "css/index.css";
import { AppRouter } from "./router/";
import * as serviceWorker from "./serviceWorker";
import { AO_CONSTANTS } from "ao-library";

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

/**
 * Listen for external links (have to load via electron)
 */
if (window.chrome && window.chrome.ipcRenderer) {
	document.addEventListener("click", function(event) {
		if (event.target.tagName === "A" && event.target.target === "_blank") {
			event.preventDefault();
			window.chrome.ipcRenderer.send(AO_CONSTANTS.IPC.OPEN_EXTERNAL_LINK, event.target.href);
		} else if (
			event.target.parentElement &&
			event.target.parentElement.tagName === "A" &&
			event.target.parentElement.target === "_blank"
		) {
			event.preventDefault();
			window.chrome.ipcRenderer.send(AO_CONSTANTS.IPC.OPEN_EXTERNAL_LINK, event.target.parentElement.href);
		}
	});
}
