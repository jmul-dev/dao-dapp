import * as React from "react";
import { Wrapper, Title, Ahref, FieldContainer, FieldName, FieldValue } from "components/";

class PositionDetails extends React.Component {
	render() {
		const { position } = this.props;
		if (!position) {
			return null;
		}

		return (
			<Wrapper>
				<Title className="margin-top">Position</Title>
				<FieldContainer>
					<FieldName className="small">Advocate</FieldName>
					<FieldValue>
						<Ahref to={position.advocate.isTAO ? `/tao/${position.advocate.id}` : `/profile/${position.advocate.id}`}>
							{position.advocate.name} ({position.advocate.id})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName className="small">Listener</FieldName>
					<FieldValue>
						<Ahref to={position.listener.isTAO ? `/tao/${position.listener.id}` : `/profile/${position.listener.id}`}>
							{position.listener.name} ({position.listener.id})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName className="small">Speaker</FieldName>
					<FieldValue>
						<Ahref to={position.speaker.isTAO ? `/tao/${position.speaker.id}` : `/profile/${position.speaker.id}`}>
							{position.speaker.name} ({position.speaker.id})
						</Ahref>
					</FieldValue>
				</FieldContainer>
			</Wrapper>
		);
	}
}

export { PositionDetails };
