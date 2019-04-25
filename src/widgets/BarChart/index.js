import * as React from "react";
import { Bar } from "react-chartjs";
import { Wrapper, Title } from "components/";

class BarChart extends React.Component {
	render() {
		return (
			<Wrapper>
				<Title>{this.props.title}</Title>
				<Bar data={this.props.data} options={{ animationEasing: "easeInSine", showTooltips: true }} height={this.props.height} />
			</Wrapper>
		);
	}
}

export { BarChart };
