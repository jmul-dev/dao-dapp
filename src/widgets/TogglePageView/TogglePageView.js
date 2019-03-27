import * as React from "react";
import { Wrapper, GroupButton } from "components/";

class TogglePageView extends React.Component {
	render() {
		const { singlePageView } = this.props;
		if (typeof singlePageView === "undefined") {
			return null;
		}

		return (
			<Wrapper className="btn-group btn-group-sm" role="group">
				<GroupButton
					type="button"
					className={`btn btn-default ${!singlePageView ? "selected" : ""}`}
					onClick={this.props.toggleView}
				>
					Tab View
				</GroupButton>
				<GroupButton
					type="button"
					className={`btn btn-default ${singlePageView ? "selected" : ""}`}
					onClick={this.props.toggleView}
				>
					Single Page View
				</GroupButton>
			</Wrapper>
		);
	}
}

export { TogglePageView };
