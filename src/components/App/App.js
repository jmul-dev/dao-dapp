import * as React from "react";
import { PageLayout } from "layouts/PageLayout/";
import { EMPTY_ADDRESS } from "common/constants";
import { ImgContainer } from "./styledComponents";

const promisify = require("tiny-promisify");

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			intervalId: undefined,
			getNameIdCalled: false
		};
	}

	isMobileDevice() {
		return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
	}

	async componentDidMount() {
		this.props.detectMobileBrowser(this.isMobileDevice());

		const intervalId = setInterval(async () => {
			await this.checkAccount(this.props.web3, this.props.networkId, this.props.accounts);
		}, 1000);
		this.setState({ intervalId });

		await this.getNameId(this.props.nameFactory, this.props.accounts);
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	async componentDidUpdate(prevProps) {
		if (
			this.props.nameFactory !== prevProps.nameFactory ||
			this.props.networkId !== prevProps.networkId ||
			this.props.nameId !== prevProps.nameId
		) {
			this.getNameId(this.props.nameFactory, this.props.accounts);
		}
	}

	async checkAccount(web3, networkId, accounts) {
		if (!web3 || !networkId || !accounts) {
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

	async getNameId(nameFactory, accounts) {
		if (!nameFactory || !accounts) {
			return;
		}
		const nameId = await promisify(nameFactory.ethAddressToNameId)(accounts[0]);
		if (nameId !== EMPTY_ADDRESS) {
			this.props.setNameId(nameId);
		}
		this.setState({ getNameIdCalled: true });
	}

	render() {
		return (
			<PageLayout>
				{!this.state.getNameIdCalled ? (
					<ImgContainer>
						<img src={process.env.PUBLIC_URL + "/images/img_0.png"} alt={"AO Logo"} />
					</ImgContainer>
				) : (
					<div>{this.props.children}</div>
				)}
			</PageLayout>
		);
	}
}

export { App };
