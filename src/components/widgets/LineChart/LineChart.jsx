import * as React from "react";
import { Line } from "react-chartjs";
import { Wrapper, Title } from "./Styled";

class LineChart extends React.Component {
	render() {
		return (
			<Wrapper>
				<Title>{this.props.title}</Title>
				<Line data={this.props.data} options={{ responsive: true, animationSteps: 300 }} height="120" width="400" />
			</Wrapper>
		);
	}
}

export { LineChart };
