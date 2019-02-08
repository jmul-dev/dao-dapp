import * as React from "react";

import { Wrapper, ImgContainer } from "./styledComponents";
import { ToastContainer } from "../../widgets/Toast/";
import { EMPTY_ADDRESS } from "../../common/constants";

const promisify = require("tiny-promisify");

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			getNameIdCalled: false,
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

		await this.getNameId(this.props.nameFactory, this.props.accounts);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.nameFactory !== prevProps.nameFactory) {
			this.getNameId(this.props.nameFactory, this.props.accounts);
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	async checkAccount(web3, accounts) {
		if (!web3 || !accounts) {
			return;
		}

		const latestAccounts = await promisify(web3.eth.getAccounts)();
		if ((latestAccounts.length && accounts.length && latestAccounts[0] !== accounts[0]) || latestAccounts.length !== accounts.length) {
			window.location.reload();
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
			<Wrapper>
				{!this.state.getNameIdCalled ? (
					<ImgContainer>
						<img src={process.env.PUBLIC_URL + "/images/img_0.png"} alt={"AO Logo"} />
					</ImgContainer>
				) : !this.props.nameId ? (
					<div>No name</div>
				) : (
					<div>has name</div>
				)}
				{this.props.children}
				<ToastContainer />
			</Wrapper>
		);
	}
}

export { App };
