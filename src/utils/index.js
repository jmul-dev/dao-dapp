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
	const hour = a.getHours();
	const min = a.getMinutes();
	const sec = a.getSeconds();
	const time = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
	return time;
};
