import * as React from "react";
import { Wrapper } from "components/";
import { LeftContainer, RightContainer } from "./styledComponents";
import { ProfileContainer } from "./Profile/";
import { PositionDetails } from "./PositionDetails/";
import { ProfileImage } from "./ProfileImage/";
import { PublicKeysContainer } from "./PublicKeys/";
import { LogosDetailsContainer } from "./LogosDetails/";
import { encodeParams, get } from "utils/";

const promisify = require("tiny-promisify");

class NameProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOwner: false,
			nameInfo: null,
			isListener: false,
			isSpeaker: false,
			position: null,
			profileImage: null
		};
		this.initialState = this.state;
		this.getData = this.getData.bind(this);
		this.refreshProfileImage = this.refreshProfileImage.bind(this);
		this.setListener = this.setListener.bind(this);
		this.setSpeaker = this.setSpeaker.bind(this);
	}

	async componentDidMount() {
		await this.getData(this.props.params.id, this.props.nameId);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getData(this.props.params.id, this.props.nameId);
		}
	}

	async getData(id, nameId) {
		if (!id || !nameId) {
			return;
		}

		await this.getNameInfo(id);
		await this.getNamePosition(id);
		await this.getProfileImage(id);
		if (id === nameId) {
			this.setState({ isOwner: true });
		} else {
			await this.checkListenerSpeaker(id);
		}
	}

	async getNameInfo(id) {
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

	async checkListenerSpeaker(id) {
		const { nameTAOPosition, nameId } = this.props;
		if (!id || !nameTAOPosition || !nameId) {
			return;
		}
		const _position = await promisify(nameTAOPosition.getPositionById)(nameId);
		this.setState({ isListener: _position[3] === id, isSpeaker: _position[5] === id });
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

	async getProfileImage(id) {
		try {
			const response = await get(`https://localhost/api/get-profile-image?${encodeParams({ nameId: id })}`);
			if (response.profileImage) {
				this.setState({ profileImage: response.profileImage });
			}
		} catch (e) {}
	}

	refreshProfileImage(profileImage) {
		this.setState({ profileImage });
	}

	setListener() {
		this.setState({ isListener: true });
	}

	setSpeaker() {
		this.setState({ isSpeaker: true });
	}

	render() {
		const { isOwner, nameInfo, isListener, isSpeaker, position, profileImage } = this.state;
		if (!nameInfo || !position) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		return (
			<Wrapper className="padding-40">
				<LeftContainer>
					<ProfileContainer
						isOwner={isOwner}
						nameInfo={nameInfo}
						isListener={isListener}
						isSpeaker={isSpeaker}
						setListener={this.setListener}
						setSpeaker={this.setSpeaker}
					/>
					<PositionDetails position={position} />
				</LeftContainer>
				<RightContainer>
					<ProfileImage isOwner={isOwner} profileImage={profileImage} refreshProfileImage={this.refreshProfileImage} />
				</RightContainer>
				{isOwner && (
					<div>
						<LogosDetailsContainer id={this.props.params.id} isOwner={isOwner} />
						<PublicKeysContainer id={this.props.params.id} />
					</div>
				)}
			</Wrapper>
		);
	}
}

export { NameProfile };
