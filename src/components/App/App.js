import * as React from "react";
import { PageLayout } from "../../layouts/PageLayout/";

const promisify = require("tiny-promisify");

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			intervalId: undefined
		};
	}

	isMobileDevice() {
		return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
	}

	async componentDidMount() {
		this.props.detectMobileBrowser(this.isMobileDevice());

		const intervalId = setInterval(async () => {
			await this.checkAccount(this.props.web3, this.props.accounts);
		}, 1000);
		this.setState({ intervalId });
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	async checkAccount(web3, accounts) {
		if (!web3 || !accounts || (accounts && !accounts.length)) {
			return;
		}

		const latestAccounts = await promisify(web3.eth.getAccounts)();
		if (
			(accounts.length && latestAccounts.length && accounts.length && latestAccounts[0] !== accounts[0]) ||
			latestAccounts.length !== accounts.length
		) {
			window.location = "/";
		}
	}

	render() {
		return <PageLayout>{this.props.children}</PageLayout>;
	}
}

export { App };
