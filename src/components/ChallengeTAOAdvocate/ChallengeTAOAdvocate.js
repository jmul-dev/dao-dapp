import * as React from "react";
import { Wrapper, Title, Ahref } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { ChallengeFormContainer } from "./ChallengeForm/";
import { ViewActiveChallenge } from "./ViewActiveChallenge/";
import * as _ from "lodash";

const promisify = require("tiny-promisify");

class ChallengeTAOAdvocate extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			activeChallenge: null,
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
		if (this.props.params.id !== prevProps.params.id) {
			if (this._isMounted) {
				this.setState(this.initialState);
			}
			await this.getData();
		} else if (this.props.challengeTAOAdvocates !== prevProps.challengeTAOAdvocates) {
			await this.getActiveChallenge();
		}
	}

	async getData() {
		await this.getTAOInfo();
		await this.getActiveChallenge();
		if (this._isMounted) {
			this.setState({ dataPopulated: true });
		}
	}

	async getTAOInfo() {
		const { id } = this.props.params;
		const { taoFactory } = this.props;
		if (!taoFactory || !id) {
			return;
		}

		const _taoInfo = await promisify(taoFactory.getTAO)(id);
		const taoInfo = {
			name: _taoInfo[0]
		};
		if (this._isMounted) {
			this.setState({ taoInfo });
		}
	}

	async getActiveChallenge() {
		const { id } = this.props.params;
		const { nameTAOPosition, challengeTAOAdvocates, accounts } = this.props;
		if (!nameTAOPosition || !challengeTAOAdvocates || !accounts || !id) {
			return;
		}

		const challenges = challengeTAOAdvocates.filter((challenge) => challenge.taoId === id);
		if (challenges.length) {
			const sortedChallenges = _.orderBy(challenges, ["createdTimestamp"], ["desc"]);
			const challengeStatus = await promisify(nameTAOPosition.getChallengeStatus)(sortedChallenges[0].challengeId, accounts[0]);
			const currentTimestamp = Math.round(new Date().getTime() / 1000);
			if (
				(sortedChallenges[0].lockedUntilTimestamp.gte(currentTimestamp) ||
					sortedChallenges[0].completeBeforeTimestamp.lte(currentTimestamp)) &&
				challengeStatus.eq(4) &&
				this._isMounted
			) {
				this.setState({ activeChallenge: sortedChallenges[0] });
			}
		}
	}

	render() {
		const { id } = this.props.params;
		const { taoInfo, activeChallenge, dataPopulated } = this.state;
		const { pastEventsRetrieved } = this.props;
		if (!pastEventsRetrieved || !dataPopulated) {
			return <ProgressLoaderContainer />;
		}

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${id}`}>
					Back to TAO Details
				</Ahref>
				<Wrapper className="margin-bottom-20">
					<Title className="medium margin-top-20 margin-bottom-0">Challenge {taoInfo.name}'s Advocate</Title>
				</Wrapper>
				{!activeChallenge ? (
					<ChallengeFormContainer id={id} taoInfo={taoInfo} />
				) : (
					<ViewActiveChallenge id={id} taoInfo={taoInfo} activeChallenge={activeChallenge} />
				)}
			</Wrapper>
		);
	}
}

export { ChallengeTAOAdvocate };
