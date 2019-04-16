const sls = require("single-line-string");

export const web3Errors = {
	UNABLE_TO_FIND_WEB3_PROVIDER: sls`Make sure that you are using a Web3-enabled browser (such as Chrome with MetaMask installed or Coinbase Wallet).`,

	UNABLE_TO_FIND_ACCOUNTS: sls`Unable to find an active account on the Ethereum network you're currently connected to. Please check that Metamask is properly configured and reload the page.`,

	UNABLE_TO_CONNECT_TO_NETWORK: sls`Please ensure that you are connecting to the appropriate Ethereum network and that your account is unlocked.`,

	UNSUPPORTED_NETWORK: sls`The TAO smart contracts are not available on the Ethereum network you're on.`
};

export const WRITER_KEY_ERROR = sls`Unable to determine local writer key for this node.`;
