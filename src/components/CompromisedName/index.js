import * as React from "react";
import { Wrapper, Title } from "components/";
import { WarningContainer } from "./styledComponents";
import { Countdown } from "widgets/Countdown/";
import { formatDate } from "utils/";

class CompromisedName extends React.Component {
	render() {
		const { nameCompromised } = this.props;

		return (
			<Wrapper className="padding-40 white center">
				<WarningContainer>
					<img src={process.env.PUBLIC_URL + "/images/sad.svg"} alt={"Sorry"} />
					<Title className="small margin-top">
						Your account is temporarily locked until {formatDate(nameCompromised.lockedUntilTimestamp.toNumber())} because an
						account recovery was submitted by your Listener
					</Title>
					<Countdown date={formatDate(nameCompromised.lockedUntilTimestamp.toNumber())} />
				</WarningContainer>
			</Wrapper>
		);
	}
}

export { CompromisedName };
