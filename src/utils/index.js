export const asyncForEach = async (array, callback) => {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array);
	}
};

export const getTransactionReceipt = (transactionHash) => {
	return new Promise((resolve, reject) => {
		window.web3.eth.getTransactionReceipt(transactionHash, (err, receipt) => {
			if (err) reject(err);
			resolve(receipt);
		});
	});
};
