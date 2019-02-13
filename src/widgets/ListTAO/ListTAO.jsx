import * as React from "react";
import { Wrapper, Header, TAOWrapper, TAOName, TAOID, Right, TAOPosition } from "./Styled";

class ListTAO extends React.Component {
	render() {
		const list = this.props.data.map((tao) => (
			<TAOWrapper key={tao.id}>
				<div className="row">
					<div className="col-xs-8">
						<TAOName>{tao.name}</TAOName>
						<TAOID>ID: {tao.id}</TAOID>
					</div>
					<Right className="col-xs-4">
						<TAOPosition>{tao.position}</TAOPosition>
					</Right>
				</div>
			</TAOWrapper>
		));
		return (
			<Wrapper backgroundColor={this.props.backgroundColor}>
				<Header>Your TAOs</Header>
				{list}
			</Wrapper>
		);
	}
}

export { ListTAO };
