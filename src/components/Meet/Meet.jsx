import * as React from "react";
import { Wrapper, WidgetWrapper } from "../Styled";
import { Name, Id, IframeContainer } from "./Styled";
import { TAOData } from "../TAODetailsData.json";
import { Link } from "react-router";
import Iframe from "react-iframe";

class Meet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}
	render() {
		if (!this.props || !this.props.params) {
			return null;
		}
		const { id } = this.props.params;
		return (
			<Wrapper>
				<WidgetWrapper>
					<Link to={"/tao/" + id}>Back to TAO Details</Link>
					<Name>TAO - {TAOData[id]}</Name>
					<Id>{id}</Id>
					<IframeContainer>
						<Iframe
							url={"https://meet.paramation.com/" + id}
							height="600"
							width="800"
							allowFullScreen
							allow="microphone; camera"
						/>
					</IframeContainer>
				</WidgetWrapper>
			</Wrapper>
		);
	}
}

export { Meet };
