import * as React from "react";
import { Wrapper } from "components/";
import { ProfileContainer } from "./Profile/";
import { PositionDetailContainer } from "./PositionDetail/";
import { PublicKeysContainer } from "./PublicKeys/";
import { LogosDetailContainer } from "./LogosDetail/";

class NameProfile extends React.Component {
	render() {
		return (
			<Wrapper className="padding-40">
				<ProfileContainer id={this.props.params.id} />
				<PositionDetailContainer id={this.props.params.id} />
				<LogosDetailContainer id={this.props.params.id} />
				<PublicKeysContainer id={this.props.params.id} />
			</Wrapper>
		);
	}
}

export { NameProfile };
