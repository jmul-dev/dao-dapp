import * as React from "react";
import { Wrapper, Title, Header, LeftContainer, RightContainer, FieldContainer, FieldName, FieldValue } from "components/";
import { Countdown } from "widgets/Countdown/";
import { formatDate } from "utils/";
import { BarChart } from "widgets/BarChart/";

class ViewActiveChallenge extends React.Component {
	render() {
		const { taoInfo, advocate, challenger, activeChallenge } = this.props;

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

		return (
			<Wrapper>
				<Header>
					A challenge to be {taoInfo.name}'s new Advocate was submitted by you on{" "}
					{formatDate(activeChallenge.createdTimestamp.toNumber())}. Both you and the current Advocate of {taoInfo.name} will have
					the opportunity to respond to this challenge before {formatDate(activeChallenge.lockedUntilTimestamp.toNumber())}. The
					one with higher Logos will be the new Advocate of {taoInfo.name}.
				</Header>
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
						<Wrapper className="margin-top-20">
							<Title>Response period will end in</Title>
							<Countdown date={formatDate(activeChallenge.lockedUntilTimestamp.toNumber())} />
						</Wrapper>
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
