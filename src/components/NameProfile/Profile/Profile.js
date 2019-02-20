import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOwner: false,
			nameInfo: null,
			isListener: false,
			isSpeaker: false,
			processingTransaction: true
		};
		this.initialState = this.state;
	}

	async componentDidMount() {
		const { id, nameId } = this.props;
		await this.getNameInfo(id);
		if (id === nameId) {
			this.setState({ isOwner: true });
		} else {
			await this.checkListenerSpeaker(id);
		}
	}

	async componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
			this.setState(this.initialState);
			const { id, nameId } = this.props;
			await this.getNameInfo(id);
			if (id === nameId) {
				this.setState({ isOwner: true });
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

	async checkListenerSpeaker(id) {
		const { nameTAOPosition, nameId } = this.props;
		if (!id || !nameTAOPosition || !nameId) {
			return;
		}
		const _position = await promisify(nameTAOPosition.getPositionById)(nameId);
		this.setState({ isListener: _position[3] === id, isSpeaker: _position[5] === id });
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
				this.props.setError("Error", err.message, false);
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ processingTransaction: false, isListener: true });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false });
						this.props.setError("Error", err.message, false);
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
				this.props.setError("Error", err.message, false);
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ processingTransaction: false, isSpeaker: true });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false });
						this.props.setError("Error", err.message, false);
					});
			}
		});
	}

	render() {
		const { isOwner, nameInfo, isListener, isSpeaker, processingTransaction } = this.state;

		if (!nameInfo) {
			return null;
		}

		let setListenerContent = null,
			setSpeakerContent = null;

		if (!isOwner) {
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
			</Wrapper>
		);
	}
}

export { Profile };
