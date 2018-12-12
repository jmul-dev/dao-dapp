import * as React from "react";
import { Wrapper } from "./Styled";
import { Welcome } from "./widgets/Welcome/Welcome";
import { DoughnutChart } from "./widgets/DoughnutChart/DoughnutChart";
import { LineChart } from "./widgets/LineChart/LineChart";
import { CountUpWidget } from "./widgets/CountUpWidget/CountUpWidget";
import { Palette, Highlight } from "./color.json";

class Dashboard extends React.Component {
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

		return (
			<Wrapper>
				<div className="row">
					<div className="col-xs-4">
						<Welcome nameId={this.props.nameId} />
						<DoughnutChart title={"Current Staked Position"} data={doughnutChartData} />
						<CountUpWidget title="Logos" value={1000} />
						<CountUpWidget title="Pathos" value={34900} />
						<CountUpWidget title="Ethos" value={373} />
						<CountUpWidget title="Anti Logos" value={190} />
						<CountUpWidget title="Anti Pathos" value={746} />
						<CountUpWidget title="Anti Ethos" value={85} />
					</div>
					<div className="col-xs-8">
						<LineChart title={"Line Chart"} data={lineChartData} />
					</div>
				</div>
			</Wrapper>
		);
	}
}

export { Dashboard };
