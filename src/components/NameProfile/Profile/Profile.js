import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { waitForTransactionReceipt } from "utils/web3";

class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			processingTransaction: true
		};
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
						this.props.setListener();
						this.setState({ processingTransaction: false });
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
						this.props.setSpeaker();
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
		const { isOwner, nameInfo, isListener, isSpeaker } = this.props;
		const { processingTransaction } = this.state;

		if (!nameInfo) {
			return null;
		}

		return (
			<Wrapper>
				<Title>Profile</Title>
				<FieldContainer>
					<FieldName>Name</FieldName>
					<FieldValue>
						{nameInfo.name} ({nameInfo.nameId})
						<p>
							{!isOwner && isListener && "(Your Listener)"} {!isOwner && isSpeaker && "(Your Speaker)"}
						</p>
					</FieldValue>
					{!isOwner && !isListener && (
						<Icon
							className="animated bounceIn"
							onClick={() => this.setListener(nameInfo.nameId)}
							disabled={processingTransaction}
						>
							<img src={process.env.PUBLIC_URL + "/images/listener.png"} alt={"Set as Listener"} />
							<div>Set as Listener</div>
						</Icon>
					)}
					{!isOwner && !isSpeaker && (
						<Icon
							className="animated bounceIn"
							onClick={() => this.setSpeaker(nameInfo.nameId)}
							disabled={processingTransaction}
						>
							<img src={process.env.PUBLIC_URL + "/images/speaker.png"} alt={"Set as Speaker"} />
							<div>Set as Speaker</div>
						</Icon>
					)}
				</FieldContainer>
			</Wrapper>
		);
	}
}

export { Profile };
