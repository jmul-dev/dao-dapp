import * as React from "react";
import { Wrapper, Title, Header, FieldContainer, FieldName, FieldValue } from "components/";
import { Countdown } from "widgets/Countdown/";
import { formatDate } from "utils/";

class ViewActiveChallenge extends React.Component {
	render() {
		const { taoInfo, advocate, challenger, activeChallenge } = this.props;

		return (
			<Wrapper>
				<Header>
					A challenge to be {taoInfo.name}'s new Advocate was submitted by you on{" "}
					{formatDate(activeChallenge.createdTimestamp.toNumber())}. Both you and the current Advocate of {taoInfo.name} will have
					the opportunity to respond to this challenge before {formatDate(activeChallenge.lockedUntilTimestamp.toNumber())}. The
					one with higher logos will end up being the new Advocate of {taoInfo.name}.
				</Header>
				<FieldContainer className="margin-top-20">
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
				<Wrapper className="margin-top-20 center">
					<Title>Response period will end in</Title>
					<Countdown date={formatDate(activeChallenge.lockedUntilTimestamp.toNumber())} />
				</Wrapper>
			</Wrapper>
		);
	}
}

export { ViewActiveChallenge };
