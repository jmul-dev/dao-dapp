import * as React from "react";
import { Wrapper, Content, Title, StyledCountUp } from "./Styled";

class CountUpWidget extends React.Component {
	render() {
		return (
			<Wrapper backgroundColor={this.props.backgroundColor}>
				<Content>
					<Title>{this.props.title}</Title>
					<StyledCountUp end={this.props.value} />
				</Content>
			</Wrapper>
		);
	}
}

export { CountUpWidget };
