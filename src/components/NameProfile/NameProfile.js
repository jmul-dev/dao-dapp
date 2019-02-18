import * as React from "react";
import { Wrapper } from "components/";
import { LeftContainer, RightContainer } from "./styledComponents";
import { ProfileContainer } from "./Profile/";
import { PositionDetailsContainer } from "./PositionDetails/";
import { ProfileImageContainer } from "./ProfileImage/";
import { PublicKeysContainer } from "./PublicKeys/";
import { LogosDetailsContainer } from "./LogosDetails/";

class NameProfile extends React.Component {
	render() {
		return (
			<Wrapper className="padding-40">
				<LeftContainer>
					<ProfileContainer id={this.props.params.id} />
					<PositionDetailsContainer id={this.props.params.id} />
				</LeftContainer>
				<RightContainer>
					<ProfileImageContainer id={this.props.params.id} />
				</RightContainer>
				<LogosDetailsContainer id={this.props.params.id} />
				<PublicKeysContainer id={this.props.params.id} />
			</Wrapper>
		);
	}
}

export { NameProfile };
