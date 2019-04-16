import * as React from "react";
import { PageLayout } from "layouts/PageLayout/";
import { EMPTY_ADDRESS } from "common/constants";
import { ImgContainer } from "./styledComponents";
import { CompromisedName } from "components/CompromisedName/";
import { BigNumber } from "bignumber.js";
import { hashHistory } from "react-router";

const promisify = require("tiny-promisify");

class App extends React.Component {
	_isMounted = false;
	_notCompromised = { compromised: false, submittedTimestamp: new BigNumber(0), lockedUntilTimestamp: new BigNumber(0) };

	constructor(props) {
		super(props);

		this.state = {
			checkAccountIntervalId: undefined,
			checkCompromisedIntervalId: undefined,
			nameId: null,
			nameCompromised: null,
			position: null,
			getNameCalled: false,
			writerKeyChecked: false,
			writerKeyMatch: null
		};
	}

	isMobileDevice() {
		return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
	}

	async componentDidMount() {
		this._isMounted = true;
		this.props.detectMobileBrowser(this.isMobileDevice());
		await this.getName();
		const checkAccountIntervalId = setInterval(async () => {
			await this.checkAccount();
		}, 1000);
		this.setState({ checkAccountIntervalId });
	}

	componentWillUnmount() {
		this._isMounted = false;
		clearInterval(this.state.checkAccountIntervalId);
		clearInterval(this.state.checkCompromisedIntervalId);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.namesCompromised !== prevProps.namesCompromised) {
			clearInterval(this.state.checkCompromisedIntervalId);
			if (this._isMounted) {
				this.setState({
					checkCompromisedIntervalId: undefined
				});
			}
			await this.getName();
		}
	}

	async checkAccount() {
		const { web3, accounts } = this.props;
		if (!web3) {
			return;
		}

		const latestAccounts = await promisify(web3.eth.getAccounts)();
		if (
			(accounts && accounts.length > 0 && latestAccounts.length > 0 && latestAccounts[0] !== accounts[0]) ||
			(accounts && latestAccounts.length !== accounts.length) ||
			(latestAccounts.length && !accounts)
		) {
			window.location = "/";
		}
	}

	async getName() {
		const {
			nameFactory,
			nameAccountRecovery,
			accounts,
			setNameId,
			setLoggedInNameCompromised,
			resetLoggedInNameCompromised
		} = this.props;
		if (!nameFactory || !nameAccountRecovery || !accounts) {
			return;
		}
		const nameId = await promisify(nameFactory.ethAddressToNameId)(accounts[0]);
		if (nameId !== EMPTY_ADDRESS) {
			setNameId(nameId);
			if (this._isMounted) {
				this.setState({ nameId });
			}

			await this.getNamePosition();
			await this.checkWriterKey();

			const accountRecovery = await promisify(nameAccountRecovery.getAccountRecovery)(nameId);
			const isCompromised = await promisify(nameAccountRecovery.isCompromised)(nameId);
			if (isCompromised) {
				const nameCompromised = {
					compromised: true,
					submittedTimestamp: accountRecovery[1],
					lockedUntilTimestamp: accountRecovery[2]
				};
				setLoggedInNameCompromised(accountRecovery[1], accountRecovery[2]);
				if (this._isMounted) {
					this.setState({ nameCompromised });
				}

				const checkCompromisedIntervalId = setInterval(async () => {
					await this.checkCompromised();
				}, 10000);
				if (this._isMounted) {
					this.setState({ checkCompromisedIntervalId });
				}

				if (this.props.location.pathname !== "/") {
					hashHistory.push("/");
				}
			} else {
				if (this._isMounted) {
					this.setState({ nameCompromised: this._notCompromised });
				}
				resetLoggedInNameCompromised();
			}
		} else {
			this.resetName();
		}
		if (this._isMounted) {
			this.setState({ getNameCalled: true });
		}
	}

	async checkCompromised() {
		const { nameAccountRecovery } = this.props;
		const { nameId } = this.state;
		if (!nameAccountRecovery || !nameId) {
			return;
		}

		const isCompromised = await promisify(nameAccountRecovery.isCompromised)(nameId);
		if (!isCompromised) {
			this.resetName();
		}
	}

	async getNamePosition() {
		const { nameTAOPosition } = this.props;
		const { nameId } = this.state;
		if (!nameTAOPosition || !nameId) {
			return;
		}

		const _position = await promisify(nameTAOPosition.getPositionById)(nameId);
		const position = {
			advocateName: _position[0],
			advocateId: _position[1],
			listenerName: _position[2],
			listenerId: _position[3],
			speakerName: _position[4],
			speakerId: _position[5]
		};
		if (this._isMounted) {
			this.setState({ position });
		}
	}

	async checkWriterKey() {
		const { localWriterKey, namePublicKey } = this.props;
		const { nameId } = this.state;
		if (!nameId || !localWriterKey || !namePublicKey) {
			return;
		}
		const writerKeyMatch = await promisify(namePublicKey.isNameWriterKey)(nameId, localWriterKey);
		if (this._isMounted) {
			this.setState({ writerKeyChecked: true, writerKeyMatch });
		}
	}

	resetName() {
		this.props.setNameId(null);
		this.props.resetLoggedInNameCompromised();
		if (this._isMounted) {
			this.setState({ nameId: null, nameCompromised: this._notCompromised, position: null, writerKeyMatch: null });
		}
		clearInterval(this.state.checkCompromisedIntervalId);
	}

	render() {
		const { nameId, nameCompromised, getNameCalled, position, writerKeyChecked, writerKeyMatch } = this.state;
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
		if (
			nameId &&
			nameCompromised &&
			position &&
			(nameCompromised.compromised || nameCompromised.lockedUntilTimestamp.gt(_currentTimestamp))
		) {
			return (
				<PageLayout compromised={true}>
					<CompromisedName nameId={nameId} nameCompromised={nameCompromised} position={position} />
				</PageLayout>
			);
		} else if (nameId && writerKeyChecked && writerKeyMatch === false) {
			return <div>Write key not match</div>;
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
