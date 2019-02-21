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
					<FieldName>Advocate</FieldName>
					<FieldValue>
						<Ahref to={`/profile/${position.advocateId}`}>
							{position.advocateName} ({position.advocateId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Listener</FieldName>
					<FieldValue>
						<Ahref to={`/profile/${position.listenerId}`}>
							{position.listenerName} ({position.listenerId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Speaker</FieldName>
					<FieldValue>
						<Ahref to={`/profile/${position.speakerId}`}>
							{position.speakerName} ({position.speakerId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
			</Wrapper>
		);
	}
}

export { PositionDetails };
