import { getTransactionReceipt } from "utils/web3";
import { asyncForEach } from "utils/";

import {
	appendName,
	appendTAO,
	appendTAONeedApproval,
	removeTAONeedApproval,
	setTAOAsChild,
	positionLogosOn,
	unpositionLogosOn,
	positionLogosFrom,
	unpositionLogosFrom,
	addNamePositionLogos,
	subtractNamePositionLogos,
	stakeEthos,
	stakePathos,
	withdrawLogos,
	nameStakeEthos,
	nameStakePathos,
	updateLogosEarned,
	nameWithdrawLogos,
	appendTAOPosition,
	setTAOAdvocate,
	setTAOListener,
	setTAOSpeaker,
	appendNamePosition,
	setNameListener,
	setNameSpeaker
} from "./actions";

// Contracts
import NameFactory from "contracts/NameFactory.json";
import TAOFactory from "contracts/TAOFactory.json";
import TAOAncestry from "contracts/TAOAncestry.json";
import Logos from "contracts/Logos.json";
import TAOPool from "contracts/TAOPool.json";
import NameTAOPosition from "contracts/NameTAOPosition.json";
import AOLibrary from "contracts/AOLibrary.json";

const promisify = require("tiny-promisify");

export const getNameFactoryEvent = (dispatch, networkId, currentBlockNumber) => {
	return new Promise(async (resolve, reject) => {
		try {
			const nameLookup = {};
			const nameFactory = window.web3.eth.contract(NameFactory.abi).at(NameFactory.networks[networkId].address);
			const receipt = await getTransactionReceipt(NameFactory.networks[networkId].transactionHash);
			nameFactory.CreateName({}, { fromBlock: receipt.blockNumber, toBlock: currentBlockNumber - 1 }).get((err, logs) => {
				if (!err) {
					logs.forEach((log) => {
						dispatch(appendName({ nameId: log.args.nameId, name: log.args.name }));
						dispatch(
							appendNamePosition({
								nameId: log.args.nameId,
								advocateId: log.args.nameId,
								listenerId: log.args.nameId,
								speakerId: log.args.nameId
							})
						);
						nameLookup[log.args.nameId] = log.args.name;
					});
					resolve(nameLookup);
				} else {
					reject(err);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const watchNameFactoryEvent = (dispatch, networkId, currentBlockNumber) => {
	try {
		const nameFactory = window.web3.eth.contract(NameFactory.abi).at(NameFactory.networks[networkId].address);
		nameFactory.CreateName({}, { fromBlock: currentBlockNumber, toBlock: "latest" }).watch((err, log) => {
			if (!err) {
				dispatch(appendName({ nameId: log.args.nameId, name: log.args.name }));
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

export const getTAOFactoryEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const taoFactory = window.web3.eth.contract(TAOFactory.abi).at(TAOFactory.networks[networkId].address);
			const taoAncestry = window.web3.eth.contract(TAOAncestry.abi).at(TAOAncestry.networks[networkId].address);
			const receipt = await getTransactionReceipt(TAOFactory.networks[networkId].transactionHash);

			taoFactory.CreateTAO({}, { fromBlock: receipt.blockNumber, toBlock: currentBlockNumber - 1 }).get(async (err, logs) => {
				if (!err) {
					asyncForEach(logs, async (log) => {
						await _parseTAOFactoryEvent(dispatch, taoAncestry, log, nameId);
					});
					resolve();
				} else {
					reject(err);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const watchTAOFactoryEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	try {
		const taoFactory = window.web3.eth.contract(TAOFactory.abi).at(TAOFactory.networks[networkId].address);
		const taoAncestry = window.web3.eth.contract(TAOAncestry.abi).at(TAOAncestry.networks[networkId].address);

		taoFactory.CreateTAO({}, { fromBlock: currentBlockNumber, toBlock: "latest" }).watch(async (err, log) => {
			if (!err) {
				await _parseTAOFactoryEvent(dispatch, taoAncestry, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseTAOFactoryEvent = async (dispatch, taoAncestry, log, nameId) => {
	// If parent is a TAO
	let isChild = true;
	if (log.args.parentTypeId.toNumber() === 0) {
		isChild = await promisify(taoAncestry.isChild)(log.args.parent, log.args.taoId);
	}
	dispatch(appendTAO({ ...log.args, isChild, children: [] }));
	dispatch(
		appendTAOPosition({
			taoId: log.args.taoId,
			advocateId: log.args.advocateId,
			listenerId: log.args.advocateId,
			speakerId: log.args.advocateId
		})
	);
};

export const getTAOAncestryEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const taoFactory = window.web3.eth.contract(TAOFactory.abi).at(TAOFactory.networks[networkId].address);
			const taoAncestry = window.web3.eth.contract(TAOAncestry.abi).at(TAOAncestry.networks[networkId].address);
			const receipt = await getTransactionReceipt(TAOAncestry.networks[networkId].transactionHash);

			taoAncestry.allEvents({ fromBlock: receipt.blockNumber, toBlock: currentBlockNumber - 1 }).get(async (err, logs) => {
				if (!err) {
					asyncForEach(logs, async (log) => {
						await _parseTAOAncestryEvent(dispatch, taoFactory, log, nameId);
					});
					resolve();
				} else {
					reject(err);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const watchTAOAncestryEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	try {
		const taoFactory = window.web3.eth.contract(TAOFactory.abi).at(TAOFactory.networks[networkId].address);
		const taoAncestry = window.web3.eth.contract(TAOAncestry.abi).at(TAOAncestry.networks[networkId].address);

		taoAncestry.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch(async (err, log) => {
			if (!err) {
				await _parseTAOAncestryEvent(dispatch, taoFactory, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseTAOAncestryEvent = async (dispatch, taoFactory, log, nameId) => {
	switch (log.event) {
		case "AddChild":
			if (log.args.taoAdvocate === nameId) {
				const [childName] = await promisify(taoFactory.getTAO)(log.args.childId);
				dispatch(appendTAONeedApproval({ taoId: log.args.childId, name: childName }));
			}
			break;
		case "ApproveChild":
			if (log.args.taoAdvocate === nameId) {
				dispatch(removeTAONeedApproval(log.args.childId));
			}
			dispatch(setTAOAsChild(log.args));
			break;
		default:
			break;
	}
};

export const getLogosEvent = (dispatch, networkId, currentBlockNumber, nameLookup, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
			const receipt = await getTransactionReceipt(Logos.networks[networkId].transactionHash);
			logos.allEvents({ fromBlock: receipt.blockNumber, toBlock: currentBlockNumber - 1 }).get((err, logs) => {
				if (!err) {
					asyncForEach(logs, async (log) => {
						await _parseLogosEvent(dispatch, log, nameLookup, nameId);
					});
					resolve();
				} else {
					reject(err);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const watchLogosEvent = (dispatch, networkId, currentBlockNumber, nameLookup, nameId) => {
	try {
		const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
		logos.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch(async (err, log) => {
			if (!err) {
				await _parseLogosEvent(dispatch, log, nameLookup, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseLogosEvent = async (dispatch, log, nameLookup, nameId) => {
	switch (log.event) {
		case "PositionFrom":
			if (log.args.from === nameId) {
				dispatch(positionLogosOn(log.args.to, nameLookup[log.args.to], log.args.value));
			} else if (log.args.to === nameId) {
				dispatch(positionLogosFrom(log.args.from, nameLookup[log.args.from], log.args.value));
			}
			dispatch(addNamePositionLogos(log.args.to, log.args.value));
			break;
		case "UnpositionFrom":
			if (log.args.from === nameId) {
				dispatch(unpositionLogosOn(log.args.to, log.args.value));
			} else if (log.args.to === nameId) {
				dispatch(unpositionLogosFrom(log.args.from, log.args.value));
			}
			dispatch(subtractNamePositionLogos(log.args.to, log.args.value));
			break;
		default:
			break;
	}
};

export const getTAOPoolEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const taoPool = window.web3.eth.contract(TAOPool.abi).at(TAOPool.networks[networkId].address);
			const receipt = await getTransactionReceipt(TAOPool.networks[networkId].transactionHash);
			taoPool.allEvents({ fromBlock: receipt.blockNumber, toBlock: currentBlockNumber - 1 }).get((err, logs) => {
				if (!err) {
					logs.forEach((log) => {
						_parseTAOPoolEvent(dispatch, log, nameId);
					});
					resolve();
				} else {
					reject(err);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const watchTAOPoolEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	try {
		const taoPool = window.web3.eth.contract(TAOPool.abi).at(TAOPool.networks[networkId].address);
		taoPool.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch((err, log) => {
			if (!err) {
				_parseTAOPoolEvent(dispatch, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseTAOPoolEvent = (dispatch, log, nameId) => {
	switch (log.event) {
		case "StakeEthos":
			if (log.args.nameId === nameId) {
				dispatch(nameStakeEthos(log.args));
			}
			dispatch(stakeEthos(log.args));
			break;
		case "StakePathos":
			if (log.args.nameId === nameId) {
				dispatch(nameStakePathos(log.args));
			}
			dispatch(updateLogosEarned(log.args));
			dispatch(stakePathos(log.args));
			break;
		case "WithdrawLogos":
			if (log.args.nameId === nameId) {
				dispatch(nameWithdrawLogos(log.args));
			}
			dispatch(withdrawLogos(log.args));
			break;
		default:
			break;
	}
};

export const getNameTAOPositionEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const nameTAOPosition = window.web3.eth.contract(NameTAOPosition.abi).at(NameTAOPosition.networks[networkId].address);
			const aoLibrary = window.web3.eth.contract(AOLibrary.abi).at(AOLibrary.networks[networkId].address);
			const receipt = await getTransactionReceipt(NameTAOPosition.networks[networkId].transactionHash);
			nameTAOPosition.allEvents({ fromBlock: receipt.blockNumber, toBlock: currentBlockNumber - 1 }).get((err, logs) => {
				if (!err) {
					logs.forEach((log) => {
						_parseNameTAOPositionEvent(dispatch, aoLibrary, log, nameId);
					});
					resolve();
				} else {
					reject(err);
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};

export const watchNameTAOPositionEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	try {
		const nameTAOPosition = window.web3.eth.contract(NameTAOPosition.abi).at(NameTAOPosition.networks[networkId].address);
		const aoLibrary = window.web3.eth.contract(AOLibrary.abi).at(AOLibrary.networks[networkId].address);
		nameTAOPosition.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch((err, log) => {
			if (!err) {
				_parseNameTAOPositionEvent(dispatch, aoLibrary, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseNameTAOPositionEvent = async (dispatch, aoLibrary, log, nameId) => {
	const isTAO = await promisify(aoLibrary.isTAO)(log.args.taoId);
	switch (log.event) {
		case "SetAdvocate":
			dispatch(setTAOAdvocate(log.args.taoId, log.args.newAdvocateId));
			break;
		case "SetListener":
			if (isTAO) {
				dispatch(setTAOListener(log.args.taoId, log.args.newListenerId));
			} else {
				dispatch(setNameListener(log.args.taoId, log.args.newListenerId));
			}
			break;
		case "SetSpeaker":
			if (isTAO) {
				dispatch(setTAOSpeaker(log.args.taoId, log.args.newSpeakerId));
			} else {
				dispatch(setNameSpeaker(log.args.taoId, log.args.newSpeakerId));
			}
			break;
		default:
			break;
	}
};
