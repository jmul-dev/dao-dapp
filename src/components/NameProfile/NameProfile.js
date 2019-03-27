import * as React from "react";
import { Wrapper, LeftContainer, RightContainer, NavLink } from "components/";
import { TogglePageViewContainer } from "widgets/TogglePageView/";
import { Tab, Nav } from "react-bootstrap";
import { ProfileContainer } from "./Profile/";
import { PositionDetails } from "./PositionDetails/";
import { ListenedNameContainer } from "./ListenedName/";
import { ProfileImage } from "./ProfileImage/";
import { PublicKeysContainer } from "./PublicKeys/";
import { LogosDetailsContainer } from "./LogosDetails/";
import { encodeParams, get } from "utils/";

const promisify = require("tiny-promisify");

class NameProfile extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			tabKey: "name-info",
			isOwner: false,
			nameInfo: null,
			isListener: false,
			isSpeaker: false,
			position: null,
			profileImage: null,
			dataPopulated: false
		};
		this.initialState = this.state;
		this.getData = this.getData.bind(this);
		this.refreshProfileImage = this.refreshProfileImage.bind(this);
		this.setListener = this.setListener.bind(this);
		this.setSpeaker = this.setSpeaker.bind(this);
	}

	async componentDidMount() {
		this._isMounted = true;
		await this.getData();
	}

	async componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getData();
		} else if (this.props.namePositions !== prevProps.namePositions) {
			await this.getNamePosition();
		}
	}

	async getData() {
		const { id } = this.props.params;
		const { nameId } = this.props;
		if (!id || !nameId) {
			return;
		}
		await this.getNameInfo();
		await this.getNamePosition();
		await this.getProfileImage();
		if (id === nameId && this._isMounted) {
			this.setState({ isOwner: true });
		} else {
			await this.checkListenerSpeaker();
		}
		if (this._isMounted) {
			this.setState({ dataPopulated: true });
		}
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
		if (this._isMounted) {
			this.setState({ nameInfo });
		}
	}

	async checkListenerSpeaker() {
		const { id } = this.props.params;
		const { nameTAOPosition, nameId } = this.props;
		if (!id || !nameTAOPosition || !nameId) {
			return;
		}
		const _position = await promisify(nameTAOPosition.getPositionById)(nameId);
		if (this._isMounted) {
			this.setState({ isListener: _position[3] === id, isSpeaker: _position[5] === id });
		}
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
		if (this._isMounted) {
			this.setState({ position });
		}
	}

	async getProfileImage() {
		const { id } = this.props.params;
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-profile-image?${encodeParams({ nameId: id })}`);
			if (response.profileImage && this._isMounted) {
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
		const { id } = this.props.params;
		const { singlePageView, pastEventsRetrieved } = this.props;
		const { tabKey, isOwner, nameInfo, isListener, isSpeaker, position, profileImage, dataPopulated } = this.state;
		if (!pastEventsRetrieved || !dataPopulated || typeof singlePageView === "undefined") {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		return (
			<Wrapper className="padding-40">
				<Wrapper className="margin-bottom-40">
					<LeftContainer />
					<RightContainer className="right">
						<TogglePageViewContainer />
					</RightContainer>
				</Wrapper>
				{singlePageView ? (
					<Wrapper>
						<LeftContainer className="width-65">
							<ProfileContainer
								isOwner={isOwner}
								nameInfo={nameInfo}
								isListener={isListener}
								isSpeaker={isSpeaker}
								setListener={this.setListener}
								setSpeaker={this.setSpeaker}
							/>
							<PositionDetails position={position} singlePageView={singlePageView} />
							{isOwner && <ListenedNameContainer id={id} singlePageView={singlePageView} />}
						</LeftContainer>
						<RightContainer className="width-35">
							<ProfileImage isOwner={isOwner} profileImage={profileImage} refreshProfileImage={this.refreshProfileImage} />
						</RightContainer>
						{isOwner && (
							<Wrapper>
								<LogosDetailsContainer
									id={id}
									isOwner={isOwner}
									singlePageView={singlePageView}
									populateGraph={tabKey === "logos-details"}
								/>
								<PublicKeysContainer id={id} singlePageView={singlePageView} />
							</Wrapper>
						)}
					</Wrapper>
				) : (
					<Tab.Container id="name-profile" defaultActiveKey="profile" onSelect={(key) => this.setState({ tabKey: key })}>
						<LeftContainer className="width-20">
							<Nav className="flex-column">
								<Nav.Item>
									<NavLink eventKey="profile">Profile</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="profile-image">Profile Image</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="position">Position</NavLink>
								</Nav.Item>
								{isOwner && (
									<Wrapper>
										<Nav.Item>
											<NavLink eventKey="listened-names">Listened Names</NavLink>
										</Nav.Item>
										<Nav.Item>
											<NavLink eventKey="logos-details">Logos Details</NavLink>
										</Nav.Item>
										<Nav.Item>
											<NavLink eventKey="public-keys">Public Keys</NavLink>
										</Nav.Item>
									</Wrapper>
								)}
							</Nav>
						</LeftContainer>
						<RightContainer className="width-80">
							<Tab.Content>
								<Tab.Pane eventKey="profile">
									<ProfileContainer
										isOwner={isOwner}
										nameInfo={nameInfo}
										isListener={isListener}
										isSpeaker={isSpeaker}
										setListener={this.setListener}
										setSpeaker={this.setSpeaker}
									/>
								</Tab.Pane>
								<Tab.Pane eventKey="profile-image">
									<ProfileImage
										isOwner={isOwner}
										profileImage={profileImage}
										refreshProfileImage={this.refreshProfileImage}
									/>
								</Tab.Pane>
								<Tab.Pane eventKey="position">
									<PositionDetails position={position} singlePageView={singlePageView} />
								</Tab.Pane>
								{isOwner && (
									<Tab.Pane eventKey="listened-names">
										<ListenedNameContainer id={id} singlePageView={singlePageView} />
									</Tab.Pane>
								)}
								{isOwner && (
									<Tab.Pane eventKey="logos-details">
										<LogosDetailsContainer
											id={id}
											isOwner={isOwner}
											singlePageView={singlePageView}
											populateGraph={tabKey === "logos-details"}
										/>
									</Tab.Pane>
								)}
								{isOwner && (
									<Tab.Pane eventKey="public-keys">
										<PublicKeysContainer id={id} singlePageView={singlePageView} />
									</Tab.Pane>
								)}
							</Tab.Content>
						</RightContainer>
					</Tab.Container>
				)}
			</Wrapper>
		);
	}
}

export { NameProfile };
