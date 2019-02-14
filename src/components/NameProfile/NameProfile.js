import * as React from "react";
import { Wrapper } from "components/";
import { ProfileContainer } from "./Profile/";
import { PositionDetailsContainer } from "./PositionDetails/";
import { PublicKeysContainer } from "./PublicKeys/";
import { LogosDetailsContainer } from "./LogosDetails/";

class NameProfile extends React.Component {
	render() {
		return (
			<Wrapper className="padding-40">
				<ProfileContainer id={this.props.params.id} />
				<PositionDetailsContainer id={this.props.params.id} />
				<LogosDetailsContainer id={this.props.params.id} />
				<PublicKeysContainer id={this.props.params.id} />
			</Wrapper>
		);
	}
}

export { NameProfile };
