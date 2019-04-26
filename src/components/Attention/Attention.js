import * as React from "react";
import { Wrapper, Title, Ahref } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { DateColumn, TypeColumn, MessageColumn } from "./styledComponents";
import { formatDate } from "utils/";
import * as _ from "lodash";

class Attention extends React.Component {
	render() {
		const { pastEventsRetrieved, names, taos, challengeTAOAdvocates, nameId } = this.props;
		if (!pastEventsRetrieved || !names || !taos || !challengeTAOAdvocates || !nameId) {
			return <ProgressLoaderContainer />;
		}

		let activeChallenges = [];
		if (challengeTAOAdvocates && challengeTAOAdvocates.length) {
			const currentTimestamp = Math.round(new Date().getTime() / 1000);
			activeChallenges = _.orderBy(
				challengeTAOAdvocates.filter(
					(challenge) =>
						(challenge.currentAdvocateId === nameId && challenge.lockedUntilTimestamp.gt(currentTimestamp)) ||
						(challenge.challengerAdvocateId === nameId && challenge.completeBeforeTimestamp.gt(currentTimestamp))
				),
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
					<Title>Attention</Title>
					<Wrapper className="margin-top-20">Currently, there is no item that requires your attention</Wrapper>
				</Wrapper>
			);
		} else {
			const attentionsContent = activeChallenges.map((challenge) => {
				const advocate = names.find((name) => name.nameId === challenge.currentAdvocateId);
				const challenger = names.find((name) => name.nameId === challenge.challengerAdvocateId);
				const tao = taos.find((_tao) => _tao.taoId === challenge.taoId);
				if (!advocate || !challenger || !tao) {
					return null;
				} else {
					return (
						<Wrapper key={challenge.challengeId} className="margin-bottom-20">
							<DateColumn>{formatDate(challenge.createdTimestamp.toNumber())}</DateColumn>
							<TypeColumn>TAO Advocate Challenge</TypeColumn>
							<MessageColumn>
								{challenge.currentAdvocateId === nameId ? (
									<Ahref to={`/view-challenged-tao/${challenge.challengeId}`}>
										{challenger.name} challenged you to be {tao.name}'s new Advocate
									</Ahref>
								) : (
									<Ahref to={`/challenge-tao-advocate/${challenge.taoId}`}>
										You challenged {advocate.name} to be {tao.name}'s new Advocate
									</Ahref>
								)}
							</MessageColumn>
						</Wrapper>
					);
				}
			});
			return (
				<Wrapper className="padding-40">
					<Wrapper className="margin-bottom-20">
						<Title>Attention</Title>
					</Wrapper>
					<Wrapper className="margin-bottom-20">
						<DateColumn className="header">Date</DateColumn>
						<TypeColumn className="header">Type</TypeColumn>
						<MessageColumn className="header">Message</MessageColumn>
					</Wrapper>
					{attentionsContent}
				</Wrapper>
			);
		}
	}
}

export { Attention };
