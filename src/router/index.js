import * as React from "react";
import * as Web3 from "web3";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";

// Router
import { AppContainer } from "components/App/";
import { EnsureCreateNameContainer } from "components/EnsureCreateName/";
import { NameProfileContainer } from "components/NameProfile/";
import { NameListContainer } from "components/NameList/";
import { CreateTAOContainer } from "components/CreateTAO/";
import { TAODetailsContainer } from "components/TAODetails/";
import { MeetContainer } from "components/Meet/";
import { IdeContainer } from "components/Ide/";
import { OwnTAOContainer } from "components/OwnTAO/";
import { NameStakeListContainer } from "components/NameStakeList/";

import { web3Connected, setAccounts, setNetworkId, setContracts, setSettingTAOId, pastEventsRetrieved } from "./actions";
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
import TAOAncestry from "contracts/TAOAncestry.json";
import TAOFactory from "contracts/TAOFactory.json";
import TAOPool from "contracts/TAOPool.json";
import AOSetting from "contracts/AOSetting.json";
import AOLibrary from "contracts/AOLibrary.json";

import { setError } from "widgets/Toast/actions";

import { getCurrentBlockNumber } from "utils/web3";

// Events
import {
	getNameFactoryEvent,
	watchNameFactoryEvent,
	getTAOFactoryEvent,
	watchTAOFactoryEvent,
	getTAOAncestryEvent,
	watchTAOAncestryEvent,
	getLogosEvent,
	watchLogosEvent,
	getTAOPoolEvent,
	watchTAOPoolEvent,
	getNameTAOPositionEvent,
	watchNameTAOPositionEvent
} from "./events";

import { EMPTY_ADDRESS } from "common/constants";

const promisify = require("tiny-promisify");

class AppRouter extends React.Component {
	_web3 = null;
	_networkId = null;
	_currentBlockNumber = null;
	_nameId = EMPTY_ADDRESS;

	async componentDidMount() {
		const { store, env } = this.props;
		const dispatch = store.dispatch;

		try {
			this._web3 = await this.instantiateWeb3(env);
		} catch (e) {
			dispatch(setError("Oops!", e.message, true));
			return;
		}

		try {
			this.validateConnection();
			dispatch(web3Connected(this._web3));

			this._networkId = await this.getNetworkId();
			dispatch(setNetworkId(this._networkId));

			const accounts = await this.getAccounts();
			dispatch(setAccounts(accounts));

			const contracts = {
				nameAccountRecovery: this.instantiateContract(NameAccountRecovery),
				nameFactory: this.instantiateContract(NameFactory),
				namePublicKey: this.instantiateContract(NamePublicKey),
				nameTAOLookup: this.instantiateContract(NameTAOLookup),
				nameTAOPosition: this.instantiateContract(NameTAOPosition),
				nameTAOVault: this.instantiateContract(NameTAOVault),
				ethos: this.instantiateContract(Ethos),
				pathos: this.instantiateContract(Pathos),
				logos: this.instantiateContract(Logos),
				aoion: this.instantiateContract(AOIon),
				taoAncestry: this.instantiateContract(TAOAncestry),
				taoFactory: this.instantiateContract(TAOFactory),
				taoPool: this.instantiateContract(TAOPool),
				aoSetting: this.instantiateContract(AOSetting),
				aoLibrary: this.instantiateContract(AOLibrary)
			};
			dispatch(setContracts(contracts));

			if (accounts.length) {
				this._nameId = await promisify(contracts.nameFactory.ethAddressToNameId)(accounts[0]);
			}

			const settingTAOId = await promisify(contracts.taoFactory.settingTAOId)();
			dispatch(setSettingTAOId(settingTAOId));

			this._currentBlockNumber = await getCurrentBlockNumber();

			// Get and watch events
			await getNameFactoryEvent(dispatch, this._networkId, this._currentBlockNumber);
			await getTAOFactoryEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			await getTAOAncestryEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			await getLogosEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			await getTAOPoolEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			await getNameTAOPositionEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			dispatch(pastEventsRetrieved());

			watchNameFactoryEvent(dispatch, this._networkId, this._currentBlockNumber);
			watchTAOFactoryEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			watchTAOAncestryEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			watchLogosEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			watchTAOPoolEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			watchNameTAOPositionEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
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

	validateConnection() {
		if (!this._web3.isConnected()) {
			throw new Error(web3Errors.UNABLE_TO_CONNECT_TO_NETWORK);
		}
	}

	async getNetworkId() {
		const networkIdString = await promisify(this._web3.version.getNetwork)();
		const networkId = parseInt(networkIdString, 10);
		if (networkId === 4 || networkId === 1985) {
			return networkId;
		} else {
			throw new Error(web3Errors.UNSUPPORTED_NETWORK);
		}
	}

	async getAccounts() {
		const accounts = await promisify(this._web3.eth.getAccounts)();
		if (!accounts.length) {
			throw new Error(web3Errors.UNABLE_TO_FIND_ACCOUNTS);
		}
		return accounts;
	}

	instantiateContract(contract) {
		const _contract = this._web3.eth.contract(contract.abi).at(contract.networks[this._networkId].address);
		return _contract;
	}

	render() {
		const history = syncHistoryWithStore(hashHistory, this.props.store);

		return (
			<Router history={history}>
				<Route path="/" component={AppContainer}>
					<IndexRoute component={EnsureCreateNameContainer} />
					<Route path="/profile/:id" component={NameProfileContainer} />
					<Route path="/names" component={NameListContainer} />
					<Route path="/create-tao(/:id)" component={CreateTAOContainer} />
					<Route path="/tao/:id" component={TAODetailsContainer} />
					<Route path="/meet/:id" component={MeetContainer} />
					<Route path="/ide/:id" component={IdeContainer} />
					<Route path="/view-own-taos" component={OwnTAOContainer} />
					<Route path="/name-stake-list/:id" component={NameStakeListContainer} />
					<Route path="/view-own-taos" component={OwnTAOContainer} />
				</Route>
			</Router>
		);
	}
}

export { AppRouter };
