import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { waitForTransactionReceipt } from "utils/web3";
import { formatDate } from "utils/";

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			processingTransaction: true
		};
		this.setListener = this.setListener.bind(this);
		this.setSpeaker = this.setSpeaker.bind(this);
		this.submitAccountRecovery = this.submitAccountRecovery.bind(this);
	}

	async setListener() {
		const { accounts, nameId, id, nameTAOPosition } = this.props;
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
						this.props.setListener();
						this.props.setSuccess("Success", "Listener was set successfully");
						this.setState({ processingTransaction: false });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false });
						this.props.setError("Error", err.message, false);
					});
			}
		});
	}

	async setSpeaker() {
		const { accounts, nameId, id, nameTAOPosition } = this.props;
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
						this.props.setSpeaker();
						this.props.setSuccess("Success", "Speaker was set successfully");
						this.setState({ processingTransaction: false });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false });
						this.props.setError("Error", err.message, false);
					});
			}
		});
	}

	async submitAccountRecovery() {
		const { accounts, id, nameAccountRecovery } = this.props;
		if (!accounts || !nameAccountRecovery || !id) {
			return;
		}

		this.setState({ processingTransaction: true });
		nameAccountRecovery.submitAccountRecovery(id, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ processingTransaction: false });
				this.props.setError("Error", err.message, false);
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.props.setCompromised();
						this.props.setSuccess("Success", "Account recovery was submitted successfully");
						this.setState({ processingTransaction: false });
					})
					.catch((err) => {
						this.setState({ processingTransaction: false });
						this.props.setError("Error", err.message, false);
					});
			}
		});
	}

	render() {
		const { id, isOwner, nameInfo, isListener, isSpeaker, isCompromised, lockedUntilTimestamp, nameId, namePositions } = this.props;
		const { processingTransaction } = this.state;

		if (!nameInfo || !nameId || !namePositions) {
			return null;
		}

		const namePosition = namePositions.find((name) => name.nameId === id);

		return (
			<Wrapper>
				<Title>Profile</Title>
				<FieldContainer>
					<FieldName>Name</FieldName>
					<FieldValue>
						{nameInfo.name} ({id})
						<p>
							{!isOwner && isListener && "(Your Listener)"} {!isOwner && isSpeaker && "(Your Speaker)"}
						</p>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Status</FieldName>
					<FieldValue>{isCompromised ? `Locked until ${formatDate(lockedUntilTimestamp.toNumber())}` : `Active`}</FieldValue>
				</FieldContainer>
				{!isOwner && !isListener && !isCompromised && (
					<Icon className="animated bounceIn" onClick={this.setListener} disabled={processingTransaction}>
						<img src={process.env.PUBLIC_URL + "/images/listener.png"} alt={"Set as Listener"} />
						<div>Set as Listener</div>
					</Icon>
				)}
				{!isOwner && !isSpeaker && !isCompromised && (
					<Icon className="animated bounceIn" onClick={this.setSpeaker} disabled={processingTransaction}>
						<img src={process.env.PUBLIC_URL + "/images/speaker.png"} alt={"Set as Speaker"} />
						<div>Set as Speaker</div>
					</Icon>
				)}
				{!isOwner && namePosition.listenerId === nameId && !isCompromised && (
					<Icon className="animated bounceIn" onClick={this.submitAccountRecovery} disabled={processingTransaction}>
						<img src={process.env.PUBLIC_URL + "/images/account_recovery.png"} alt={"Submit Account Recovery"} />
						<div>Submit Account Recovery</div>
					</Icon>
				)}
			</Wrapper>
		);
	}
}

export { Profile };
