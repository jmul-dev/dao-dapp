import * as React from "react";
import {
	Wrapper,
	Title,
	TitleMargin,
	FieldContainer,
	FieldName,
	FieldValue,
	StyledLink,
	OwnerContent,
	PublicKeyContainer,
	PublicKeyValue,
	PublicKeyBalance,
	PublicKeyAction,
	NonDefaultKeyAction,
	StyledButtonSmall,
	IconContainer
} from "./styledComponents";
import { AddPublicKeyContainer } from "./AddPublicKey/";
import { TransferIonContainer } from "./TransferIon/";
import { waitForTransactionReceipt } from "reducers/contractReducer";
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
		this.toggleAddKeyForm = this.toggleAddKeyForm.bind(this);
		this.toggleTransferIonForm = this.toggleTransferIonForm.bind(this);
		this.appendPublicKey = this.appendPublicKey.bind(this);
		this.setDefaultPublicKey = this.setDefaultPublicKey.bind(this);
		this.removePublicKey = this.removePublicKey.bind(this);
		this.refreshPublicKeyBalance = this.refreshPublicKeyBalance.bind(this);
	}

	async componentDidMount() {
		await this.getNameInfo();
		await this.getNamePosition();
		// Owner features only
		if (this.props.params.id === this.props.nameId) {
			this.setState({ isOwner: true });
			await this.getNamePublicKey();
		} else {
			await this.checkListenerSpeaker();
		}
	}

	async getNameInfo() {
		const { id } = this.props.params;
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

	async getNamePosition() {
		const { id } = this.props.params;
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

	async getNamePublicKey() {
		const { id } = this.props.params;
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

	async checkListenerSpeaker() {
		const { id } = this.props.params.id;
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
												<StyledButtonSmall
													onClick={() => this.setDefaultPublicKey(publicKey)}
													disabled={processingTransaction}
												>
													Set Default
												</StyledButtonSmall>
												<StyledButtonSmall
													className="remove"
													onClick={() => this.removePublicKey(publicKey)}
													disabled={processingTransaction}
												>
													Remove
												</StyledButtonSmall>
											</NonDefaultKeyAction>
										)
								  ]}
						</PublicKeyAction>
					</PublicKeyContainer>
				));
			}
			ownerFeatures = (
				<OwnerContent>
					<TitleMargin>Public Keys</TitleMargin>
					<FieldContainer>
						<FieldValue>{publicKeysContent}</FieldValue>
					</FieldContainer>
					{!showAddKeyForm && !showTransferIonForm && (
						<div>
							<IconContainer onClick={this.toggleAddKeyForm} disabled={processingTransaction}>
								<img src={process.env.PUBLIC_URL + "/images/add.png"} alt={"Add Public Key"} />
								<div>Add Public Key</div>
							</IconContainer>
							{publicKeys && publicKeys.length > 1 && (
								<IconContainer onClick={this.toggleTransferIonForm} disabled={processingTransaction}>
									<img src={process.env.PUBLIC_URL + "/images/transfer.png"} alt={"Transfer Ion"} />
									<div>Transfer Ion</div>
								</IconContainer>
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
					<IconContainer disabled={processingTransaction}>
						<img src={process.env.PUBLIC_URL + "/images/listener.png"} alt={"Set as Listener"} />
						<div>Set as Listener</div>
					</IconContainer>
				);
			}
			if (!isSpeaker) {
				setSpeakerContent = (
					<IconContainer disabled={processingTransaction}>
						<img src={process.env.PUBLIC_URL + "/images/speaker.png"} alt={"Set as Speaker"} />
						<div>Set as Speaker</div>
					</IconContainer>
				);
			}
		}
		return (
			<Wrapper>
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
				<TitleMargin>Position</TitleMargin>
				<FieldContainer>
					<FieldName>Advocate</FieldName>
					<FieldValue>
						<StyledLink to={`/profile/${position.advocateId}`}>
							{position.advocateName} ({position.advocateId})
						</StyledLink>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Listener</FieldName>
					<FieldValue>
						<StyledLink to={`/profile/${position.listenerId}`}>
							{position.listenerName} ({position.listenerId})
						</StyledLink>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Speaker</FieldName>
					<FieldValue>
						<StyledLink to={`/profile/${position.speakerId}`}>
							{position.speakerName} ({position.speakerId})
						</StyledLink>
					</FieldValue>
				</FieldContainer>
				{isOwner && ownerFeatures}
			</Wrapper>
		);
	}
}

export { NameProfile };
