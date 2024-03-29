import * as React from "react";
import { Doughnut } from "react-chartjs";
import { Wrapper, Content, Title } from "./Styled";

class DoughnutChart extends React.Component {
	render() {
		return (
			<Wrapper>
				<Content>
					<Title>{this.props.title}</Title>
					<Doughnut
						data={this.props.data}
						options={{ animationEasing: "easeInSine", showTooltips: true }}
						height={this.props.height}
					/>
				</Content>
			</Wrapper>
		);
	}
}

export { DoughnutChart };
