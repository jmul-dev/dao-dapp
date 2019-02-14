import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue } from "components/";
import { ChartContainer, DetailsContainer } from "./styledComponents";
import { DoughnutChart } from "widgets/DoughnutChart/";
import { Palette, Highlight } from "css/color.json";
import { BigNumber } from "bignumber.js";

const promisify = require("tiny-promisify");

class LogosDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			balanceOf: new BigNumber(0),
			positionFromOthers: new BigNumber(0),
			totalAdvocatedTAOLogos: new BigNumber(0),
			sumBalanceOf: new BigNumber(0),
			totalPositionOnOthers: new BigNumber(0),
			availableToPositionAmount: new BigNumber(0)
		};
	}

	async componentDidMount() {
		const { logos, id } = this.props;
		await this.getLogosBalance(logos, id);
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

		this.setState({
			balanceOf,
			positionFromOthers,
			totalAdvocatedTAOLogos,
			sumBalanceOf,
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
			availableToPositionAmount
		} = this.state;

		let showSumLogosChart = false,
			sumLogosData = [];
		if (balanceOf.gt(0) || positionFromOthers.gt(0) || totalAdvocatedTAOLogos.gt(0)) {
			showSumLogosChart = true;
			sumLogosData = [
				{ value: balanceOf.toNumber(), color: Palette[0], highlight: Highlight[0], label: "Owned Balance" },
				{ value: positionFromOthers.toNumber(), color: Palette[1], highlight: Highlight[1], label: "Position by Others" },
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
				<Title className="margin-top">Logos Detail</Title>
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
							<FieldName>Positioned by Others</FieldName>
							<FieldValue>{positionFromOthers.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Total Advocated TAOs</FieldName>
							<FieldValue>{totalAdvocatedTAOLogos.toNumber()}</FieldValue>
						</FieldContainer>
					</DetailsContainer>
					{showSumLogosChart && <DoughnutChart data={sumLogosData} height={200} />}
				</ChartContainer>
				<ChartContainer>
					<DetailsContainer>
						<FieldContainer>
							<FieldName>Available to Position</FieldName>
							<FieldValue>{availableToPositionAmount.toNumber()}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Total Position on Others</FieldName>
							<FieldValue>{totalPositionOnOthers.toNumber()}</FieldValue>
						</FieldContainer>
					</DetailsContainer>
					{showPositionChart && <DoughnutChart data={positionData} height={200} />}
				</ChartContainer>
			</Wrapper>
		);
	}
}

export { LogosDetail };
