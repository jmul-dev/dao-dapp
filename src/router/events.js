import { asyncForEach } from "utils/";
import { BigNumber } from "bignumber.js";

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
	setNameSpeaker,
	appendNameCompromised,
	setNameCompromised,
	setLoggedInNameCompromised,
	resetNameCompromised,
	resetLoggedInNameCompromised,
	appendNameSumLogos,
	updateNameSumLogos,
	setNameWriterKey,
	challengeTAOAdvocate,
	nameChallengeTAOAdvocate,
	nameChallengedTAOAdvocate
} from "./actions";

// Contracts
import NameFactory from "ao-contracts/build/contracts/NameFactory.json";
import TAOFactory from "ao-contracts/build/contracts/TAOFactory.json";
import TAOAncestry from "ao-contracts/build/contracts/TAOAncestry.json";
import Logos from "ao-contracts/build/contracts/Logos.json";
import TAOPool from "ao-contracts/build/contracts/TAOPool.json";
import NameTAOPosition from "ao-contracts/build/contracts/NameTAOPosition.json";
import AOLibrary from "ao-contracts/build/contracts/AOLibrary.json";
import NameAccountRecovery from "ao-contracts/build/contracts/NameAccountRecovery.json";
import NamePublicKey from "ao-contracts/build/contracts/NamePublicKey.json";

const promisify = require("tiny-promisify");
const nameLookup = {};

export const getNameFactoryEvent = (dispatch, networkId, fromBlock, toBlock) => {
	return new Promise(async (resolve, reject) => {
		try {
			const nameFactory = window.web3.eth.contract(NameFactory.abi).at(NameFactory.networks[networkId].address);
			const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
			nameFactory.CreateName({}, { fromBlock, toBlock }).get((err, logs) => {
				if (!err) {
					asyncForEach(logs, async (log) => {
						await _parseNameFactoryEvent(dispatch, logos, log);
					});
					resolve(true);
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
		const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
		nameFactory.CreateName({}, { fromBlock: currentBlockNumber, toBlock: "latest" }).watch(async (err, log) => {
			if (!err) {
				_parseNameFactoryEvent(dispatch, logos, log);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseNameFactoryEvent = async (dispatch, logos, log) => {
	dispatch(appendName({ nameId: log.args.nameId, name: log.args.name }));
	dispatch(
		appendNamePosition({
			nameId: log.args.nameId,
			advocateId: log.args.nameId,
			listenerId: log.args.nameId,
			speakerId: log.args.nameId
		})
	);
	dispatch(
		appendNameCompromised({
			nameId: log.args.nameId,
			compromised: false,
			submittedTimestamp: new BigNumber(0),
			lockedUntilTimestamp: new BigNumber(0)
		})
	);
	const sumLogos = await promisify(logos.sumBalanceOf)(log.args.nameId);
	dispatch(
		appendNameSumLogos({
			nameId: log.args.nameId,
			sumLogos
		})
	);
	nameLookup[log.args.nameId] = log.args.name;
};

export const getTAOFactoryEvent = (dispatch, networkId, fromBlock, toBlock, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const taoFactory = window.web3.eth.contract(TAOFactory.abi).at(TAOFactory.networks[networkId].address);
			const taoAncestry = window.web3.eth.contract(TAOAncestry.abi).at(TAOAncestry.networks[networkId].address);
			taoFactory.CreateTAO({}, { fromBlock, toBlock }).get(async (err, logs) => {
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

export const getTAOAncestryEvent = (dispatch, networkId, fromBlock, toBlock, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const taoFactory = window.web3.eth.contract(TAOFactory.abi).at(TAOFactory.networks[networkId].address);
			const taoAncestry = window.web3.eth.contract(TAOAncestry.abi).at(TAOAncestry.networks[networkId].address);
			taoAncestry.allEvents({ fromBlock, toBlock }).get(async (err, logs) => {
				if (!err) {
					asyncForEach(logs, async (log) => {
						await _parseTAOAncestryEvent(dispatch, taoAncestry, taoFactory, log, nameId);
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
				await _parseTAOAncestryEvent(dispatch, taoAncestry, taoFactory, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseTAOAncestryEvent = async (dispatch, taoAncestry, taoFactory, log, nameId) => {
	switch (log.event) {
		case "AddChild":
			if (log.args.taoAdvocate === nameId) {
				const [childName] = await promisify(taoFactory.getTAO)(log.args.childId);
				const isChild = await promisify(taoAncestry.isChild)(log.args.taoId, log.args.childId);
				if (!isChild) {
					dispatch(appendTAONeedApproval({ taoId: log.args.childId, name: childName }));
				}
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

export const getLogosEvent = (dispatch, networkId, fromBlock, toBlock, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
			logos.allEvents({ fromBlock, toBlock }).get((err, logs) => {
				if (!err) {
					asyncForEach(logs, async (log) => {
						await _parseLogosEvent(dispatch, logos, log, nameId);
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

export const watchLogosEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	try {
		const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
		logos.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch(async (err, log) => {
			if (!err) {
				await _parseLogosEvent(dispatch, logos, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseLogosEvent = async (dispatch, logos, log, nameId) => {
	switch (log.event) {
		case "PositionFrom":
			if (log.args.from === nameId) {
				dispatch(positionLogosOn(log.args.to, nameLookup[log.args.to], log.args.value));
			} else if (log.args.to === nameId) {
				dispatch(positionLogosFrom(log.args.from, nameLookup[log.args.from], log.args.value));
			}
			dispatch(addNamePositionLogos(log.args.to, log.args.value));
			await _updateNameSumLogos(dispatch, logos, log.args.to);
			await _updateNameSumLogos(dispatch, logos, log.args.from);
			break;
		case "UnpositionFrom":
			if (log.args.from === nameId) {
				dispatch(unpositionLogosOn(log.args.to, log.args.value));
			} else if (log.args.to === nameId) {
				dispatch(unpositionLogosFrom(log.args.from, log.args.value));
			}
			dispatch(subtractNamePositionLogos(log.args.to, log.args.value));
			await _updateNameSumLogos(dispatch, logos, log.args.to);
			await _updateNameSumLogos(dispatch, logos, log.args.from);
			break;
		case "AddAdvocatedTAOLogos":
			await _updateNameSumLogos(dispatch, logos, log.args.nameId);
			break;
		case "TransferAdvocatedTAOLogos":
			await _updateNameSumLogos(dispatch, logos, log.args.fromNameId);
			await _updateNameSumLogos(dispatch, logos, log.args.toNameId);
			break;
		default:
			break;
	}
};

export const getTAOPoolEvent = (dispatch, networkId, fromBlock, toBlock, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const taoPool = window.web3.eth.contract(TAOPool.abi).at(TAOPool.networks[networkId].address);
			const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
			taoPool.allEvents({ fromBlock, toBlock }).get((err, logs) => {
				if (!err) {
					asyncForEach(logs, async (log) => {
						await _parseTAOPoolEvent(dispatch, logos, log, nameId);
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
		const logos = window.web3.eth.contract(Logos.abi).at(Logos.networks[networkId].address);
		taoPool.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch(async (err, log) => {
			if (!err) {
				await _parseTAOPoolEvent(dispatch, logos, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseTAOPoolEvent = async (dispatch, logos, log, nameId) => {
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
			await _updateNameSumLogos(dispatch, logos, log.args.nameId);
			break;
		default:
			break;
	}
};

export const getNameTAOPositionEvent = (dispatch, networkId, fromBlock, toBlock, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const nameTAOPosition = window.web3.eth.contract(NameTAOPosition.abi).at(NameTAOPosition.networks[networkId].address);
			const aoLibrary = window.web3.eth.contract(AOLibrary.abi).at(AOLibrary.networks[networkId].address);
			nameTAOPosition.allEvents({ fromBlock, toBlock }).get((err, logs) => {
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
		case "ChallengeTAOAdvocate":
			if (log.args.challengerAdvocateId === nameId) {
				dispatch(nameChallengeTAOAdvocate(log.args));
			}
			if (log.args.currentAdvocateId === nameId) {
				dispatch(nameChallengedTAOAdvocate(log.args));
			}
			dispatch(challengeTAOAdvocate(log.args));
			break;
		default:
			break;
	}
};

export const getNameAccountRecoveryEvent = (dispatch, networkId, fromBlock, toBlock, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const nameAccountRecovery = window.web3.eth
				.contract(NameAccountRecovery.abi)
				.at(NameAccountRecovery.networks[networkId].address);
			nameAccountRecovery.allEvents({ fromBlock, toBlock }).get((err, logs) => {
				if (!err) {
					logs.forEach((log) => {
						_parseNameAccountRecoveryEvent(dispatch, nameAccountRecovery, log, nameId);
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

export const watchNameAccountRecoveryEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	try {
		const nameAccountRecovery = window.web3.eth.contract(NameAccountRecovery.abi).at(NameAccountRecovery.networks[networkId].address);
		nameAccountRecovery.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch((err, log) => {
			if (!err) {
				_parseNameAccountRecoveryEvent(dispatch, nameAccountRecovery, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseNameAccountRecoveryEvent = async (dispatch, nameAccountRecovery, log, nameId) => {
	switch (log.event) {
		case "SubmitAccountRecovery":
			const isCompromised = await promisify(nameAccountRecovery.isCompromised)(log.args.nameId);
			if (isCompromised) {
				dispatch(setNameCompromised(log.args.nameId, log.args.submittedTimestamp, log.args.lockedUntilTimestamp));
				if (log.args.nameId === nameId) {
					dispatch(setLoggedInNameCompromised(log.args.submittedTimestamp, log.args.lockedUntilTimestamp));
				}
			}
			break;
		case "SetNameNewAddress":
			dispatch(resetNameCompromised(log.args.nameId));
			if (log.args.nameId === nameId) {
				dispatch(resetLoggedInNameCompromised());
			}
			break;
		default:
			break;
	}
};

const _updateNameSumLogos = async (dispatch, logos, nameId) => {
	const sumLogos = await promisify(logos.sumBalanceOf)(nameId);
	dispatch(updateNameSumLogos(nameId, sumLogos));
};

export const getNamePublicKeyEvent = (dispatch, networkId, fromBlock, toBlock, nameId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const namePublicKey = window.web3.eth.contract(NamePublicKey.abi).at(NamePublicKey.networks[networkId].address);
			namePublicKey.allEvents({ fromBlock, toBlock }).get((err, logs) => {
				if (!err) {
					logs.forEach((log) => {
						_parseNamePublicKeyEvent(dispatch, namePublicKey, log, nameId);
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

export const watchNamePublicKeyEvent = (dispatch, networkId, currentBlockNumber, nameId) => {
	try {
		const namePublicKey = window.web3.eth.contract(NamePublicKey.abi).at(NamePublicKey.networks[networkId].address);
		namePublicKey.allEvents({ fromBlock: currentBlockNumber, toBlock: "latest" }).watch((err, log) => {
			if (!err) {
				_parseNamePublicKeyEvent(dispatch, namePublicKey, log, nameId);
			}
		});
	} catch (e) {
		console.log("error", e);
	}
};

const _parseNamePublicKeyEvent = async (dispatch, namePublicKey, log, nameId) => {
	switch (log.event) {
		case "SetWriterKey":
			if (log.args.nameId === nameId) {
				dispatch(setNameWriterKey(log.args.publicKey));
			}
			break;
		default:
			break;
	}
};
