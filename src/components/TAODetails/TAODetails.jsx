import * as React from "react";
import { Wrapper, WidgetWrapper } from "../Styled";
import { Name, Id } from "./Styled";
import { TAOData } from "./TAOData.json";
import { Link } from "react-router";
import Editor from "react-medium-editor";
import * as loremIpsum from "lorem-ipsum";
import "./MediumEditorDefaultTheme.css";

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
					<Name>TAO - {TAOData[id]}</Name>
					<Id>{id}</Id>
					<Editor text={text} onChange={this.handleChange} />
				</WidgetWrapper>
			</Wrapper>
		);
	}
}

export { TAODetails };
