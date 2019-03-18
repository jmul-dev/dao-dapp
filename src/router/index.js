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

import {
	web3Connected,
	setAccounts,
	setNetworkId,
	setContracts,
	setNames,
	appendName,
	setTAOs,
	appendTAO,
	setSettingTAOId,
	setNameTAOs,
	appendNameTAO,
	setTAOsNeedApproval,
	appendTAONeedApproval,
	removeTAONeedApproval,
	setTAOAsChild,
	setNameTAOAsChild,
	positionLogos,
	unpositionLogos
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
import TAOAncestry from "contracts/TAOAncestry.json";
import TAOFactory from "contracts/TAOFactory.json";
import TAOPool from "contracts/TAOPool.json";
import AOSetting from "contracts/AOSetting.json";
import AOLibrary from "contracts/AOLibrary.json";

import { setError } from "widgets/Toast/actions";

import { getTransactionReceipt, getCurrentBlockNumber } from "utils/web3";
import { asyncForEach } from "utils/";

import { EMPTY_ADDRESS } from "common/constants";

const promisify = require("tiny-promisify");

class AppRouter extends React.Component {
	_nameLookup = {};
	_currentBlockNumber = null;

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

			const contracts = {
				nameAccountRecovery: this.instantiateContract(web3, networkId, NameAccountRecovery.abi, NameAccountRecovery.networks),
				nameFactory: this.instantiateContract(web3, networkId, NameFactory.abi, NameFactory.networks),
				namePublicKey: this.instantiateContract(web3, networkId, NamePublicKey.abi, NamePublicKey.networks),
				nameTAOLookup: this.instantiateContract(web3, networkId, NameTAOLookup.abi, NameTAOLookup.networks),
				nameTAOPosition: this.instantiateContract(web3, networkId, NameTAOPosition.abi, NameTAOPosition.networks),
				nameTAOVault: this.instantiateContract(web3, networkId, NameTAOVault.abi, NameTAOVault.networks),
				ethos: this.instantiateContract(web3, networkId, Ethos.abi, Ethos.networks),
				pathos: this.instantiateContract(web3, networkId, Pathos.abi, Pathos.networks),
				logos: this.instantiateContract(web3, networkId, Logos.abi, Logos.networks),
				aoion: this.instantiateContract(web3, networkId, AOIon.abi, AOIon.networks),
				taoAncestry: this.instantiateContract(web3, networkId, TAOAncestry.abi, TAOAncestry.networks),
				taoFactory: this.instantiateContract(web3, networkId, TAOFactory.abi, TAOFactory.networks),
				taoPool: this.instantiateContract(web3, networkId, TAOPool.abi, TAOPool.networks),
				aoSetting: this.instantiateContract(web3, networkId, AOSetting.abi, AOSetting.networks),
				aoLibrary: this.instantiateContract(web3, networkId, AOLibrary.abi, AOLibrary.networks)
			};
			dispatch(setContracts(contracts));

			const settingTAOId = await promisify(contracts.taoFactory.settingTAOId)();
			dispatch(setSettingTAOId(settingTAOId));

			this._currentBlockNumber = await getCurrentBlockNumber();

			this.watchNameFactoryEvent(web3, networkId, contracts.nameFactory);

			let nameId = EMPTY_ADDRESS;
			if (accounts.length) {
				nameId = await promisify(contracts.nameFactory.ethAddressToNameId)(accounts[0]);
			}
			this.watchTAOFactoryEvent(web3, networkId, contracts.taoFactory, contracts.taoAncestry, nameId);
			this.watchTAOAncestryEvent(web3, networkId, contracts.taoFactory, contracts.taoAncestry, nameId);
			this.watchLogosEvent(web3, networkId, contracts.logos, contracts.nameTAOLookup, nameId);
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
		if (networkId === 4 || networkId === 1985) {
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
						this._nameLookup[log.args.nameId] = log.args.name;
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

	async watchTAOFactoryEvent(web3, networkId, taoFactory, taoAncestry, nameId) {
		const dispatch = this.props.store.dispatch;

		try {
			const receipt = await getTransactionReceipt(TAOFactory.networks[networkId].transactionHash);
			var createTAOEvent = taoFactory.CreateTAO({}, { fromBlock: receipt.blockNumber, toBlock: "latest" });
			createTAOEvent.get(async (err, logs) => {
				if (!err) {
					const taos = [];
					const nameTAOs = [];

					await asyncForEach(logs, async (log) => {
						// If parent is a TAO
						let isChild = true;
						if (log.args.parentTypeId.toNumber() === 0) {
							isChild = await promisify(taoAncestry.isChild)(log.args.parent, log.args.taoId);
						}
						taos.push({ ...log.args, isChild });
						if (log.args.advocateId === nameId) {
							nameTAOs.push({ ...log.args, isChild });
						}
					});
					dispatch(setTAOs(taos));
					dispatch(setNameTAOs(nameTAOs));
				}
			});
			createTAOEvent.watch(async (err, log) => {
				if (!err) {
					// If parent is a TAO
					let isChild = false;
					if (log.args.parentTypeId.toNumber() === 0) {
						isChild = await promisify(taoAncestry.isChild)(log.args.parent, log.args.taoId);
					}
					dispatch(appendTAO({ ...log.args, isChild }));
					if (log.args.advocateId === nameId) {
						dispatch(appendNameTAO({ ...log.args, isChild }));
					}
				}
			});
		} catch (e) {
			console.log("error", e);
		}
	}

	async watchTAOAncestryEvent(web3, networkId, taoFactory, taoAncestry, nameId) {
		const dispatch = this.props.store.dispatch;

		try {
			const receipt = await getTransactionReceipt(TAOAncestry.networks[networkId].transactionHash);
			var addChildEvent = taoAncestry.AddChild({}, { fromBlock: receipt.blockNumber, toBlock: "latest" });
			addChildEvent.get(async (err, logs) => {
				if (!err) {
					const taosNeedApproval = [];
					await asyncForEach(logs, async (log) => {
						if (log.args.taoAdvocate === nameId) {
							const [childName] = await promisify(taoFactory.getTAO)(log.args.childId);
							taosNeedApproval.push({ ...log.args, childName });
						}
					});
					dispatch(setTAOsNeedApproval(taosNeedApproval));

					var approveChildEvent = taoAncestry.ApproveChild({}, { fromBlock: receipt.blockNumber, toBlock: "latest" });
					approveChildEvent.get(async (err, logs) => {
						if (!err) {
							logs.forEach((log) => {
								if (log.args.taoAdvocate === nameId) {
									dispatch(removeTAONeedApproval(log.args));
								}
								dispatch(setTAOAsChild(log.args));
								dispatch(setNameTAOAsChild(log.args));
							});
						}
					});
					approveChildEvent.watch(async (err, log) => {
						if (!err) {
							if (log.args.advocateId === nameId) {
								dispatch(removeTAONeedApproval(log.args));
							}
							dispatch(setTAOAsChild(log.args));
							dispatch(setNameTAOAsChild(log.args));
						}
					});
				}
			});

			addChildEvent.watch(async (err, log) => {
				if (!err) {
					if (log.args.taoAdvocate === nameId) {
						const [childName] = await promisify(taoFactory.getTAO)(log.args.childId);
						dispatch(appendTAONeedApproval({ ...log.args, childName }));
					}
				}
			});
		} catch (e) {
			console.log("error", e);
		}
	}

	async watchLogosEvent(web3, networkId, logos, nameTAOLookup, nameId) {
		try {
			const receipt = await getTransactionReceipt(Logos.networks[networkId].transactionHash);
			logos.allEvents({ from: nameId, fromBlock: receipt.blockNumber, toBlock: this._currentBlockNumber - 1 }).get((err, logs) => {
				if (!err) {
					logs.forEach(async (log) => {
						await this.parseLogosEvent(log, nameTAOLookup, nameId);
					});
				}
			});
			logos.allEvents({ fromBlock: this._currentBlockNumber, toBlock: "latest" }).watch(async (err, log) => {
				if (!err) {
					await this.parseLogosEvent(log, nameTAOLookup, nameId);
				}
			});
		} catch (e) {
			console.log("error", e);
		}
	}

	async parseLogosEvent(log, nameTAOLookup, nameId) {
		const dispatch = this.props.store.dispatch;
		switch (log.event) {
			case "PositionFrom":
				if (!this._nameLookup[log.args.from]) {
					const nameInfo = await promisify(nameTAOLookup.getById)(log.args.to);
					this._nameLookup[log.args.to] = nameInfo[0];
				}
				dispatch(positionLogos(log.args.to, this._nameLookup[log.args.to], log.args.value));
				break;
			case "UnpositionFrom":
				dispatch(unpositionLogos(log.args.to, log.args.value));
				break;
			default:
				break;
		}
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
				</Route>
			</Router>
		);
	}
}

export { AppRouter };
