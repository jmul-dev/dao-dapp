import { BigNumber } from "bignumber.js";
const Q = require("q");
const asap = require("asap");

BigNumber.config({ DECIMAL_PLACES: 2 });

export const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

export const encodeParams = (params) => {
	return Object.keys(params)
		.map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
		.join("&");
};

export const get = (url) => {
	return new Promise((resolve, reject) => {
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((resp) => {
				resolve(resp);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const post = (url, data) => {
	return new Promise((resolve, reject) => {
		fetch(url, {
			method: "POST",
			body: JSON.stringify(data),
			headers: { "Content-Type": "application/json" }
		})
			.then((response) => {
				return response.json();
			})
			.then((resp) => {
				resolve(resp);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const buildTAOTreeData = (taos) => {
	if (!taos.length) {
		return [];
	}

	const taosCopy = [];
	taos.forEach((tao) => {
		taosCopy.push({ name: tao.name, id: tao.taoId, parentId: tao.parent, isChild: tao.isChild, children: [] });
	});

	const treeData = taosCopy.reduce((r, a) => {
		const getParent = (s, b) => {
			return b.id === a.parentId && b.isChild ? b : b.children && b.children.reduce(getParent, s);
		};

		let index = 0,
			node;
		if (a.isChild) {
			node = r.reduce(getParent, {});
		}
		if (node && Object.keys(node).length) {
			node.children = node.children || [];
			node.children.push(a);
		} else {
			while (index < r.length) {
				if (r[index].parentId === a.id && a.isChild) {
					a.children = (a.children || []).concat(r.splice(index, 1));
				} else {
					index++;
				}
			}
			r.push(a);
		}
		return r;
	}, []);

	return treeData[0];
};

export const formatDate = (timestamp) => {
	const a = new Date(timestamp * 1000);
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const year = a.getFullYear();
	const month = months[a.getMonth()];
	const date = a.getDate();
	const hour = ("0" + a.getHours()).slice(-2);
	const min = ("0" + a.getMinutes()).slice(-2);
	const sec = ("0" + a.getSeconds()).slice(-2);
	const time = month + " " + date + ", " + year + " " + hour + ":" + min + ":" + sec;
	return time;
};

export const timeSince = (timestamp) => {
	const seconds = Math.floor((new Date() - timestamp * 1000) / 1000);
	if (seconds < 1) {
		return "0 seconds";
	}
	let interval = Math.floor(seconds / 31536000);
	if (interval >= 1) {
		return interval + " years";
	}
	interval = Math.floor(seconds / 2592000);
	if (interval >= 1) {
		return interval + " months";
	}
	interval = Math.floor(seconds / 86400);
	if (interval >= 1) {
		return interval + " days";
	}
	interval = Math.floor(seconds / 3600);
	if (interval >= 1) {
		return interval + " hours";
	}
	interval = Math.floor(seconds / 60);
	if (interval >= 1) {
		return interval + " minutes";
	}
	return Math.floor(seconds) + " seconds";
};

export const toHighestDenomination = (value) => {
	let _value = new BigNumber(value);
	if (_value.eq(0)) {
		return "0";
	}
	let _integer = _value.div(10 ** 24);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " yotta";
	}
	_integer = _value.div(10 ** 21);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " zetta";
	}
	_integer = _value.div(10 ** 18);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " exa";
	}
	_integer = _value.div(10 ** 15);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " peta";
	}
	_integer = _value.div(10 ** 12);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " tera";
	}
	_integer = _value.div(10 ** 9);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " giga";
	}
	_integer = _value.div(10 ** 6);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " mega";
	}
	_integer = _value.div(10 ** 3);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " kilo";
	}
	_integer = _value.div(10 ** 21);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " zetta";
	}
	_integer = _value.div(10 ** 21);
	if (_integer.gte(1)) {
		return _integer.toNumber() + " zetta";
	}
	return _value.toNumber();
};

export const buildThoughtsHierarchy = (thoughts) => {
	if (!thoughts.length) {
		return [];
	}

	const _thoughts = [];
	thoughts.forEach((thought) => {
		_thoughts.push({ ...thought, children: [] });
	});

	const treeData = _thoughts.reduce((r, a) => {
		const getParent = (s, b) => {
			return b.thoughtId === a.parentThoughtId ? b : b.children && b.children.reduce(getParent, s);
		};

		let index = 0,
			node;
		if (a.parentThoughtId > 0) {
			node = r.reduce(getParent, {});
		}
		if (node && Object.keys(node).length) {
			node.children = node.children || [];
			node.children.push(a);
		} else {
			while (index < r.length) {
				if (r[index].parentThoughtId === a.thoughtId) {
					a.children = (a.children || []).concat(r.splice(index, 1));
				} else {
					index++;
				}
			}
			r.push(a);
		}
		return r;
	}, []);

	return treeData;
};

export const promiseWhile = (condition, body) => {
	const done = Q.defer();
	const loop = () => {
		if (!condition()) return done.resolve();
		Q.when(body(), loop, done.reject);
	};
	asap(loop);
	return done.promise;
};
