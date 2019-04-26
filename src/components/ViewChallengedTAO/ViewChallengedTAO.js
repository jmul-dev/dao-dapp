import * as React from "react";
import { Wrapper, Ahref, Title, Header, LeftContainer, RightContainer, FieldContainer, FieldName, FieldValue } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { Countdown } from "widgets/Countdown/";
import { formatDate } from "utils/";
import { BarChart } from "widgets/BarChart/";
import { hashHistory } from "react-router";

const promisify = require("tiny-promisify");

class ViewChallengedTAO extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			advocateId: null,
			advocateLogos: null,
			challengeInfo: null,
			challengerLogos: null,
			dataPopulated: false
		};
		this.initialState = this.state;
	}

	async componentDidMount() {
		this._isMounted = true;
		await this.getData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.challengeId !== prevProps.params.challengeId) {
			if (this._isMounted) {
				this.setState(this.initialState);
			}
			await this.getData();
		} else if (
			this.props.challengeTAOAdvocates !== prevProps.challengeTAOAdvocates ||
			this.props.taoPositions !== prevProps.taoPositions
		) {
			await this.getData();
		}
	}

	async getData() {
		const { challengeId } = this.props.params;
		const { taoFactory, nameTAOPosition, logos } = this.props;
		if (!taoFactory || !nameTAOPosition || !logos || !challengeId) {
			return;
		}

		try {
			const _challenge = await promisify(nameTAOPosition.getTAOAdvocateChallengeById)(challengeId);
			const _taoInfo = await promisify(taoFactory.getTAO)(_challenge[1]);
			const advocateId = await promisify(nameTAOPosition.getAdvocate)(_challenge[1]);
			const advocateLogos = await promisify(logos.sumBalanceOf)(advocateId);
			const challengerLogos = await promisify(logos.sumBalanceOf)(_challenge[0]);
			const taoInfo = {
				id: _challenge[1],
				name: _taoInfo[0]
			};
			const challengeInfo = {
				challengerId: _challenge[0],
				completed: _challenge[2],
				createdTimestamp: _challenge[3],
				lockedUntilTimestamp: _challenge[4],
				completeBeforeTimestamp: _challenge[5]
			};
			if (this._isMounted) {
				this.setState({ taoInfo, advocateId, advocateLogos, challengeInfo, challengerLogos, dataPopulated: true });
			}
		} catch (e) {
			if (this._isMounted) {
				this.setState({ dataPopulated: true });
			}
		}
	}

	render() {
		const { challengeId } = this.props.params;
		const { taoInfo, advocateId, advocateLogos, challengeInfo, challengerLogos, dataPopulated } = this.state;
		const { pastEventsRetrieved, names, nameId } = this.props;
		if (!pastEventsRetrieved || !names || !nameId || !dataPopulated) {
			return <ProgressLoaderContainer />;
		}

		const currentTimestamp = Math.round(new Date().getTime() / 1000);
		if (!challengeInfo) {
			return (
				<Wrapper>
					<Title>Unable to find this challenge</Title>
				</Wrapper>
			);
		} else if (challengeInfo.completed) {
			return (
				<Wrapper>
					<Title>This challenge has been completed</Title>
				</Wrapper>
			);
		} else if (challengeInfo.completeBeforeTimestamp.lt(currentTimestamp)) {
			return (
				<Wrapper>
					<Title>This challenge has expired</Title>
				</Wrapper>
			);
		}

		const advocate = names.find((name) => name.nameId === advocateId);
		const challenger = names.find((name) => name.nameId === challengeInfo.challengerId);

		const losingColor = "rgba(220, 220, 220, 0.2)";
		const winningColor = "rgba(0, 204, 71, 0.8)";
		const logosData = {
			labels: ["Current Advocate", "Challenger"],
			datasets: [
				{
					fillColor: [
						advocateLogos.gt(challengerLogos) ? winningColor : losingColor,
						challengerLogos.gt(advocateLogos) ? winningColor : losingColor
					],
					data: [advocateLogos.toNumber(), challengerLogos.toNumber()]
				}
			]
		};

		let challengeMessage, countdownContent;
		if (challengeInfo.lockedUntilTimestamp.gte(currentTimestamp)) {
			challengeMessage = (
				<Wrapper>
					A challenge to be {taoInfo.name}'s new Advocate was submitted by {challenger.name} on{" "}
					{formatDate(challengeInfo.createdTimestamp.toNumber())}.
					{advocateId === nameId
						? ` You have the opportunity to keep your position as the Advocate of ${
								taoInfo.name
						  } by surpassing the challenger's Logos balance before ${formatDate(
								challengeInfo.lockedUntilTimestamp.toNumber()
						  )}.`
						: ` Both challenger and the current Advocate of ${
								taoInfo.name
						  } will have the opportunity to respond to this challenge before ${formatDate(
								challengeInfo.lockedUntilTimestamp.toNumber()
						  )}.`}{" "}
					The one with higher Logos will be the new Advocate of {taoInfo.name}.
				</Wrapper>
			);
			countdownContent = (
				<Wrapper className="margin-top-20">
					<Title>Challenge period will end in</Title>
					<Countdown date={formatDate(challengeInfo.lockedUntilTimestamp.toNumber())} />
				</Wrapper>
			);
		} else {
			if (challengeInfo.challengerId === nameId) {
				hashHistory.push(`/challenge-tao-advocate/${taoInfo.id}`);
			}
			challengeMessage = (
				<Wrapper>
					Challenge was won by{" "}
					{advocateLogos.gt(challengerLogos)
						? `${advocate.name} (current Advocate)`
						: `${challenger.name} (challenger) and is waiting for the winner to claim the position before ${formatDate(
								challengeInfo.completeBeforeTimestamp
						  )}`}
					.
				</Wrapper>
			);
			countdownContent = (
				<Wrapper className="margin-top-20">
					<Title>Claim period will end in</Title>
					<Countdown date={formatDate(challengeInfo.completeBeforeTimestamp.toNumber())} />
				</Wrapper>
			);
		}

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${taoInfo.id}`}>
					View TAO Details
				</Ahref>
				<Wrapper className="margin-bottom-20">
					<Title className="medium margin-top-20 margin-bottom-0">{taoInfo.name}'s Advocate Challenge</Title>
					<Header>{challengeId}</Header>
				</Wrapper>
				<Header>{challengeMessage}</Header>
				<Wrapper className="margin-top-20">
					<LeftContainer>
						<FieldContainer>
							<FieldName className="big">{advocate.name}'s Logos (Current Advocate)</FieldName>
							<FieldValue className={advocateLogos.gt(challengerLogos) ? "big green" : "big"}>
								{advocateLogos.toNumber()}
							</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName className="big">{challenger.name}'s Logos (Challenger)</FieldName>
							<FieldValue className={challengerLogos.gt(advocateLogos) ? "big green" : "big"}>
								{challengerLogos.toNumber()}
							</FieldValue>
						</FieldContainer>
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

export { ViewChallengedTAO };
