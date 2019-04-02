import * as React from "react";
import { Wrapper, Ahref } from "components/";
import { NameLink, SumLogosContainer, Divider, TimeContainer, Reply } from "./styledComponents";
import { toHighestDenomination, timeSince } from "utils/";
import { AddThoughtContainer } from "../../AddThought/";

class Thought extends React.Component {
	constructor(props) {
		super(props);
		this.state = { showForm: false };
		this.toggleShowForm = this.toggleShowForm.bind(this);
	}

	toggleShowForm() {
		this.setState({ showForm: !this.state.showForm });
	}

	render() {
		const { names, thoughtInfo, taoId, getTAOThoughts } = this.props;
		const { showForm } = this.state;
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
					<SumLogosContainer>{toHighestDenomination(thoughtInfo.sumLogos)} logos</SumLogosContainer>
					<Divider>&#183;</Divider>
					<TimeContainer>{timeSince(thoughtInfo.timestamp)} ago</TimeContainer>
				</Wrapper>
				<Wrapper className="small" dangerouslySetInnerHTML={{ __html: thoughtInfo.thought }} />
				{!showForm ? (
					<Reply onClick={this.toggleShowForm}>
						<img src={process.env.PUBLIC_URL + "/images/reply.png"} alt={"Reply"} />
						Reply
					</Reply>
				) : (
					<AddThoughtContainer
						taoId={taoId}
						getTAOThoughts={getTAOThoughts}
						parentThoughtId={thoughtInfo.thoughtId}
						toggleShowForm={this.toggleShowForm}
					/>
				)}
			</Wrapper>
		);
	}
}

export { Thought };
