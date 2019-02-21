import * as React from "react";
import { Wrapper, Title, Icon } from "components/";
import { OwnerContent, ImgContainer, Img, BackgroundImage } from "./styledComponents";
import { UploadProfileImageFormContainer } from "./UploadProfileImageForm/";

class ProfileImage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showUploadProfileImageForm: false
		};
		this.initialState = this.state;
		this.toggleUploadProfileImageForm = this.toggleUploadProfileImageForm.bind(this);
	}

	toggleUploadProfileImageForm() {
		this.setState({ showUploadProfileImageForm: !this.state.showUploadProfileImageForm });
	}

	render() {
		const { isOwner, profileImage, refreshProfileImage } = this.props;
		const { showUploadProfileImageForm } = this.state;

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
							refreshProfileImage={refreshProfileImage}
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
