import * as React from "react";
import * as Web3 from "web3";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

// Router
import { AppContainer } from "../components/App/";
import { Login } from "../components/Login";
import { TAODetails } from "../components/TAODetails/TAODetails";
import { Meet } from "../components/Meet/Meet";
import { Ide } from "../components/Ide/Ide";

import { web3Connected, setAccounts, setNetworkId } from "./actions";
import { web3Errors } from "../common/errors";

// Contracts
import { abi as NameFactoryABI, networks as NameFactoryNetworks } from "../contracts/NameFactory.json";

import { setError } from "../widgets/Toast/actions";

const promisify = require("tiny-promisify");

class AppRouter extends React.Component {
	async componentDidMount() {
		const { store, env } = this.props;
		const dispatch = store.dispatch;

		let web3;
		try {
			web3 = await this.instantiateWeb3(env);
		} catch (e) {
			dispatch(setError("Oops!", e.message, true));
			return;
		}

		try {
			this.validateConnection(web3);
			dispatch(web3Connected(web3));

			const networkId = await this.getNetworkId(web3);
			dispatch(setNetworkId(networkId));

			const accounts = await this.getAccounts(web3);
			dispatch(setAccounts(accounts));

			// TODO!!!
			const contracts = this.instantiateContracts(web3);
		} catch (e) {
			dispatch(setError("Oops!", e.message, true));
		}
	}

	async instantiateWeb3(env) {
		let web3;
		if (typeof window.web3 !== "undefined") {
			web3 = await new Web3(window.web3.currentProvider);
		} else if (env === "development" || env === "test") {
			web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		} else {
			throw new Error(web3Errors.UNABLE_TO_FIND_WEB3_PROVIDER);
		}
		return web3;
	}

	validateConnection(web3) {
		if (!web3.isConnected()) {
			throw new Error(web3Errors.UNABLE_TO_CONNECT_TO_NETWORK);
		}
	}

	async getNetworkId(web3) {
		const networkIdString = await promisify(web3.version.getNetwork)();
		const networkId = parseInt(networkIdString, 10);
		if (networkId === 1985) {
			return networkId;
		} else {
			throw new Error(web3Errors.UNSUPPORTED_NETWORK);
		}
	}

	async getAccounts(web3) {
		const accounts = await promisify(web3.eth.getAccounts)();
		if (!accounts.length) {
			throw new Error(web3Errors.UNABLE_TO_FIND_ACCOUNTS);
		}
		return accounts;
	}

	instantiateContracts(web3) {
		//	const nameFactory = web3.eth.contract(abi).at(networks[this.state.networkId].address);
	}

	render() {
		const history = syncHistoryWithStore(hashHistory, this.props.store);

		return (
			<Router history={history}>
				<Route path="/">
					<IndexRoute component={AppContainer} />
					<Route path="/tao/:id" component={TAODetails} />
					<Route path="/meet/:id" component={Meet} />
					<Route path="/ide/:id" component={Ide} />
				</Route>
			</Router>
		);
	}
}

export { AppRouter };
