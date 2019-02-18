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
