import * as React from "react";
import { Wrapper, Title, Icon } from "components/";
import { OwnerContent, ImgContainer, Img, BackgroundImage } from "./styledComponents";
import { UploadProfileImageFormContainer } from "./UploadProfileImageForm/";
import { encodeParams } from "utils/";

class ProfileImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOwner: false,
			profileImage: null,
			showUploadProfileImageForm: false
		};
		this.initialState = this.state;
		this.toggleUploadProfileImageForm = this.toggleUploadProfileImageForm.bind(this);
		this.refreshProfileImage = this.refreshProfileImage.bind(this);
	}

	async componentDidMount() {
		const { id, nameId } = this.props;

		if (id === nameId) {
			this.setState({ isOwner: true });
		}
		await this.getProfileImage(id);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
			this.setState(this.initialState);

			const { id, nameId } = this.props;
			if (id === nameId) {
				this.setState({ isOwner: true });
			}
			await this.getProfileImage(id);
		}
	}

	async getProfileImage(id) {
		fetch(`https://localhost/api/get-profile-image?${encodeParams({ nameId: id })}`)
			.then((response) => {
				return response.json();
			})
			.then((resp) => {
				if (resp.profileImage) {
					this.setState({ profileImage: resp.profileImage });
				}
			});
	}

	toggleUploadProfileImageForm() {
		this.setState({ showUploadProfileImageForm: !this.state.showUploadProfileImageForm });
	}

	async refreshProfileImage(profileImage) {
		this.setState({ profileImage });
	}

	render() {
		const { isOwner, profileImage, showUploadProfileImageForm } = this.state;

		let ownerFeatures = null;
		if (isOwner) {
			ownerFeatures = (
				<OwnerContent>
					{!showUploadProfileImageForm ? (
						<div>
							<Icon className="animated bounceIn" onClick={this.toggleUploadProfileImageForm}>
								<img src={process.env.PUBLIC_URL + "/images/upload_profile_image.png"} alt={"Upload Avatar"} />
								<div>Upload Profile Image</div>
							</Icon>
						</div>
					) : (
						<UploadProfileImageFormContainer
							toggleUploadProfileImageForm={this.toggleUploadProfileImageForm}
							refreshProfileImage={this.refreshProfileImage}
						/>
					)}
				</OwnerContent>
			);
		}

		const imageContent = (
			<ImgContainer>
				{profileImage ? (
					<BackgroundImage style={{ backgroundImage: `url(${profileImage})` }} />
				) : (
					<Img src={process.env.PUBLIC_URL + "/images/user_avatar.png"} alt={"User Avatar"} />
				)}
			</ImgContainer>
		);

		return (
			<Wrapper>
				<Title>Profile Image</Title>
				{!showUploadProfileImageForm ? imageContent : null}
				{ownerFeatures}
			</Wrapper>
		);
	}
}

export { ProfileImage };
