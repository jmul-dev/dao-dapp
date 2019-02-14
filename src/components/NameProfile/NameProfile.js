import * as React from "react";
import { Wrapper, Title, Ahref, Button, Icon, FieldContainer, FieldName, FieldValue } from "components/";
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
import { LogosDetailContainer } from "./LogosDetail/";
import { waitForTransactionReceipt } from "utils/web3";
import { EMPTY_ADDRESS } from "common/constants";
import { setError } from "widgets/Toast/actions";
import { asyncForEach } from "utils/";

const EthCrypto = require("eth-crypto");
const promisify = require("tiny-promisify");

class NameProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOwner: false,
			nameInfo: null,
			position: null,
			defaultPublicKey: null,
			publicKeys: null,
			publicKeysBalance: {},
			showAddKeyForm: false,
			showTransferIonForm: false,
			processingTransaction: false,
			publicKeyInProcess: null,
			isListener: false,
			isSpeaker: false
		};
		this.initialState = this.state;
		this.toggleAddKeyForm = this.toggleAddKeyForm.bind(this);
		this.toggleTransferIonForm = this.toggleTransferIonForm.bind(this);
		this.appendPublicKey = this.appendPublicKey.bind(this);
		this.refreshPublicKeyBalance = this.refreshPublicKeyBalance.bind(this);
	}

	async componentDidMount() {
		const { id } = this.props.params;
		await this.getNameInfo(id);
		await this.getNamePosition(id);

		// Owner features only
		if (id === this.props.nameId) {
			this.setState({ isOwner: true });
			await this.getNamePublicKey(id);
		} else {
			await this.checkListenerSpeaker(id);
		}
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);

			const { id } = this.props.params;
			await this.getNameInfo(id);
			await this.getNamePosition(id);

			// Owner features only
			if (id === this.props.nameId) {
				this.setState({ isOwner: true });
				await this.getNamePublicKey(id);
			} else {
				await this.checkListenerSpeaker(id);
			}
		}
	}

	async getNameInfo(id) {
		const { nameTAOLookup } = this.props;
		if (!nameTAOLookup || !id) {
			return;
		}

		const _nameInfo = await promisify(nameTAOLookup.getById)(id);
		const nameInfo = {
			name: _nameInfo[0],
			nameId: _nameInfo[1],
			typeId: _nameInfo[2],
			parentName: _nameInfo[3],
			parentId: _nameInfo[4],
			parentTypeId: _nameInfo[5]
		};
		this.setState({ nameInfo });
	}

	async getNamePosition(id) {
		const { nameTAOPosition } = this.props;
		if (!nameTAOPosition || !id) {
			return;
		}

		const _position = await promisify(nameTAOPosition.getPositionById)(id);
		const position = {
			advocateName: _position[0],
			advocateId: _position[1],
			listenerName: _position[2],
			listenerId: _position[3],
			speakerName: _position[4],
			speakerId: _position[5]
		};
		this.setState({ position });
	}

	async getNamePublicKey(id) {
		const { namePublicKey, aoion } = this.props;
		if (!namePublicKey || !aoion || !id) {
			return;
		}
		const defaultPublicKey = await promisify(namePublicKey.getDefaultKey)(id);
		const totalPublicKeys = await promisify(namePublicKey.getTotalPublicKeysCount)(id);
		const _publicKeys = await promisify(namePublicKey.getKeys)(id, 0, totalPublicKeys.toNumber());
		const publicKeys = _publicKeys.filter((_publicKey) => _publicKey !== EMPTY_ADDRESS);
		const publicKeysBalance = {};
		await asyncForEach(publicKeys, async (publicKey) => {
			const networkBalance = await promisify(aoion.balanceOf)(publicKey);
			const primordialBalance = await promisify(aoion.primordialBalanceOf)(publicKey);
			publicKeysBalance[publicKey] = { networkBalance, primordialBalance };
		});
		this.setState({ defaultPublicKey, publicKeys, publicKeysBalance });
	}

	async checkListenerSpeaker(id) {
		const { nameTAOPosition, nameId } = this.props;
		if (!id || !nameTAOPosition || !nameId) {
			return;
		}

		const _position = await promisify(nameTAOPosition.getPositionById)(nameId);
		this.setState({ isListener: _position[3] === id, isSpeaker: _position[5] === id });
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
		const { web3, accounts, nameId, namePublicKey } = this.props;
		if (!web3 || !accounts || !nameId || !namePublicKey) {
			return;
		}
		const signHash = EthCrypto.hash.keccak256([
			{
				type: "address",
				value: namePublicKey.address
			},
			{
				type: "address",
				value: nameId
			},
			{
				type: "address",
				value: publicKey
			}
		]);
		this.setState({ processingTransaction: true, publicKeyInProcess: publicKey });
		web3.eth.sign(accounts[0], signHash, async (err, signature) => {
			if (err) {
				this.setState({ processingTransaction: false, publicKeyInProcess: null });
			} else {
				const vrs = EthCrypto.vrs.fromString(signature);
				namePublicKey.setDefaultKey(nameId, publicKey, vrs.v, vrs.r, vrs.s, { from: accounts[0] }, (err, transactionHash) => {
					if (err) {
						this.setState({ processingTransaction: false, publicKeyInProcess: null });
						setError(err);
					} else {
						waitForTransactionReceipt(transactionHash)
							.then(() => {
								this.setState({ processingTransaction: false, publicKeyInProcess: null, defaultPublicKey: publicKey });
							})
							.catch((err) => {
								this.setState({ processingTransaction: false, publicKeyInProcess: null });
								setError(err);
							});
					}
				});
			}
		});
	}

	async removePublicKey(publicKey) {
		const { nameId, namePublicKey, accounts } = this.props;
		if (!namePublicKey || !nameId || !accounts) {
			return;
		}
		this.setState({ processingTransaction: true, publicKeyInProcess: publicKey });
		namePublicKey.removeKey(nameId, publicKey, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ processingTransaction: false, publicKeyInProcess: null });
				setError(err);
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						const publicKeys = this.state.publicKeys.filter((_publicKey) => _publicKey !== publicKey);
						this.setState({ processingTransaction: false, publicKeyInProcess: null, publicKeys });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false, publicKeyInProcess: null });
						setError(err);
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

	async setListener(id) {
		const { accounts, nameId, nameTAOPosition } = this.props;
		if (!accounts || !nameId || !nameTAOPosition || !id) {
			return;
		}

		this.setState({ processingTransaction: true });
		nameTAOPosition.setListener(nameId, id, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ processingTransaction: false });
				setError(err);
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ processingTransaction: false, isListener: true });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false });
						setError(err);
					});
			}
		});
	}

	async setSpeaker(id) {
		const { accounts, nameId, nameTAOPosition } = this.props;
		if (!accounts || !nameId || !nameTAOPosition || !id) {
			return;
		}

		this.setState({ processingTransaction: true });
		nameTAOPosition.setSpeaker(nameId, id, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ processingTransaction: false });
				setError(err);
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ processingTransaction: false, isSpeaker: true });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false });
						setError(err);
					});
			}
		});
	}

	render() {
		const {
			isOwner,
			nameInfo,
			position,
			defaultPublicKey,
			publicKeys,
			publicKeysBalance,
			showAddKeyForm,
			showTransferIonForm,
			processingTransaction,
			publicKeyInProcess,
			isListener,
			isSpeaker
		} = this.state;
		if (!nameInfo || !position) {
			return null;
		}

		let setListenerContent = null,
			setSpeakerContent = null,
			ownerFeatures = null,
			publicKeysContent = null;
		if (isOwner) {
			if (publicKeys) {
				publicKeysContent = publicKeys.map((publicKey) => (
					<PublicKeyContainer key={publicKey} className={publicKey === defaultPublicKey && "default"}>
						<PublicKeyValue>{publicKey}</PublicKeyValue>
						<PublicKeyBalance>{publicKeysBalance[publicKey].networkBalance.toNumber()} AO</PublicKeyBalance>
						<PublicKeyBalance>{publicKeysBalance[publicKey].primordialBalance.toNumber()} AO+</PublicKeyBalance>
						<PublicKeyAction>
							{publicKey === defaultPublicKey
								? "(default)"
								: [
										processingTransaction && publicKey === publicKeyInProcess ? (
											"Loading..."
										) : (
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
										)
								  ]}
						</PublicKeyAction>
					</PublicKeyContainer>
				));
			}
			ownerFeatures = (
				<OwnerContent>
					<Title className="margin-top">Public Keys</Title>
					<FieldContainer>
						<FieldValue>{publicKeysContent}</FieldValue>
					</FieldContainer>
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
		} else {
			if (!isListener) {
				setListenerContent = (
					<Icon className="animated bounceIn" onClick={() => this.setListener(nameInfo.nameId)} disabled={processingTransaction}>
						<img src={process.env.PUBLIC_URL + "/images/listener.png"} alt={"Set as Listener"} />
						<div>Set as Listener</div>
					</Icon>
				);
			}
			if (!isSpeaker) {
				setSpeakerContent = (
					<Icon className="animated bounceIn" onClick={() => this.setSpeaker(nameInfo.nameId)} disabled={processingTransaction}>
						<img src={process.env.PUBLIC_URL + "/images/speaker.png"} alt={"Set as Speaker"} />
						<div>Set as Speaker</div>
					</Icon>
				);
			}
		}
		return (
			<Wrapper className="padding-40">
				<Title>Profile</Title>
				<FieldContainer>
					<FieldName>Name</FieldName>
					<FieldValue>
						{nameInfo.name} ({nameInfo.nameId}) {!isOwner && isListener && "(Your Listener)"}{" "}
						{!isOwner && isSpeaker && "(Your Speaker)"}
					</FieldValue>
					<div>
						{setListenerContent}
						{setSpeakerContent}
					</div>
				</FieldContainer>
				<Title className="margin-top">Position</Title>
				<FieldContainer>
					<FieldName>Advocate</FieldName>
					<FieldValue>
						<Ahref to={`/profile/${position.advocateId}`}>
							{position.advocateName} ({position.advocateId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Listener</FieldName>
					<FieldValue>
						<Ahref to={`/profile/${position.listenerId}`}>
							{position.listenerName} ({position.listenerId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Speaker</FieldName>
					<FieldValue>
						<Ahref to={`/profile/${position.speakerId}`}>
							{position.speakerName} ({position.speakerId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				{isOwner && <LogosDetailContainer />}
				{isOwner && ownerFeatures}
			</Wrapper>
		);
	}
}

export { NameProfile };
