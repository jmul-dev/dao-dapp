import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { Bar } from "react-chartjs";
import { StakeEthosFormContainer } from "./StakeEthosForm/";

class Financials extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			showStakeEthosForm: false
		};
		this.toggleShowForm = this.toggleShowForm.bind(this);
		this.showStakeEthosForm = this.showStakeEthosForm.bind(this);
	}

	toggleShowForm() {
		this.setState({ showForm: !this.state.showForm });
		if (!this.state.showForm) {
			this.setState({ showStakeEthosForm: false });
		}
	}

	showStakeEthosForm() {
		this.setState({ showForm: true, showStakeEthosForm: true });
	}

	render() {
		const {
			id,
			status,
			ethosCapStatus,
			ethosCapAmount,
			poolTotalLot,
			poolTotalLogosWithdrawn,
			ethosBalance,
			pathosBalance,
			getTAOPool
		} = this.props;
		const { showForm, showStakeEthosForm } = this.state;

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

		if (!showForm) {
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
					{(!ethosCapStatus || (ethosCapStatus && ethosBalance.lt(ethosCapAmount))) && (
						<Icon className="animated bounceIn" onClick={this.showStakeEthosForm}>
							<img src={process.env.PUBLIC_URL + "/images/stake.png"} alt={"Stake Ethos"} />
							<div>Stake Ethos</div>
						</Icon>
					)}
				</Wrapper>
			);
		} else {
			if (showStakeEthosForm) {
				return (
					<Wrapper>
						<Title className="margin-top">Stake Ethos</Title>
						<StakeEthosFormContainer
							id={id}
							getTAOPool={getTAOPool}
							toggleShowForm={this.toggleShowForm}
							ethosCapStatus={ethosCapStatus}
							ethosCapAmount={ethosCapAmount}
							ethosBalance={ethosBalance}
						/>
					</Wrapper>
				);
			}
		}
	}
}

export { Financials };
