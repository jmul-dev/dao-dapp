import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, LeftContainer, RightContainer } from "components/";
import { Bar } from "react-chartjs";

class Financials extends React.Component {
	render() {
		const { ethosStaked, pathosStaked, logosWithdrawn } = this.props;

		const barChartData = {
			labels: ["Ethos", "Pathos", "Logos Withdrawn"],
			datasets: [
				{
					label: "Staked",
					fillColor: "#FF5A5E",
					strokeColor: "#E8575A",
					pointColor: "#E8575A",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [ethosStaked.toNumber(), pathosStaked.toNumber(), logosWithdrawn.toNumber()]
				}
			]
		};

		return (
			<Wrapper>
				<Title className="margin-top">Your Financials</Title>
				<LeftContainer>
					<FieldContainer>
						<FieldName>Ethos Staked on TAO</FieldName>
						<FieldValue>{ethosStaked.toNumber()}</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName>Pathos Staked on TAO</FieldName>
						<FieldValue>{pathosStaked.toNumber()}</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName>Logos Withdrawn from TAO</FieldName>
						<FieldValue>{logosWithdrawn.toNumber()}</FieldValue>
					</FieldContainer>
				</LeftContainer>
				<RightContainer>
					<Bar data={barChartData} options={{ responsive: true, animationSteps: 300 }} height="120" width="400" />
				</RightContainer>
			</Wrapper>
		);
	}
}

export { Financials };
