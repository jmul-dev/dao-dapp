import * as React from "react";
import { Wrapper, Content, Title, StyledCountUp } from "./Styled";

class CountUpWidget extends React.Component {
	render() {
		return (
			<Wrapper color={this.props.color}>
				<Content>
					<div className="row">
						<div className="col-xs-6">
							<Title>{this.props.title}</Title>
						</div>
						<div className="col-xs-6">
							<StyledCountUp end={this.props.value} />
						</div>
					</div>
				</Content>
			</Wrapper>
		);
	}
}

export { CountUpWidget };
