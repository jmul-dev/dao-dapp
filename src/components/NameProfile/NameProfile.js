import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue } from "./styledComponents";

class NameProfile extends React.Component {
	render() {
		const { nameInfo } = this.props;
		if (!nameInfo) {
			return null;
		}
		return (
			<Wrapper>
				<Title>Profile</Title>
				<FieldName>Name</FieldName>
				<FieldValue>{nameInfo.name}</FieldValue>
			</Wrapper>
		);
	}
}

export { NameProfile };
