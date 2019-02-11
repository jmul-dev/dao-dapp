import * as React from "react";
import { Wrapper, Title, StyledForm, StyledButton, Error } from "./styledComponents";

class NameProfile extends React.Component {
	render() {
		const { nameInfo } = this.props;
		if (!nameInfo) {
			return null;
		}
		return <Wrapper>Name: {nameInfo.name}</Wrapper>;
	}
}

export { NameProfile };
