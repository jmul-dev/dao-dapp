import * as React from "react";
import { Wrapper, Title, Ahref, FieldContainer, FieldName, FieldValue } from "components/";

const promisify = require("tiny-promisify");

class PositionDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			position: null
		};
	}

	async componentDidMount() {
		const { id } = this.props;
		await this.getNamePosition(id);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
			const { id } = this.props;
			await this.getNamePosition(id);
		}
	}

	async getNamePosition(id) {
		const { nameTAOPosition } = this.props;
		if (!nameTAOPosition || !id) {
			return;
		}

		const _position = await promisify(nameTAOPosition.getPositionById)(id);
		const position = {
			advocateName: _position[0],
			advocateId: _position[1],
			listenerName: _position[2],
			listenerId: _position[3],
			speakerName: _position[4],
			speakerId: _position[5]
		};
		this.setState({ position });
	}

	render() {
		const { position } = this.state;
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
