import * as React from "react";
import { Wrapper, WidgetWrapper } from "../Styled";
import { Name, Id, Right, InlineDiv, StyledLink, Img } from "./Styled";
import { TAOData } from "components/TAODetailsData.json";
import { Link } from "react-router";
import Editor from "react-medium-editor";
import * as loremIpsum from "lorem-ipsum";
import "./MediumEditorDefaultTheme.css";
import { videoCallLogo, openIdeLogo } from "./Logo.json";

class TAODetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: loremIpsum({
				count: 30,
				units: "sentences"
			})
		};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(text) {
		this.setState({ text });
	}

	render() {
		if (!this.props || !this.props.params || !this.state.text) {
			return null;
		}
		const { id } = this.props.params;
		const { text } = this.state;
		return (
			<Wrapper>
				<WidgetWrapper>
					<Link to="/">Back to Dashboard</Link>
					<div className="row">
						<div className="col-xs-6">
							<Name>TAO - {TAOData[id]}</Name>
							<Id>{id}</Id>
						</div>
						<Right className="col-xs-6">
							<InlineDiv>
								<StyledLink to={"/meet/" + id}>
									<Img src={videoCallLogo} alt={"Video Call"} />
									<br />
									Video Call
								</StyledLink>
							</InlineDiv>
							<InlineDiv>
								<StyledLink to={"/ide/" + id}>
									<Img src={openIdeLogo} alt={"Open IDE"} />
									<br />
									Open IDE
								</StyledLink>
							</InlineDiv>
						</Right>
					</div>
					<Editor text={text} onChange={this.handleChange} />
				</WidgetWrapper>
			</Wrapper>
		);
	}
}

export { TAODetails };
