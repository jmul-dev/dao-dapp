import * as React from "react";
import { Wrapper, Title, Header, Ahref, Icon, MediumEditor } from "components/";
import { LeftContainer, RightContainer } from "./styledComponents";
import { get, encodeParams } from "utils/";

const promisify = require("tiny-promisify");

class TAODetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			taoDescription: null
		};
		this.initialState = this.state;
		this.handleEditorChange = this.handleEditorChange.bind(this);
	}

	async componentDidMount() {
		await this.getTAOInfo(this.props.params.id);
		await this.getTAODescription(this.props.params.id);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getTAOInfo(this.props.params.id);
			await this.getTAODescription(this.props.params.id);
		}
	}

	async getTAOInfo(id) {
		const { taoFactory } = this.props;
		if (!taoFactory || !id) {
			return;
		}

		const _taoInfo = await promisify(taoFactory.getTAO)(id);
		const taoInfo = {
			name: _taoInfo[0]
		};
		this.setState({ taoInfo });
	}

	async getTAODescription(id) {
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-tao-description?${encodeParams({ taoId: id })}`);
			if (response.description) {
				this.setState({ taoDescription: response.description });
			}
		} catch (e) {}
	}

	handleEditorChange(taoDescription) {
		this.setState({ taoDescription });
	}

	render() {
		const { id } = this.props.params;
		const { taoInfo, taoDescription } = this.state;
		if (!taoInfo || !taoDescription) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		return (
			<Wrapper>
				<Wrapper className="padding-40">
					<Ahref className="small" to="/">
						Back to Dashboard
					</Ahref>
					<Wrapper className="margin-bottom-20">
						<LeftContainer>
							<Title className="medium margin-top-20 margin-bottom-0">{taoInfo.name}</Title>
							<Header>{id}</Header>
						</LeftContainer>
						<RightContainer>
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
					<MediumEditor text={taoDescription} onChange={this.handleEditorChange} />
				</Wrapper>
			</Wrapper>
		);
	}
}

export { TAODetails };
