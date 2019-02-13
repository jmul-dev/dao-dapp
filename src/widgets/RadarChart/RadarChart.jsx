import * as React from "react";
import { Radar } from "react-chartjs";
import { Wrapper, Content, Title } from "./Styled";

class RadarChart extends React.Component {
	render() {
		return (
			<Wrapper>
				<Content>
					<Title>{this.props.title}</Title>
					<Radar data={this.props.data} options={{ animationEasing: "easeInSine", showTooltips: true }} height="200" />
				</Content>
			</Wrapper>
		);
	}
}

export { RadarChart };
