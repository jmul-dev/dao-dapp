import * as React from "react";
import { Wrapper, Title, Ahref } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { DateColumn, TypeColumn, MessageColumn } from "./styledComponents";
import { formatDate } from "utils/";
import * as _ from "lodash";

class RequireActions extends React.Component {
	render() {
		const { pastEventsRetrieved, names, taos, challengedTAOAdvocates } = this.props;
		if (!pastEventsRetrieved || !names || !taos || !challengedTAOAdvocates) {
			return <ProgressLoaderContainer />;
		}

		let activeChallenges = [];
		if (challengedTAOAdvocates && challengedTAOAdvocates.length) {
			const currentTimestamp = Math.round(new Date().getTime() / 1000);
			activeChallenges = _.orderBy(
				challengedTAOAdvocates.filter((challenge) => challenge.lockedUntilTimestamp.gt(currentTimestamp)),
				[
					(c) => {
						return c.lockedUntilTimestamp.toNumber();
					}
				],
				["desc"]
			);
		}
		if (!activeChallenges.length) {
			return (
				<Wrapper className="padding-40">
					<Title>Require Actions</Title>
					<Wrapper className="margin-top-20">Currently, there is nothing that requires your action</Wrapper>
				</Wrapper>
			);
		} else {
			const requireActionsContent = activeChallenges.map((challenge) => {
				const challenger = names.find((name) => name.nameId === challenge.challengerAdvocateId);
				const tao = taos.find((_tao) => _tao.taoId === challenge.taoId);
				if (!challenger || !tao) {
					return null;
				} else {
					return (
						<Wrapper key={challenge.challengeId} className="margin-bottom-20">
							<DateColumn>{formatDate(challenge.createdTimestamp.toNumber())}</DateColumn>
							<TypeColumn>TAO Advocate Challenge</TypeColumn>
							<MessageColumn>
								<Ahref to={`/view-challenged-tao/${challenge.challengeId}`}>
									{challenger.name} challenged you to be {tao.name}'s new Advocate
								</Ahref>
							</MessageColumn>
						</Wrapper>
					);
				}
			});
			return (
				<Wrapper className="padding-40">
					<Wrapper className="margin-bottom-20">
						<Title>Require Actions</Title>
					</Wrapper>
					<Wrapper className="margin-bottom-20">
						<DateColumn className="header">Date</DateColumn>
						<TypeColumn className="header">Type</TypeColumn>
						<MessageColumn className="header">Message</MessageColumn>
					</Wrapper>
					{requireActionsContent}
				</Wrapper>
			);
		}
	}
}

export { RequireActions };
