import * as React from "react";
import { Wrapper, Title } from "components/";
import { WarningContainer, Name } from "./styledComponents";
import { Countdown } from "widgets/Countdown/";
import { formatDate } from "utils/";

class CompromisedName extends React.Component {
	render() {
		const { nameCompromised, position } = this.props;

		return (
			<Wrapper className="white center">
				<WarningContainer>
					<img src={process.env.PUBLIC_URL + "/images/sad.svg"} alt={"Sorry"} />
					<Title className="small margin-top">
						Your account is temporarily locked until {formatDate(nameCompromised.lockedUntilTimestamp.toNumber())} because an
						account recovery was submitted by{" "}
						<Name>
							your Listener - {position.listenerName} ({position.listenerId})
						</Name>{" "}
						and will require action by{" "}
						<Name>
							your Speaker - {position.speakerName} ({position.speakerId})
						</Name>{" "}
						to complete the process.
					</Title>
					<Countdown date={formatDate(nameCompromised.lockedUntilTimestamp.toNumber())} />
				</WarningContainer>
			</Wrapper>
		);
	}
}

export { CompromisedName };
