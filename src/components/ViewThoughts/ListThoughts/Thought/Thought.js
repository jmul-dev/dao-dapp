import * as React from "react";
import { Wrapper, Ahref } from "components/";
import { NameLink, TimeContainer } from "./styledComponents";
import { timeSince } from "utils/";

class Thought extends React.Component {
	render() {
		const { names, thoughtInfo } = this.props;
		if (!names) {
			return null;
		}
		const nameInfo = names.find((name) => name.nameId === thoughtInfo.nameId);
		if (!nameInfo) {
			return null;
		}
		return (
			<Wrapper className="margin-bottom-20">
				<Wrapper className="small">
					<NameLink>
						<Ahref className="white" to={`/profile/${thoughtInfo.nameId}/`}>
							{nameInfo.name}
						</Ahref>
					</NameLink>
					<TimeContainer>{timeSince(thoughtInfo.timestamp)} ago</TimeContainer>
				</Wrapper>
				<Wrapper className="small" dangerouslySetInnerHTML={{ __html: thoughtInfo.thought }} />
			</Wrapper>
		);
	}
}

export { Thought };
