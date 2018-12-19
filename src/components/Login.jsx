import * as React from "react";
import { Wrapper, Title, Content } from "./Styled";

class Login extends React.Component {
	render() {
		return (
			<Wrapper>
				<Title>Hello there!</Title>
				<Content>Please login to Metamask in order to continue</Content>
			</Wrapper>
		);
	}
}

export { Login };
