import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue } from "components/";
import { Bar } from "react-chartjs";

class Financials extends React.Component {
	render() {
		const { status, ethosCapStatus, ethosCapAmount, poolTotalLot, poolTotalLogosWithdrawn, ethosBalance, pathosBalance } = this.props;
		const barChartData = {
			labels: ["Ethos", "Pathos", "Withdrawn Logos"],
			datasets: [
				{
					label: "Staked",
					fillColor: "#FF5A5E",
					strokeColor: "#E8575A",
					pointColor: "#E8575A",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [ethosBalance.toNumber(), pathosBalance.toNumber(), poolTotalLogosWithdrawn.toNumber()]
				}
			]
		};

		return (
			<Wrapper>
				<Title className="margin-top">Financials</Title>
				<FieldContainer>
					<FieldName>Status</FieldName>
					<FieldValue>{status ? "Active" : "Inactive"}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Has Ethos Cap?</FieldName>
					<FieldValue>{ethosCapStatus ? "Yes" : "No"}</FieldValue>
				</FieldContainer>
				{ethosCapStatus && (
					<FieldContainer>
						<FieldName>Ethos Cap</FieldName>
						<FieldValue>{ethosCapAmount.toNumber()}</FieldValue>
					</FieldContainer>
				)}
				<FieldContainer>
					<FieldName>Total Lot</FieldName>
					<FieldValue>{poolTotalLot.toNumber()}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Total Logos Withdrawn</FieldName>
					<FieldValue>{poolTotalLogosWithdrawn.toNumber()}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Ethos Staked</FieldName>
					<FieldValue>{ethosBalance.toNumber()}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Pathos Staked</FieldName>
					<FieldValue>{pathosBalance.toNumber()}</FieldValue>
				</FieldContainer>
				<Bar data={barChartData} options={{ responsive: true, animationSteps: 300 }} height="120" width="400" />
			</Wrapper>
		);
	}
}

export { Financials };
