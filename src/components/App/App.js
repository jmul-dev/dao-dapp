import * as React from "react";
import { PageLayout } from "layouts/PageLayout/";
import { EMPTY_ADDRESS } from "common/constants";
import { ImgContainer } from "./styledComponents";
import { CompromisedName } from "components/CompromisedName/";
import { BigNumber } from "bignumber.js";

const promisify = require("tiny-promisify");

class App extends React.Component {
	_notCompromised = { compromised: false, submittedTimestamp: new BigNumber(0), lockedUntilTimestamp: new BigNumber(0) };

	constructor(props) {
		super(props);

		this.state = {
			checkAccountIntervalId: undefined,
			checkCompromisedIntervalId: undefined,
			nameId: null,
			nameCompromised: this._notCompromised,
			getNameCalled: false
		};
	}

	isMobileDevice() {
		return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
	}

	async componentDidMount() {
		this.props.detectMobileBrowser(this.isMobileDevice());

		const checkAccountIntervalId = setInterval(async () => {
			await this.checkAccount();
		}, 1000);
		this.setState({ checkAccountIntervalId });

		await this.getName();
	}

	componentWillUnmount() {
		clearInterval(this.state.checkAccountIntervalId);
		if (this.state.checkCompromisedIntervalId) {
			clearInterval(this.state.checkCompromisedIntervalId);
		}
	}

	async componentDidUpdate(prevProps) {
		if (
			this.props.nameFactory !== prevProps.nameFactory ||
			this.props.nameAccountRecovery !== prevProps.nameAccountRecovery ||
			this.props.networkId !== prevProps.networkId ||
			this.props.nameId !== prevProps.nameId
		) {
			await this.getName();
		} else if (this.props.nameCompromised !== prevProps.nameCompromised) {
			await this.checkCompromised();
		}
	}

	async checkAccount() {
		const { web3, accounts } = this.props;
		if (!web3 || !accounts) {
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

	async getName() {
		const { nameFactory, nameAccountRecovery, accounts, setNameId, setLoggedInNameCompromised } = this.props;
		if (!nameFactory || !nameAccountRecovery || !accounts) {
			return;
		}
		const nameId = await promisify(nameFactory.ethAddressToNameId)(accounts[0]);
		if (nameId !== EMPTY_ADDRESS) {
			setNameId(nameId);
			this.setState({ nameId });
			const accountRecovery = await promisify(nameAccountRecovery.getAccountRecovery)(nameId);
			const isCompromised = await promisify(nameAccountRecovery.isCompromised)(nameId);
			if (isCompromised) {
				const nameCompromised = {
					compromised: true,
					submittedTimestamp: accountRecovery[1],
					lockedUntilTimestamp: accountRecovery[2]
				};
				setLoggedInNameCompromised(accountRecovery[1], accountRecovery[2]);
				this.setState({ nameCompromised });

				const checkCompromisedIntervalId = setInterval(async () => {
					await this.checkCompromised();
				}, 10000);
				this.setState({ checkCompromisedIntervalId });
			} else {
				this.setState(this._notCompromised);
			}
		}
		this.setState({ getNameCalled: true });
	}

	async checkCompromised() {
		const { nameAccountRecovery, resetLoggedInNameCompromised } = this.props;
		const { nameId } = this.state;
		if (!nameAccountRecovery || !nameId) {
			return;
		}

		const isCompromised = await promisify(nameAccountRecovery.isCompromised)(nameId);
		if (!isCompromised) {
			this.setState(this._notCompromised);
			resetLoggedInNameCompromised();
			clearInterval(this.state.checkCompromisedIntervalId);
		}
	}

	render() {
		const { nameId, nameCompromised, getNameCalled } = this.state;
		if (!getNameCalled) {
			return (
				<PageLayout>
					<ImgContainer>
						<img src={process.env.PUBLIC_URL + "/images/img_0.png"} alt={"AO Logo"} />
					</ImgContainer>
				</PageLayout>
			);
		}

		const _currentTimestamp = Math.round(new Date().getTime() / 1000);
		if (nameId && (nameCompromised.compromised || nameCompromised.lockedUntilTimestamp.gt(_currentTimestamp))) {
			return (
				<PageLayout compromised={true}>
					<CompromisedName nameId={nameId} nameCompromised={nameCompromised} />
				</PageLayout>
			);
		} else {
			return (
				<PageLayout>
					<div>{this.props.children}</div>
				</PageLayout>
			);
		}
	}
}

export { App };
