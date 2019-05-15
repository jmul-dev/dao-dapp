import * as React from "react";
import { Wrapper } from "components/";

class ProgressLoader extends React.Component {
	render() {
		const { pastEventsProgress, latestBlockNumber, blockNumberProcessed } = this.props;
		return (
			<Wrapper className="padding-40">
				Loading{" "}
				{pastEventsProgress === 100 || !pastEventsProgress
					? ``
					: `block #${blockNumberProcessed} out of #${latestBlockNumber} - (${pastEventsProgress}%)`}{" "}
				...
			</Wrapper>
		);
	}
}

export { ProgressLoader };
