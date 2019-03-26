import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { ChartContainer, DetailsContainer } from "./styledComponents";
import { PositionLogosFormContainer } from "./PositionLogosForm/";
import { PositionOnOthersDetailsContainer } from "./PositionOnOthersDetails/";
import { PositionFromOthersDetailsContainer } from "./PositionFromOthersDetails/";
import { DoughnutChart } from "widgets/DoughnutChart/";
import { Palette, Highlight } from "css/color.json";
import { BigNumber } from "bignumber.js";

const promisify = require("tiny-promisify");

class LogosDetails extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			balanceOf: new BigNumber(0),
			positionFromOthers: new BigNumber(0),
			totalAdvocatedTAOLogos: new BigNumber(0),
			sumBalanceOf: new BigNumber(0),
			totalPositionOnOthers: new BigNumber(0),
			availableToPositionAmount: new BigNumber(0),
			showPositionLogosForm: false
		};
		this.initialState = this.state;
		this.togglePositionLogosForm = this.togglePositionLogosForm.bind(this);
		this.refreshPositionLogos = this.refreshPositionLogos.bind(this);
	}

	async componentDidMount() {
		this._isMounted = true;

		const { logos, id } = this.props;
		await this.getLogosBalance(logos, id);
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
			this.setState(this.initialState);
			const { logos, id } = this.props;
			await this.getLogosBalance(logos, id);
		}
	}

	async getLogosBalance(logos, id) {
		if (!logos || !id) {
			return;
		}

		const balanceOf = await promisify(logos.balanceOf)(id);
		const positionFromOthers = await promisify(logos.positionFromOthers)(id);
		const totalAdvocatedTAOLogos = await promisify(logos.totalAdvocatedTAOLogos)(id);
		const sumBalanceOf = await promisify(logos.sumBalanceOf)(id);
		const totalPositionOnOthers = await promisify(logos.totalPositionOnOthers)(id);
		const availableToPositionAmount = await promisify(logos.availableToPositionAmount)(id);

		if (this._isMounted) {
			this.setState({
				balanceOf,
				positionFromOthers,
				totalAdvocatedTAOLogos,
				sumBalanceOf,
				totalPositionOnOthers,
				availableToPositionAmount
			});
		}
	}

	togglePositionLogosForm() {
		this.setState({ showPositionLogosForm: !this.state.showPositionLogosForm });
	}

	async refreshPositionLogos() {
		const { logos, id } = this.props;
		if (!logos || !id) {
			return;
		}

		const totalPositionOnOthers = await promisify(logos.totalPositionOnOthers)(id);
		const availableToPositionAmount = await promisify(logos.availableToPositionAmount)(id);
		this.setState({
			totalPositionOnOthers,
			availableToPositionAmount
		});
	}

	render() {
		const {
			balanceOf,
			positionFromOthers,
			totalAdvocatedTAOLogos,
			sumBalanceOf,
			totalPositionOnOthers,
			availableToPositionAmount,
			showPositionLogosForm
		} = this.state;

		const { isOwner, singlePageView, populateGraph } = this.props;

		let showSumLogosChart = false,
			sumLogosData = [];
		if (balanceOf.gt(0) || positionFromOthers.gt(0) || totalAdvocatedTAOLogos.gt(0)) {
			showSumLogosChart = true;
			sumLogosData = [
				{ value: balanceOf.toNumber(), color: Palette[0], highlight: Highlight[0], label: "Owned Balance" },
				{ value: positionFromOthers.toNumber(), color: Palette[1], highlight: Highlight[1], label: "Position from Others" },
				{ value: totalAdvocatedTAOLogos.toNumber(), color: Palette[2], highlight: Highlight[2], label: "Total Advocated TAOs" }
			];
		}

		let showPositionChart = false,
			positionData = [];
		if (availableToPositionAmount.gt(0) || totalPositionOnOthers.gt(0)) {
			showPositionChart = true;
			positionData = [
				{ value: totalPositionOnOthers.toNumber(), color: Palette[3], highlight: Highlight[0], label: "Total Position on Others" },
				{ value: availableToPositionAmount.toNumber(), color: Palette[4], highlight: Highlight[1], label: "Available to Position" }
			];
		}

		return (
			<Wrapper>
				<Title className={singlePageView ? "margin-top" : ""}>Logos Details</Title>
				<ChartContainer>
					<DetailsContainer>
						<FieldContainer>
							<FieldName>Sum Balance</FieldName>
							<FieldValue>{sumBalanceOf.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Owned Balance</FieldName>
							<FieldValue>{balanceOf.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Positioned from Others</FieldName>
							<FieldValue>{positionFromOthers.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Total Advocated TAOs</FieldName>
							<FieldValue>{totalAdvocatedTAOLogos.toNumber()}</FieldValue>
						</FieldContainer>
					</DetailsContainer>
					{showSumLogosChart && (singlePageView || populateGraph) && <DoughnutChart data={sumLogosData} height={200} />}
				</ChartContainer>
				<ChartContainer>
					<DetailsContainer>
						<FieldContainer>
							<FieldName>Available to Position</FieldName>
							<FieldValue>{availableToPositionAmount.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Total Positioned on Others</FieldName>
							<FieldValue>{totalPositionOnOthers.toNumber()}</FieldValue>
						</FieldContainer>
						{availableToPositionAmount.gt(0) && !showPositionLogosForm && (
							<Icon className="animated bounceIn margin-top-10" onClick={this.togglePositionLogosForm}>
								<img src={process.env.PUBLIC_URL + "/images/position.png"} alt={"Position Logos on Other Name"} />
								<div>Position on Other</div>
							</Icon>
						)}
					</DetailsContainer>
					{!showPositionLogosForm ? (
						<div>
							{showPositionChart && (singlePageView || populateGraph) && <DoughnutChart data={positionData} height={200} />}
						</div>
					) : (
						<PositionLogosFormContainer
							togglePositionLogosForm={this.togglePositionLogosForm}
							refreshPositionLogos={this.refreshPositionLogos}
						/>
					)}
				</ChartContainer>
				{isOwner && (
					<Wrapper>
						<PositionOnOthersDetailsContainer refreshPositionLogos={this.refreshPositionLogos} />
						<PositionFromOthersDetailsContainer />
					</Wrapper>
				)}
			</Wrapper>
		);
	}
}

export { LogosDetails };
