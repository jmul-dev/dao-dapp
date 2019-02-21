import * as React from "react";
import { Wrapper, Title, Header, Ahref, Icon } from "components/";
import { LeftContainer, RightContainer } from "./styledComponents";

class TAOName extends React.Component {
	render() {
		const { id, name } = this.props;
		if (!id || !name) {
			return null;
		}
		return (
			<Wrapper className="margin-bottom-20">
				<LeftContainer>
					<Title className="medium margin-top-20 margin-bottom-0">{name}</Title>
					<Header>{id}</Header>
				</LeftContainer>
				<RightContainer>
					<Ahref className="white" to={`/create-tao/${id}/`}>
						<Icon className="animated bounceIn">
							<img src={process.env.PUBLIC_URL + "/images/create_child_tao.png"} alt={"Create Child TAO"} />
							<div>Create Child TAO</div>
						</Icon>
					</Ahref>
					<Ahref className="white" to={`/meet/${id}/`}>
						<Icon className="animated bounceIn">
							<img src={process.env.PUBLIC_URL + "/images/video_call.png"} alt={"Video Call"} />
							<div>Video Call</div>
						</Icon>
					</Ahref>
					<Ahref className="white" to={`/ide/${id}/`}>
						<Icon className="animated bounceIn">
							<img src={process.env.PUBLIC_URL + "/images/open_ide.png"} alt={"Open IDE"} />
							<div>Open IDE</div>
						</Icon>
					</Ahref>
				</RightContainer>
			</Wrapper>
		);
	}
}

export { TAOName };
