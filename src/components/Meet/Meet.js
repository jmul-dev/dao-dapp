import * as React from "react";
import { Wrapper, Title, Header, Ahref } from "components/";
import { IframeContainer } from "./styledComponents";
import { get, encodeParams } from "utils/";
import Iframe from "react-iframe";

const promisify = require("tiny-promisify");

class Meet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			taoDescription: null,
			loaded: false
		};
		this.iframeLoaded = this.iframeLoaded.bind(this);
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

	iframeLoaded() {
		this.setState({ loaded: true });
	}

	render() {
		const { id } = this.props.params;
		const { taoInfo, taoDescription, loaded } = this.state;
		if (!taoInfo || !taoDescription) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}
		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${id}`}>
					Back to TAO Details
				</Ahref>
				<Wrapper className="margin-bottom-20">
					<Title className="medium margin-top-20 margin-bottom-0">{taoInfo.name}</Title>
					<Header>{id}</Header>
				</Wrapper>
				<Wrapper className="margin-bottom-20" dangerouslySetInnerHTML={{ __html: taoDescription }} />
				{!loaded && <Header>Loading video chat module ... this will take a moment ...</Header>}
				<IframeContainer>
					<Iframe
						url={`https://meet.paramation.com/${id}`}
						height="600"
						width="800"
						allowFullScreen
						allow="microphone; camera"
						onLoad={this.iframeLoaded}
					/>
				</IframeContainer>
			</Wrapper>
		);
	}
}

export { Meet };
