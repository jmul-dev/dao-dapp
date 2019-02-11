import * as React from "react";
import { Wrapper, Title, TitleMargin, FieldContainer, FieldName, FieldValue } from "./styledComponents";

const promisify = require("tiny-promisify");

class NameProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nameInfo: null,
			position: null
		};
	}

	async componentDidMount() {
		await this.getNameInfo();
		await this.getNamePosition();
	}

	async getNameInfo() {
		const { id } = this.props.params;
		const { nameTAOLookup } = this.props;
		if (!nameTAOLookup || !id) {
			return;
		}

		const _nameInfo = await promisify(nameTAOLookup.getById)(id);
		const nameInfo = {
			name: _nameInfo[0],
			nameId: _nameInfo[1],
			typeId: _nameInfo[2],
			parentName: _nameInfo[3],
			parentId: _nameInfo[4],
			parentTypeId: _nameInfo[5]
		};
		this.setState({ nameInfo });
	}

	async getNamePosition() {
		const { id } = this.props.params;
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
		const { nameInfo, position } = this.state;
		if (!nameInfo || !position) {
			return null;
		}
		return (
			<Wrapper>
				<Title>Profile</Title>
				<FieldContainer>
					<FieldName>Name</FieldName>
					<FieldValue>
						{nameInfo.name} ({nameInfo.nameId})
					</FieldValue>
				</FieldContainer>
				<TitleMargin>Position</TitleMargin>
				<FieldContainer>
					<FieldName>Advocate</FieldName>
					<FieldValue>
						{position.advocateName} ({position.advocateId})
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Listener</FieldName>
					<FieldValue>
						{position.listenerName} ({position.listenerId})
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Speaker</FieldName>
					<FieldValue>
						{position.speakerName} ({position.speakerId})
					</FieldValue>
				</FieldContainer>
			</Wrapper>
		);
	}
}

export { NameProfile };
