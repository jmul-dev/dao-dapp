import * as React from "react";
import { Wrapper, Title, Button, Icon } from "components/";
import {
	OwnerContent,
	PublicKeyContainer,
	PublicKeyValue,
	PublicKeyBalance,
	PublicKeyAction,
	NonDefaultKeyAction
} from "./styledComponents";
import { AddPublicKeyContainer } from "./AddPublicKey/";
import { TransferIonContainer } from "./TransferIon/";
import { waitForTransactionReceipt } from "utils/web3";
import { EMPTY_ADDRESS } from "common/constants";
import { asyncForEach } from "utils/";
import { metamaskPopup } from "../../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";

const EthCrypto = require("eth-crypto");
const promisify = require("tiny-promisify");

class PublicKeys extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			defaultPublicKey: null,
			writerPublicKey: null,
			publicKeys: null,
			publicKeysBalance: {},
			showAddKeyForm: false,
			showTransferIonForm: false,
			processingTransaction: false,
			publicKeyInProcess: null,
			txHash: null
		};
		this.initialState = this.state;
		this.toggleAddKeyForm = this.toggleAddKeyForm.bind(this);
		this.toggleTransferIonForm = this.toggleTransferIonForm.bind(this);
		this.appendPublicKey = this.appendPublicKey.bind(this);
		this.refreshPublicKeyBalance = this.refreshPublicKeyBalance.bind(this);
	}

	async componentDidMount() {
		this._isMounted = true;

		const { id } = this.props;
		await this.getNamePublicKey(id);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
			this.setState(this.initialState);

			const { id } = this.props;
			await this.getNamePublicKey(id);
		}
	}

	async getNamePublicKey(id) {
		const { namePublicKey, aoion } = this.props;
		if (!namePublicKey || !aoion || !id) {
			return;
		}
		const defaultPublicKey = await promisify(namePublicKey.getDefaultKey)(id);
		const writerPublicKey = await promisify(namePublicKey.getWriterKey)(id);
		const totalPublicKeys = await promisify(namePublicKey.getTotalPublicKeysCount)(id);
		const _publicKeys = await promisify(namePublicKey.getKeys)(id, 0, totalPublicKeys.toNumber());
		const publicKeys = _publicKeys.filter((_publicKey) => _publicKey !== EMPTY_ADDRESS);
		const publicKeysBalance = {};
		await asyncForEach(publicKeys, async (publicKey) => {
			const networkBalance = await promisify(aoion.balanceOf)(publicKey);
			const primordialBalance = await promisify(aoion.primordialBalanceOf)(publicKey);
			publicKeysBalance[publicKey] = { networkBalance, primordialBalance };
		});
		if (this._isMounted) {
			this.setState({ defaultPublicKey, writerPublicKey, publicKeys, publicKeysBalance });
		}
	}

	toggleAddKeyForm() {
		this.setState({ showAddKeyForm: !this.state.showAddKeyForm });
	}

	toggleTransferIonForm() {
		this.setState({ showTransferIonForm: !this.state.showTransferIonForm });
	}

	async appendPublicKey(publicKey) {
		const { aoion } = this.props;
		if (!aoion) {
			return;
		}
		const networkBalance = await promisify(aoion.balanceOf)(publicKey);
		const primordialBalance = await promisify(aoion.primordialBalanceOf)(publicKey);
		this.state.publicKeys.push(publicKey);
		this.state.publicKeysBalance[publicKey] = { networkBalance, primordialBalance };
		this.setState({ publicKeys: this.state.publicKeys, publicKeysBalance: this.state.publicKeysBalance });
	}

	async setDefaultPublicKey(publicKey) {
		const { web3, accounts, id, namePublicKey } = this.props;
		if (!web3 || !accounts || !id || !namePublicKey) {
			return;
		}
		const signHash = EthCrypto.hash.keccak256([
			{
				type: "address",
				value: namePublicKey.address
			},
			{
				type: "address",
				value: id
			},
			{
				type: "address",
				value: publicKey
			}
		]);
		this.setState({ processingTransaction: true, publicKeyInProcess: publicKey, txHash: null });
		web3.eth.sign(accounts[0], signHash, async (err, signature) => {
			if (err) {
				this.setState({ processingTransaction: false, publicKeyInProcess: null });
			} else {
				const vrs = EthCrypto.vrs.fromString(signature);
				metamaskPopup();
				namePublicKey.setDefaultKey(id, publicKey, vrs.v, vrs.r, vrs.s, { from: accounts[0] }, (err, transactionHash) => {
					if (err) {
						this.setState({ processingTransaction: false, publicKeyInProcess: null });
						this.props.setError("Error", err.message, false);
					} else {
						this.setState({ txHash: transactionHash });
						waitForTransactionReceipt(transactionHash)
							.then(() => {
								this.setState({ processingTransaction: false, publicKeyInProcess: null, defaultPublicKey: publicKey });
							})
							.catch((err) => {
								this.setState({ processingTransaction: false, publicKeyInProcess: null });
								this.props.setError("Error", err.message, false);
							});
					}
				});
			}
		});
	}

	async removePublicKey(publicKey) {
		const { id, namePublicKey, accounts } = this.props;
		if (!namePublicKey || !id || !accounts) {
			return;
		}
		this.setState({ processingTransaction: true, publicKeyInProcess: publicKey, txHash: null });
		metamaskPopup();
		namePublicKey.removeKey(id, publicKey, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ processingTransaction: false, publicKeyInProcess: null });
				this.props.setError("Error", err.message, false);
			} else {
				this.setState({ txHash: transactionHash });
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						const publicKeys = this.state.publicKeys.filter((_publicKey) => _publicKey !== publicKey);
						this.setState({ processingTransaction: false, publicKeyInProcess: null, publicKeys });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false, publicKeyInProcess: null });
						this.props.setError("Error", err.message, false);
					});
			}
		});
	}

	async refreshPublicKeyBalance(publicKey) {
		const { aoion } = this.props;
		if (!aoion) {
			return;
		}
		const networkBalance = await promisify(aoion.balanceOf)(publicKey);
		const primordialBalance = await promisify(aoion.primordialBalanceOf)(publicKey);
		this.state.publicKeysBalance[publicKey] = { networkBalance, primordialBalance };
		this.setState({ publicKeysBalance: this.state.publicKeysBalance });
	}

	render() {
		const {
			defaultPublicKey,
			writerPublicKey,
			publicKeys,
			publicKeysBalance,
			showAddKeyForm,
			showTransferIonForm,
			processingTransaction,
			publicKeyInProcess,
			txHash
		} = this.state;
		const { singlePageView } = this.props;

		let ownerFeatures = null,
			publicKeysContent = null;

		if (publicKeys) {
			publicKeysContent = publicKeys.map((publicKey) => {
				let className, publicKeyAction;
				if (publicKey === defaultPublicKey || publicKey === writerPublicKey) {
					className = "default";
					publicKeyAction = publicKey === defaultPublicKey ? "(default)" : "(writer)";
				} else {
					if (processingTransaction && publicKey === publicKeyInProcess) {
						publicKeyAction = (
							<Wrapper>
								<div>Loading...</div>
								{txHash && <TxHashContainer txHash={txHash} small={true} />}
							</Wrapper>
						);
					} else {
						publicKeyAction = (
							<NonDefaultKeyAction key={publicKey}>
								<Button
									className="small"
									onClick={() => this.setDefaultPublicKey(publicKey)}
									disabled={processingTransaction}
								>
									Set Default
								</Button>
								<Button
									className="small red margin-left"
									onClick={() => this.removePublicKey(publicKey)}
									disabled={processingTransaction}
								>
									Remove
								</Button>
							</NonDefaultKeyAction>
						);
					}
				}

				return (
					<PublicKeyContainer key={publicKey} className={className}>
						<PublicKeyValue>{publicKey}</PublicKeyValue>
						<PublicKeyBalance>{publicKeysBalance[publicKey].networkBalance.toNumber()} AO</PublicKeyBalance>
						<PublicKeyBalance>{publicKeysBalance[publicKey].primordialBalance.toNumber()} AO+</PublicKeyBalance>
						<PublicKeyAction>{publicKeyAction}</PublicKeyAction>
					</PublicKeyContainer>
				);
			});
		}
		ownerFeatures = (
			<OwnerContent>
				<Title className={singlePageView ? "margin-top" : ""}>Public Keys</Title>
				{publicKeysContent}
				{!showAddKeyForm && !showTransferIonForm && (
					<div>
						<Icon className="animated bounceIn" onClick={this.toggleAddKeyForm} disabled={processingTransaction}>
							<img src={process.env.PUBLIC_URL + "/images/add.png"} alt={"Add Public Key"} />
							<div>Add Public Key</div>
						</Icon>
						{publicKeys && publicKeys.length > 1 && (
							<Icon className="animated bounceIn" onClick={this.toggleTransferIonForm} disabled={processingTransaction}>
								<img src={process.env.PUBLIC_URL + "/images/transfer.png"} alt={"Transfer Ion"} />
								<div>Transfer Ion</div>
							</Icon>
						)}
					</div>
				)}
				{showAddKeyForm || showTransferIonForm
					? [
							showAddKeyForm ? (
								<AddPublicKeyContainer
									toggleAddKeyForm={this.toggleAddKeyForm}
									appendPublicKey={this.appendPublicKey}
									key={"Add Public Key"}
								/>
							) : (
								<TransferIonContainer
									toggleTransferIonForm={this.toggleTransferIonForm}
									publicKeys={publicKeys}
									refreshPublicKeyBalance={this.refreshPublicKeyBalance}
									key={"Transfer Ion"}
								/>
							)
					  ]
					: null}
			</OwnerContent>
		);
		return <Wrapper>{ownerFeatures}</Wrapper>;
	}
}

export { PublicKeys };
