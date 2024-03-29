export const getTransactionReceipt = (transactionHash) => {
	return new Promise((resolve, reject) => {
		window.web3.eth.getTransactionReceipt(transactionHash, (err, receipt) => {
			if (err) reject(err);
			resolve(receipt);
		});
	});
};

export const waitForTransactionReceipt = (transactionHash) => {
	return new Promise((resolve, reject) => {
		const intervalId = setInterval(async () => {
			try {
				const receipt = await getTransactionReceipt(transactionHash);
				if (receipt) {
					clearInterval(intervalId);
					if (receipt.status === "0x0") {
						reject(new Error("Transaction failed"));
					} else {
						resolve();
					}
				}
			} catch (e) {
				clearInterval(intervalId);
				reject(e);
			}
		}, 1000);
	});
};

export const getCurrentBlockNumber = () => {
	return new Promise((resolve, reject) => {
		window.web3.eth.getBlockNumber((err, result) => {
			if (err) reject(err);
			resolve(result);
		});
	});
};
