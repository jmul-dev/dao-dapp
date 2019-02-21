import * as React from "react";
import { Wrapper } from "components/";
import { Name, Id, Loading, IframeContainer } from "./Styled";
import { TAOData } from "../TAODetailsData.json";
import { Link } from "react-router";
import Iframe from "react-iframe";

class Ide extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
		this.iframeLoaded = this.iframeLoaded.bind(this);
	}

	iframeLoaded() {
		this.setState({ loading: false });
	}

	render() {
		if (!this.props || !this.props.params) {
			return null;
		}
		const { id } = this.props.params;
		return (
			<Wrapper>
				<Wrapper className="dark-bg padding-20 margin-bottom-20 center">
					<Link to={"/tao/" + id}>Back to TAO Details</Link>
					<Name>TAO - {TAOData[id]}</Name>
					<Id>{id}</Id>
					{this.state.loading ? <Loading>Loading ...</Loading> : null}
					<IframeContainer>
						<Iframe
							url={"https://webmakerapp.com/app/"}
							height="600"
							width="800"
							allowFullScreen
							allow="microphone; camera"
							onLoad={this.iframeLoaded}
						/>
					</IframeContainer>
				</Wrapper>
			</Wrapper>
		);
	}
}

export { Ide };
