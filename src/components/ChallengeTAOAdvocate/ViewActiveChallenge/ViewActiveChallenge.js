import * as React from "react";
import { Wrapper, Title, Header, LeftContainer, RightContainer, FieldContainer, FieldName, FieldValue, Error, Button } from "components/";
import { Countdown } from "widgets/Countdown/";
import { formatDate } from "utils/";
import { BarChart } from "widgets/BarChart/";
import { waitForTransactionReceipt } from "utils/web3";
import { hashHistory } from "react-router";
import { metamaskPopup } from "../../../utils/electron";

const promisify = require("tiny-promisify");

class ViewActiveChallenge extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async handleSubmit() {
		const { nameTAOPosition, accounts, nameId, activeChallenge, taoInfo } = this.props;
		if (!nameTAOPosition || !accounts || !nameId || !activeChallenge || !taoInfo) {
			return;
		}
		if (this._isMounted) {
			this.setState({ formLoading: true });
		}
		const challengeStatus = await promisify(nameTAOPosition.getChallengeStatus)(activeChallenge.challengeId, accounts[0]);
		switch (challengeStatus.toNumber()) {
			case 2:
				this.setState({
					error: true,
					errorMessage: "Invalid challenge ID",
					formLoading: false
				});
				return false;
			case 3:
				this.setState({
					error: true,
					errorMessage: "Challenger does not match",
					formLoading: false
				});
				return false;
			case 4:
				this.setState({
					error: true,
					errorMessage: "Claim Advocate position period has not yet started",
					formLoading: false
				});
				return false;
			case 5:
				this.setState({
					error: true,
					errorMessage: "Challenge has expired",
					formLoading: false
				});
				return false;
			case 6:
				this.setState({
					error: true,
					errorMessage: "Challenge has been completed",
					formLoading: false
				});
				return false;
			case 7:
				this.setState({
					error: true,
					errorMessage: "You don't have enough logos to claim the Advocate position",
					formLoading: false
				});
				return false;
			default:
				break;
		}
		metamaskPopup();
		nameTAOPosition.completeTAOAdvocateChallenge(activeChallenge.challengeId, { from: accounts[0] }, (err, transactionHash) => {
			if (err && this._isMounted) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(async () => {
						if (this._isMounted) {
							this.setState({ error: false, errorMessage: "", formLoading: false });
						}
						setTimeout(() => {
							hashHistory.push(`/tao/${activeChallenge.taoId}`);
						}, 2000);
					})
					.catch((err) => {
						if (this._isMounted) {
							this.setState({ error: true, errorMessage: err.message, formLoading: false });
						}
					});
			}
		});
	}

	render() {
		const { taoInfo, advocate, challenger, activeChallenge, challengeStatus, nameId } = this.props;
		const { error, errorMessage, formLoading } = this.state;

		if (!nameId) {
			return null;
		}
		if (advocate.nameId === nameId) {
			return (
				<Wrapper>
					<Title>You are the Advocate of {taoInfo.name}</Title>
				</Wrapper>
			);
		}

		const losingColor = "rgba(220, 220, 220, 0.2)";
		const winningColor = "rgba(0, 204, 71, 0.8)";
		const logosData = {
			labels: ["Current Advocate", "Challenger"],
			datasets: [
				{
					fillColor: [
						advocate.logos.gt(challenger.logos) ? winningColor : losingColor,
						challenger.logos.gt(advocate.logos) ? winningColor : losingColor
					],
					data: [advocate.logos.toNumber(), challenger.logos.toNumber()]
				}
			]
		};

		let challengeMessage, countdownContent, claimButton;
		const currentTimestamp = Math.round(new Date().getTime() / 1000);
		if (challengeStatus.eq(4)) {
			challengeMessage = (
				<Wrapper>
					A challenge to be {taoInfo.name}'s new Advocate was submitted by you on{" "}
					{formatDate(activeChallenge.createdTimestamp.toNumber())}. Both you and the current Advocate of {taoInfo.name} will have
					the opportunity to respond to this challenge before {formatDate(activeChallenge.lockedUntilTimestamp.toNumber())}. The
					one with higher Logos will be the new Advocate of {taoInfo.name}.
				</Wrapper>
			);
			countdownContent = (
				<Wrapper className="margin-top-20">
					<Title>Challenge period will end in</Title>
					<Countdown date={formatDate(activeChallenge.lockedUntilTimestamp.toNumber())} />
				</Wrapper>
			);
		} else if (
			challengeStatus.eq(1) &&
			activeChallenge.completeBeforeTimestamp.gte(currentTimestamp) &&
			challenger.logos.gt(advocate.logos)
		) {
			challengeMessage = (
				<Wrapper>
					Congratulations! You have won the challenge to be the new Advocate of {taoInfo.name}. Please claim this position before{" "}
					{formatDate(activeChallenge.completeBeforeTimestamp.toNumber())} to complete the process.
				</Wrapper>
			);
			countdownContent = (
				<Wrapper className="margin-top-20">
					<Title>Claim period will end in</Title>
					<Countdown date={formatDate(activeChallenge.completeBeforeTimestamp.toNumber())} />
				</Wrapper>
			);
			claimButton = (
				<Wrapper className="margin-top-20">
					<Button type="button" onClick={this.handleSubmit}>
						{formLoading ? "Loading..." : "Claim Advocate Position"}
					</Button>
					{error && errorMessage && <Error>{errorMessage}</Error>}
				</Wrapper>
			);
		} else {
			challengeMessage = <Wrapper>This challenge has expired.</Wrapper>;
			countdownContent = null;
		}

		return (
			<Wrapper>
				<Header>{challengeMessage}</Header>
				<Wrapper className="margin-top-20">
					<LeftContainer>
						<FieldContainer>
							<FieldName className="big">{advocate.name}'s Logos (Current Advocate)</FieldName>
							<FieldValue className={advocate.logos.gt(challenger.logos) ? "big green" : "big"}>
								{advocate.logos.toNumber()}
							</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName className="big">{challenger.name}'s Logos (Challenger)</FieldName>
							<FieldValue className={challenger.logos.gt(advocate.logos) ? "big green" : "big"}>
								{challenger.logos.toNumber()}
							</FieldValue>
						</FieldContainer>
						{claimButton}
						{countdownContent}
					</LeftContainer>
					<RightContainer>
						<BarChart title={`Logos Chart`} data={logosData} height={300} />
					</RightContainer>
				</Wrapper>
			</Wrapper>
		);
	}
}

export { ViewActiveChallenge };
