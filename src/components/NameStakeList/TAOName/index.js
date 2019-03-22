import * as React from "react";
import { Wrapper, Title, Header } from "components/";

class TAOName extends React.Component {
	render() {
		const { id, name } = this.props;
		if (!id || !name) {
			return null;
		}
		return (
			<Wrapper className="margin-bottom-20">
				<Title className="medium margin-top-20 margin-bottom-0">{name}</Title>
				<Header>{id}</Header>
			</Wrapper>
		);
	}
}

export { TAOName };
