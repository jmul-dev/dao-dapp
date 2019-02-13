import * as React from "react";
import { Wrapper, Content, Header, SmallHeader } from "./Styled";

class Welcome extends React.Component {
	render() {
		return (
			<Wrapper backgroundColor={this.props.backgroundColor}>
				<Content>
					<Header>Hello, alpha</Header>
					<SmallHeader>Name ID: {this.props.nameId}</SmallHeader>
				</Content>
			</Wrapper>
		);
	}
}

export { Welcome };
