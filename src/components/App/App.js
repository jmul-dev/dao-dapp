import * as React from "react";

import { Wrapper, ImgContainer } from "./styledComponents";
import { ToastContainer } from "../../widgets/Toast/";

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

	componentDidMount() {
		this.props.detectMobileBrowser(this.isMobileDevice());

		const intervalId = setInterval(async () => {
			await this.checkAccount(this.props.web3, this.props.accounts);
		}, 1000);
		this.setState({ intervalId });
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

	componentWillUnmount() {
		clearInterval(this.state.intervalId);
	}

	render() {
		return (
			<Wrapper>
				<ImgContainer>
					<img src={process.env.PUBLIC_URL + "/images/img_0.png"} />
				</ImgContainer>
				{this.props.children}
				<ToastContainer />
			</Wrapper>
		);
	}
}

export { App };
