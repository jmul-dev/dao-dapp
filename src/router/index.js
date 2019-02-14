import * as React from "react";
import * as Web3 from "web3";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

// Router
import { AppContainer } from "components/App/";
import { EnsureCreateNameContainer } from "components/EnsureCreateName/";
import { NameProfileContainer } from "components/NameProfile/";
import { TAODetails } from "components/TAODetails/TAODetails";
import { Meet } from "components/Meet/Meet";
import { Ide } from "components/Ide/Ide";

import {
	web3Connected,
	setAccounts,
	setNetworkId,
	setNameAccountRecovery,
	setNameFactory,
	setNamePublicKey,
	setNameTAOLookup,
	setNameTAOPosition,
	setNameTAOVault,
	setEthos,
	setPathos,
	setLogos,
	setAOIon,
	setNames,
	appendName
} from "./actions";
import { web3Errors } from "common/errors";

// Contracts
import NameAccountRecovery from "contracts/NameAccountRecovery.json";
import NameFactory from "contracts/NameFactory.json";
import NamePublicKey from "contracts/NamePublicKey.json";
import NameTAOLookup from "contracts/NameTAOLookup.json";
import NameTAOPosition from "contracts/NameTAOPosition.json";
import NameTAOVault from "contracts/NameTAOVault.json";
import Ethos from "contracts/Ethos.json";
import Pathos from "contracts/Pathos.json";
import Logos from "contracts/Logos.json";
import AOIon from "contracts/AOIon.json";

import { setError } from "widgets/Toast/actions";

import { getTransactionReceipt } from "utils/";

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

			const nameAccountRecovery = this.instantiateContract(web3, networkId, NameAccountRecovery.abi, NameAccountRecovery.networks);
			dispatch(setNameAccountRecovery(nameAccountRecovery));

			const nameFactory = this.instantiateContract(web3, networkId, NameFactory.abi, NameFactory.networks);
			dispatch(setNameFactory(nameFactory));

			const namePublicKey = this.instantiateContract(web3, networkId, NamePublicKey.abi, NamePublicKey.networks);
			dispatch(setNamePublicKey(namePublicKey));

			const nameTAOLookup = this.instantiateContract(web3, networkId, NameTAOLookup.abi, NameTAOLookup.networks);
			dispatch(setNameTAOLookup(nameTAOLookup));

			const nameTAOPosition = this.instantiateContract(web3, networkId, NameTAOPosition.abi, NameTAOPosition.networks);
			dispatch(setNameTAOPosition(nameTAOPosition));

			const nameTAOVault = this.instantiateContract(web3, networkId, NameTAOVault.abi, NameTAOVault.networks);
			dispatch(setNameTAOVault(nameTAOVault));

			const ethos = this.instantiateContract(web3, networkId, Ethos.abi, Ethos.networks);
			dispatch(setEthos(ethos));

			const pathos = this.instantiateContract(web3, networkId, Pathos.abi, Pathos.networks);
			dispatch(setPathos(pathos));

			const logos = this.instantiateContract(web3, networkId, Logos.abi, Logos.networks);
			dispatch(setLogos(logos));

			const aoion = this.instantiateContract(web3, networkId, AOIon.abi, AOIon.networks);
			dispatch(setAOIon(aoion));

			this.watchNameFactoryEvent(web3, networkId, nameFactory);
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

	instantiateContract(web3, networkId, abi, networks) {
		const contract = web3.eth.contract(abi).at(networks[networkId].address);
		return contract;
	}

	async watchNameFactoryEvent(web3, networkId, nameFactory) {
		const dispatch = this.props.store.dispatch;

		try {
			const receipt = await getTransactionReceipt(NameFactory.networks[networkId].transactionHash);
			var createNameEvent = nameFactory.CreateName({}, { fromBlock: receipt.blockNumber, toBlock: "latest" });
			createNameEvent.get((err, logs) => {
				if (!err) {
					const names = [];
					logs.forEach((log) => {
						names.push({ nameId: log.args.nameId, name: log.args.name });
					});
					dispatch(setNames(names));
				}
			});
			createNameEvent.watch((err, log) => {
				if (!err) {
					dispatch(appendName({ nameId: log.args.nameId, name: log.args.name }));
				}
			});
		} catch (e) {
			console.log("error", e);
		}
	}

	render() {
		const history = syncHistoryWithStore(hashHistory, this.props.store);

		return (
			<Router history={history}>
				<Route path="/" component={AppContainer}>
					<IndexRoute component={EnsureCreateNameContainer} />
					<Route path="/profile/:id" component={NameProfileContainer} />
					<Route path="/tao/:id" component={TAODetails} />
					<Route path="/meet/:id" component={Meet} />
					<Route path="/ide/:id" component={Ide} />
				</Route>
			</Router>
		);
	}
}

export { AppRouter };
