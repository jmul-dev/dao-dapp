import * as React from "react";
import { NameListContainer } from "./NameList/";
import { TAOListContainer } from "./TAOList/";

import { Wrapper, WidgetWrapper } from "../Styled";
import { Welcome } from "widgets/Welcome/Welcome";
import { DoughnutChart } from "widgets/DoughnutChart/";
import { LineChart } from "widgets/LineChart/LineChart";
import { CountUpWidget } from "widgets/CountUpWidget/CountUpWidget";
import { ListTAO } from "widgets/ListTAO/ListTAO";
import { RadarChart } from "widgets/RadarChart/RadarChart";
import { Palette, Highlight } from "css/color.json";

import { buildTAOTreeData } from "utils/";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoTreeData: null
		};
	}

	componentDidMount() {
		if (this.props.taos) {
			const taoTreeData = buildTAOTreeData(this.props.taos);
			this.setState({ taoTreeData });
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.taos !== prevProps.taos) {
			const taoTreeData = buildTAOTreeData(this.props.taos);
			this.setState({ taoTreeData });
		}
	}

	render() {
		const doughnutChartData = [
			{ value: 20, color: Palette[0], highlight: Highlight[0], label: "TAO Name#1 - Position" },
			{ value: 30, color: Palette[1], highlight: Highlight[1], label: "TAO Name#2 - Position" },
			{ value: 10, color: Palette[2], highlight: Highlight[2], label: "TAO Name#3 - Position" },
			{ value: 10, color: Palette[5], highlight: Highlight[5], label: "TAO Name#4 - Position" },
			{ value: 30, color: Palette[7], highlight: Highlight[7], label: "TAO Name#5 - Position" }
		];

		const lineChartData = {
			labels: ["10", "20", "30", "40", "50", "60", "70"],
			datasets: [
				{
					label: "Foo",
					fillColor: "#F1E7E5",
					strokeColor: "#E8575A",
					pointColor: "#E8575A",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#ff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [10, 55, 69, 45, 87, 68, 74]
				},
				{
					label: "Bar",
					fillColor: "rgba(151,187,205,0.2)",
					strokeColor: "rgba(151,187,205,1)",
					pointColor: "rgba(151,187,205,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(151,187,205,1)",
					data: [22, 33, 88, 45, 28, 87, 53]
				}
			]
		};

		const taoData = [
			{
				id: "0x30406ad3a412d0569f066ec8cf9a770a079f104d",
				name: "Increase inflationRate value",
				position: "Advocate"
			},
			{
				id: "0x16b15bc990e28277a0f29c5a22bea0f48ee6811b",
				name: "Switch Primordial Thought's Advocate",
				position: "Listener"
			},
			{
				id: "0x1234ebfaf0457e553e70de5aa0db18918cc8526d",
				name: "Create inflationBonus setting",
				position: "Speaker"
			},
			{
				id: "0x2f5730bbc12c87bf1ba0815663a297a822a43bfb",
				name: "Pause Network Exchange",
				position: "Advocate"
			}
		];

		const radarChartData = {
			labels: ["Logos", "Pathos", "Ethos", "Anti Logos", "Anti Pathos", "Anti Ethos"],
			datasets: [
				{
					label: "Earning",
					fillColor: "rgba(220,220,220,0.2)",
					strokeColor: "rgba(220,220,220,1)",
					pointColor: "rgba(220,220,220,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: [45, 80, 70, 33, 80, 82]
				},
				{
					label: "Spending",
					fillColor: "rgba(151,187,205,0.2)",
					strokeColor: "rgba(151,187,205,1)",
					pointColor: "rgba(151,187,205,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(151,187,205,1)",
					data: [54, 98, 70, 34, 87, 50]
				}
			]
		};

		const { taoTreeData } = this.state;
		return (
			<Wrapper>
				<WidgetWrapper>
					<TAOListContainer taoData={taoTreeData} width={1200} height={800} />
				</WidgetWrapper>
				<NameListContainer />
				<div className="row">
					<div className="col-xs-4">
						<WidgetWrapper>
							<Welcome nameId={this.props.nameId} />
							<DoughnutChart title={"Current Staked Position"} data={doughnutChartData} height={200} />
							<CountUpWidget title="Logos" value={1000} />
							<CountUpWidget title="Pathos" value={34900} />
							<CountUpWidget title="Ethos" value={373} />
							<CountUpWidget title="Anti Logos" value={190} />
							<CountUpWidget title="Anti Pathos" value={746} />
							<CountUpWidget title="Anti Ethos" value={85} />
						</WidgetWrapper>
					</div>
					<div className="col-xs-8">
						<WidgetWrapper>
							<LineChart title={"Line Chart"} data={lineChartData} />
							<div className="row">
								<div className="col-xs-7">
									<ListTAO data={taoData} />
								</div>
								<div className="col-xs-5">
									<RadarChart title={"Radar Chart"} data={radarChartData} />
								</div>
							</div>
						</WidgetWrapper>
					</div>
				</div>
			</Wrapper>
		);
	}
}

export { Dashboard };
