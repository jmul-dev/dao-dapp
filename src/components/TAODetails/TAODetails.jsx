import * as React from "react";
import { Wrapper, WidgetWrapper } from "../Styled";
import { Name, Id } from "./Styled";
import { TAOData } from "./TAOData.json";
import { Link } from "react-router";

class TAODetails extends React.Component {
	render() {
		if (!this.props || !this.props.params) {
			return null;
		}
		const { id } = this.props.params;
		return (
			<Wrapper>
				<WidgetWrapper>
					<Link to="/">Back to Dashboard</Link>
					<Name>TAO - {TAOData[id]}</Name>
					<Id>{id}</Id>
				</WidgetWrapper>
			</Wrapper>
		);
	}
}

export { TAODetails };
