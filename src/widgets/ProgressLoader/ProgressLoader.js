import * as React from "react";
import { Wrapper } from "components/";

class ProgressLoader extends React.Component {
	render() {
		const { pastEventsProgress } = this.props;
		return (
			<Wrapper className="padding-40">
				Loading {pastEventsProgress === 100 || !pastEventsProgress ? "" : "initial data " + pastEventsProgress + "%"} ...
			</Wrapper>
		);
	}
}

export { ProgressLoader };
