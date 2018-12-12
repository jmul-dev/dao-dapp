import * as React from "react";
import { Wrapper } from "./Styled";
import { DoughnutChart } from "./widgets/DoughnutChart/DoughnutChart";
import { CountUpWidget } from "./widgets/CountUpWidget/CountUpWidget";
import { Palette, Highlight } from "./color.json";

class Dashboard extends React.Component {
	render() {
		const doughnutChartData = [
			{ value: 20, color: Palette[0], highlight: Highlight[0], label: "TAO - TAO Name#1 - Position" },
			{ value: 30, color: Palette[1], highlight: Highlight[1], label: "TAO - TAO Name#2 - Position" },
			{ value: 10, color: Palette[2], highlight: Highlight[2], label: "TAO - TAO Name#3 - Position" },
			{ value: 10, color: Palette[5], highlight: Highlight[5], label: "TAO - TAO Name#4 - Position" },
			{ value: 30, color: Palette[7], highlight: Highlight[7], label: "TAO - TAO Name#5 - Position" }
		];

		return (
			<Wrapper>
				<div className="row">
					<div className="col-xs-4">
						<CountUpWidget title="Logos" value={1000} backgroundColor={Palette[0]} />
					</div>
					<div className="col-xs-4">
						<CountUpWidget title="Pathos" value={34900} backgroundColor={Palette[1]} />
					</div>
					<div className="col-xs-4">
						<CountUpWidget title="Ethos" value={373} backgroundColor={Palette[2]} />
					</div>
				</div>
				<div className="row">
					<div className="col-xs-4">
						<CountUpWidget title="Anti Logos" value={190} backgroundColor={Palette[3]} />
					</div>
					<div className="col-xs-4">
						<CountUpWidget title="Anti Pathos" value={746} backgroundColor={Palette[4]} />
					</div>
					<div className="col-xs-4">
						<CountUpWidget title="Anti Ethos" value={85} backgroundColor={Palette[5]} />
					</div>
				</div>
				<div className="row">
					<div className="col-xs-4">
						<DoughnutChart title={"Current Staked Position"} data={doughnutChartData} />
					</div>
				</div>
			</Wrapper>
		);
	}
}

export { Dashboard };
