import * as React from "react";
import { Wrapper, Title, LeftContainer, RightContainer, FieldContainer, FieldName, FieldValue, Icon, Ahref } from "components/";
import { Bar } from "react-chartjs";
import { StakeEthosFormContainer } from "./StakeEthosForm/";
import { StakePathosFormContainer } from "./StakePathosForm/";

class Financials extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			showStakeEthosForm: false,
			showStakePathosForm: false
		};
		this.toggleShowForm = this.toggleShowForm.bind(this);
		this.showStakeEthosForm = this.showStakeEthosForm.bind(this);
		this.showStakePathosForm = this.showStakePathosForm.bind(this);
	}

	toggleShowForm() {
		this.setState({ showForm: !this.state.showForm });
		if (!this.state.showForm) {
			this.setState({ showStakeEthosForm: false, showStakePathosForm: false });
		}
	}

	showStakeEthosForm() {
		this.setState({ showForm: true, showStakeEthosForm: true, showStakePathosForm: false });
	}

	showStakePathosForm() {
		this.setState({ showForm: true, showStakeEthosForm: false, showStakePathosForm: true });
	}

	render() {
		const {
			id,
			populateBar,
			status,
			ethosCapStatus,
			ethosCapAmount,
			poolTotalLogosWithdrawn,
			ethosBalance,
			pathosBalance,
			nameEthosStaked,
			namePathosStaked,
			nameLogosWithdrawn,
			getTAOPool,
			singlePageView
		} = this.props;
		const { showForm, showStakeEthosForm, showStakePathosForm } = this.state;

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
					data: [ethosBalance.toNumber(), pathosBalance.toNumber(), poolTotalLogosWithdrawn.toNumber()]
				}
			]
		};

		if (!showForm) {
			if (singlePageView) {
				return (
					<Wrapper>
						<Title className={singlePageView ? "margin-top" : ""}>TAO Financials</Title>
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
							<FieldName>Total Ethos Staked</FieldName>
							<FieldValue>{ethosBalance.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Total Pathos Staked</FieldName>
							<FieldValue>{pathosBalance.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Total Logos Withdrawn</FieldName>
							<FieldValue>{poolTotalLogosWithdrawn.toNumber()}</FieldValue>
						</FieldContainer>
						<Bar data={barChartData} options={{ responsive: true, animationSteps: 300 }} height="120" width="400" />
						<Title className="margin-top">Your Financials</Title>
						<FieldContainer>
							<FieldName>Ethos Staked on TAO</FieldName>
							<FieldValue>{nameEthosStaked.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Pathos Staked on TAO</FieldName>
							<FieldValue>{namePathosStaked.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Logos Withdrawn from TAO</FieldName>
							<FieldValue>{nameLogosWithdrawn.toNumber()}</FieldValue>
						</FieldContainer>
						{status && (!ethosCapStatus || (ethosCapStatus && ethosBalance.lt(ethosCapAmount))) && (
							<Icon className="animated bounceIn" onClick={this.showStakeEthosForm}>
								<img src={process.env.PUBLIC_URL + "/images/stake.png"} alt={"Stake Ethos"} />
								<div>Stake Ethos</div>
							</Icon>
						)}
						{status && pathosBalance.lt(ethosBalance) && (
							<Icon className="animated bounceIn" onClick={this.showStakePathosForm}>
								<img src={process.env.PUBLIC_URL + "/images/stake.png"} alt={"Stake Pathos"} />
								<div>Stake Pathos</div>
							</Icon>
						)}
						{(nameEthosStaked.gt(0) || namePathosStaked.gt(0)) && (
							<Ahref className="white" to={`/name-stake-list/${id}/`}>
								<Icon className="animated bounceIn">
									<img src={process.env.PUBLIC_URL + "/images/view_list.png"} alt={"View Staking Details"} />
									<div>View Staking Details</div>
								</Icon>
							</Ahref>
						)}
					</Wrapper>
				);
			} else {
				return (
					<Wrapper>
						<LeftContainer>
							<Title>TAO Financials</Title>
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
								<FieldName>Total Ethos Staked</FieldName>
								<FieldValue>{ethosBalance.toNumber()}</FieldValue>
							</FieldContainer>
							<FieldContainer>
								<FieldName>Total Pathos Staked</FieldName>
								<FieldValue>{pathosBalance.toNumber()}</FieldValue>
							</FieldContainer>
							<FieldContainer>
								<FieldName>Total Logos Withdrawn</FieldName>
								<FieldValue>{poolTotalLogosWithdrawn.toNumber()}</FieldValue>
							</FieldContainer>
						</LeftContainer>
						<RightContainer>
							<Title>Your Financials</Title>
							<FieldContainer>
								<FieldName>Ethos Staked on TAO</FieldName>
								<FieldValue>{nameEthosStaked.toNumber()}</FieldValue>
							</FieldContainer>
							<FieldContainer>
								<FieldName>Pathos Staked on TAO</FieldName>
								<FieldValue>{namePathosStaked.toNumber()}</FieldValue>
							</FieldContainer>
							<FieldContainer>
								<FieldName>Logos Withdrawn from TAO</FieldName>
								<FieldValue>{nameLogosWithdrawn.toNumber()}</FieldValue>
							</FieldContainer>
							{status && (!ethosCapStatus || (ethosCapStatus && ethosBalance.lt(ethosCapAmount))) && (
								<Icon className="animated bounceIn" onClick={this.showStakeEthosForm}>
									<img src={process.env.PUBLIC_URL + "/images/stake.png"} alt={"Stake Ethos"} />
									<div>Stake Ethos</div>
								</Icon>
							)}
							{status && pathosBalance.lt(ethosBalance) && (
								<Icon className="animated bounceIn" onClick={this.showStakePathosForm}>
									<img src={process.env.PUBLIC_URL + "/images/stake.png"} alt={"Stake Pathos"} />
									<div>Stake Pathos</div>
								</Icon>
							)}
							{(nameEthosStaked.gt(0) || namePathosStaked.gt(0)) && (
								<Ahref className="white" to={`/name-stake-list/${id}/`}>
									<Icon className="animated bounceIn">
										<img src={process.env.PUBLIC_URL + "/images/view_list.png"} alt={"View Staking Details"} />
										<div>View Staking Details</div>
									</Icon>
								</Ahref>
							)}
						</RightContainer>
						{populateBar && (
							<Wrapper className="margin-top-40">
								<Bar data={barChartData} options={{ responsive: true, animationSteps: 300 }} height="120" width="400" />
							</Wrapper>
						)}
					</Wrapper>
				);
			}
		} else {
			if (showStakeEthosForm) {
				return (
					<Wrapper>
						<Title className={singlePageView ? "margin-top" : ""}>Stake Ethos</Title>
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
			} else if (showStakePathosForm) {
				return (
					<Wrapper>
						<Title className={singlePageView ? "margin-top" : ""}>Stake Pathos</Title>
						<StakePathosFormContainer
							id={id}
							getTAOPool={getTAOPool}
							toggleShowForm={this.toggleShowForm}
							ethosBalance={ethosBalance}
							pathosBalance={pathosBalance}
						/>
					</Wrapper>
				);
			}
		}
	}
}

export { Financials };
