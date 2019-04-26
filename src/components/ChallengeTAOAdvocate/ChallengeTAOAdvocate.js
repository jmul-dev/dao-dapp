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
			advocateId: null,
			advocateLogos: null,
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
		} else if (this.props.taoPositions !== prevProps.taoPositions) {
			await this.getTAOAdvocate();
		}
	}

	async getData() {
		await this.getTAOInfo();
		await this.getTAOAdvocate();
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

	async getTAOAdvocate() {
		const { id } = this.props.params;
		const { nameTAOPosition, logos } = this.props;
		if (!nameTAOPosition || !logos || !id) {
			return;
		}

		const advocateId = await promisify(nameTAOPosition.getAdvocate)(id);
		const advocateLogos = await promisify(logos.sumBalanceOf)(advocateId);
		if (this._isMounted) {
			this.setState({ advocateId, advocateLogos });
		}
	}

	async getActiveChallenge() {
		const { id } = this.props.params;
		const { nameTAOPosition, challengeTAOAdvocates, accounts, nameId } = this.props;
		if (!nameTAOPosition || !challengeTAOAdvocates || !accounts || !nameId || !id) {
			return;
		}

		const challenges = challengeTAOAdvocates.filter((challenge) => challenge.taoId === id && challenge.challengerAdvocateId === nameId);
		if (challenges.length) {
			const sortedChallenges = _.orderBy(
				challenges,
				[
					(c) => {
						return c.createdTimestamp.toNumber();
					}
				],
				["desc"]
			);
			const challengeStatus = await promisify(nameTAOPosition.getChallengeStatus)(sortedChallenges[0].challengeId, accounts[0]);
			const currentTimestamp = Math.round(new Date().getTime() / 1000);
			if (sortedChallenges[0].lockedUntilTimestamp.gte(currentTimestamp) && challengeStatus.eq(4) && this._isMounted) {
				this.setState({ activeChallenge: sortedChallenges[0] });
			}
		}
	}

	render() {
		const { id } = this.props.params;
		const { taoInfo, advocateId, advocateLogos, activeChallenge, dataPopulated } = this.state;
		const { pastEventsRetrieved, names, nameId, taoCurrencyBalances } = this.props;
		if (!pastEventsRetrieved || !names || !nameId || !taoCurrencyBalances || !dataPopulated) {
			return <ProgressLoaderContainer />;
		}

		const advocate = names.find((name) => name.nameId === advocateId);
		const challenger = names.find((name) => name.nameId === nameId);

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${id}`}>
					Back to TAO Details
				</Ahref>
				<Wrapper className="margin-bottom-20">
					<Title className="medium margin-top-20 margin-bottom-0">Challenge {taoInfo.name}'s Advocate</Title>
				</Wrapper>
				{!activeChallenge ? (
					<ChallengeFormContainer
						id={id}
						taoInfo={taoInfo}
						advocate={{ ...advocate, logos: advocateLogos }}
						challenger={{ ...challenger, logos: taoCurrencyBalances.logos }}
					/>
				) : (
					<ViewActiveChallenge
						id={id}
						taoInfo={taoInfo}
						advocate={{ ...advocate, logos: advocateLogos }}
						challenger={{ ...challenger, logos: taoCurrencyBalances.logos }}
						activeChallenge={activeChallenge}
					/>
				)}
			</Wrapper>
		);
	}
}

export { ChallengeTAOAdvocate };
