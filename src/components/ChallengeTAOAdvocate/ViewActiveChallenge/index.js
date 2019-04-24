import * as React from "react";
import { Wrapper, Title, Header } from "components/";
import { Countdown } from "widgets/Countdown/";
import { formatDate } from "utils/";

class ViewActiveChallenge extends React.Component {
	render() {
		const { activeChallenge, taoInfo } = this.props;

		return (
			<Wrapper>
				<Header>
					A challenge to be {taoInfo.name}'s new Advocate was submitted by you on{" "}
					{formatDate(activeChallenge.createdTimestamp.toNumber())}. The current Advocate of {taoInfo.name} will have the
					opportunity to respond to this challenge before {formatDate(activeChallenge.lockedUntilTimestamp.toNumber())}.
				</Header>
				<Wrapper className="margin-top-20 center">
					<Title>Current Advocate response period will end in</Title>
					<Countdown date={formatDate(activeChallenge.lockedUntilTimestamp.toNumber())} />
				</Wrapper>
			</Wrapper>
		);
	}
}

export { ViewActiveChallenge };
