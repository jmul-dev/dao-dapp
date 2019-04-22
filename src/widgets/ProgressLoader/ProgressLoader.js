import * as React from "react";
import { Wrapper } from "components/";

class ProgressLoader extends React.Component {
	render() {
		const { pastEventsProgress } = this.props;
		if (!pastEventsProgress) {
			return null;
		}
		return (
			<Wrapper className="padding-40">
				Loading {pastEventsProgress === 100 ? "" : "initial data " + pastEventsProgress + "%"} ...
			</Wrapper>
		);
	}
}

export { ProgressLoader };
