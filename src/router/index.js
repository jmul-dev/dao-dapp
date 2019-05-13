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
import { ViewThoughtsContainer } from "components/ViewThoughts/";
import { ViewTimelineContainer } from "components/ViewTimeline/";
import { ChallengeTAOAdvocateContainer } from "components/ChallengeTAOAdvocate/";
import { ViewChallengedTAOContainer } from "components/ViewChallengedTAO/";
import { AttentionContainer } from "components/Attention/";
import { ParentReplaceTAOAdvocateContainer } from "components/ParentReplaceTAOAdvocate/";

import {
	setLocalWriterKey,
	web3Connected,
	setAccounts,
	setNetworkId,
	setContracts,
	setSettingTAOId,
	setPastEventsProgress,
	pastEventsRetrieved
} from "./actions";
import { web3Errors, LOCAL_WRITER_KEY_ERROR } from "common/errors";

// Contracts
import NameAccountRecovery from "ao-contracts/build/contracts/NameAccountRecovery.json";
import NameFactory from "ao-contracts/build/contracts/NameFactory.json";
import NamePublicKey from "ao-contracts/build/contracts/NamePublicKey.json";
import NameTAOLookup from "ao-contracts/build/contracts/NameTAOLookup.json";
import NameTAOPosition from "ao-contracts/build/contracts/NameTAOPosition.json";
import NameTAOVault from "ao-contracts/build/contracts/NameTAOVault.json";
import Ethos from "ao-contracts/build/contracts/Ethos.json";
import Pathos from "ao-contracts/build/contracts/Pathos.json";
import Logos from "ao-contracts/build/contracts/Logos.json";
import AOIon from "ao-contracts/build/contracts/AOIon.json";
import TAOAncestry from "ao-contracts/build/contracts/TAOAncestry.json";
import TAOFactory from "ao-contracts/build/contracts/TAOFactory.json";
import TAOPool from "ao-contracts/build/contracts/TAOPool.json";
import AOSetting from "ao-contracts/build/contracts/AOSetting.json";
import AOLibrary from "ao-contracts/build/contracts/AOLibrary.json";

import { setError } from "widgets/Toast/actions";

import { promiseWhile } from "utils/";
import { getCurrentBlockNumber, getTransactionReceipt } from "utils/web3";
import { getWriterKey } from "utils/graphql";

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
	watchNameTAOPositionEvent,
	getNameAccountRecoveryEvent,
	watchNameAccountRecoveryEvent,
	getNamePublicKeyEvent,
	watchNamePublicKeyEvent
} from "./events";

import { EMPTY_ADDRESS, BLOCKS_PER_EVENT_GET } from "common/constants";

const promisify = require("tiny-promisify");

class AppRouter extends React.Component {
	_localWriterKey = null;
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

			const accounts = await this.getAccounts();
			dispatch(setAccounts(accounts));

			this._networkId = await this.getNetworkId();
			dispatch(setNetworkId(this._networkId));

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

			try {
				const response = await getWriterKey();
				if (response.data.writerKey) {
					this._localWriterKey = response.data.writerKey;
					// writerKey from graphql should be an address
					// this._localWriterKey = response.data.writerKey;
					dispatch(setLocalWriterKey(this._localWriterKey));
				} else {
					throw new Error(LOCAL_WRITER_KEY_ERROR);
				}
			} catch (e) {
				dispatch(setError("Oops!", LOCAL_WRITER_KEY_ERROR, true));
				return;
			}

			if (accounts.length) {
				this._nameId = await promisify(contracts.nameFactory.ethAddressToNameId)(accounts[0]);
			}

			const settingTAOId = await promisify(contracts.taoFactory.settingTAOId)();
			dispatch(setSettingTAOId(settingTAOId));

			this._currentBlockNumber = await getCurrentBlockNumber();

			// Get past events
			const receipt = await getTransactionReceipt(NameFactory.networks[this._networkId].transactionHash);
			let fromBlock = receipt.blockNumber >= 1 ? receipt.blockNumber - 1 : 0;
			let toBlock = fromBlock;
			const upperBlockLimit = this._currentBlockNumber;
			promiseWhile(
				() => {
					return toBlock < upperBlockLimit;
				},
				async () => {
					fromBlock = toBlock + 1;
					toBlock += BLOCKS_PER_EVENT_GET;
					if (toBlock > upperBlockLimit) {
						toBlock = upperBlockLimit;
					}
					await getNameFactoryEvent(dispatch, this._networkId, fromBlock, toBlock);
					await getTAOFactoryEvent(dispatch, this._networkId, fromBlock, toBlock, this._nameId);
					await getTAOAncestryEvent(dispatch, this._networkId, fromBlock, toBlock, this._nameId);
					await getLogosEvent(dispatch, this._networkId, fromBlock, toBlock, this._nameId);
					await getTAOPoolEvent(dispatch, this._networkId, fromBlock, toBlock, this._nameId);
					await getNameTAOPositionEvent(dispatch, this._networkId, fromBlock, toBlock, this._nameId);
					await getNameAccountRecoveryEvent(dispatch, this._networkId, fromBlock, toBlock, this._nameId);
					await getNamePublicKeyEvent(dispatch, this._networkId, fromBlock, toBlock, this._nameId);
					const percentDone = parseInt(((toBlock - receipt.blockNumber) * 100) / (upperBlockLimit - receipt.blockNumber));
					dispatch(setPastEventsProgress(percentDone));
				}
			).done(() => {
				// Get and watch events
				dispatch(pastEventsRetrieved());

				watchNameFactoryEvent(dispatch, this._networkId, this._currentBlockNumber);
				watchTAOFactoryEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
				watchTAOAncestryEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
				watchLogosEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
				watchTAOPoolEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
				watchNameTAOPositionEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
				watchNameAccountRecoveryEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
				watchNamePublicKeyEvent(dispatch, this._networkId, this._currentBlockNumber, this._nameId);
			});
		} catch (e) {
			dispatch(setError("Oops!", e.message, true));
		}
	}

	async instantiateWeb3(env) {
		if (typeof window.ethereum !== "undefined") {
			window.web3 = await new Web3(window.ethereum);
			try {
				// Request account access if needed
				await window.ethereum.enable();
			} catch (e) {
				// User denied account access
				console.log("User denied account access");
			}
		} else if (typeof window.web3 !== "undefined") {
			window.web3 = new Web3(window.web3.currentProvider);
		} else if (env === "development" || env === "test") {
			window.web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		} else {
			throw new Error(web3Errors.UNABLE_TO_FIND_WEB3_PROVIDER);
		}
		return window.web3;
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
					<Route path="/view-thoughts/:id" component={ViewThoughtsContainer} />
					<Route path="/view-timeline/:id" component={ViewTimelineContainer} />
					<Route path="/challenge-tao-advocate/:id" component={ChallengeTAOAdvocateContainer} />
					<Route path="/view-challenged-tao/:challengeId" component={ViewChallengedTAOContainer} />
					<Route path="/attention" component={AttentionContainer} />
					<Route path="/parent-replace-tao-advocate/:id" component={ParentReplaceTAOAdvocateContainer} />
				</Route>
			</Router>
		);
	}
}

export { AppRouter };
