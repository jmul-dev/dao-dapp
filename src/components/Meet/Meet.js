import * as React from "react";
import { Wrapper, Title, Header, Ahref } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { IframeContainer } from "./styledComponents";
import { getTAODescriptions as graphqlGetTAODescriptions } from "utils/graphql";
import Iframe from "react-iframe";
import * as _ from "lodash";

const promisify = require("tiny-promisify");

class Meet extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			taoDescriptions: null,
			loaded: false
		};
		this.iframeLoaded = this.iframeLoaded.bind(this);
	}

	async componentDidMount() {
		await this.getTAOInfo(this.props.params.id);
		await this.getTAODescriptions(this.props.params.id);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getTAOInfo(this.props.params.id);
			await this.getTAODescriptions(this.props.params.id);
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

	async getTAODescriptions(id) {
		if (!id) {
			return;
		}
		try {
			const response = await graphqlGetTAODescriptions(id);
			if (response.data.taoDescriptions) {
				const _descriptions = response.data.taoDescriptions.map((desc) => {
					return { timestamp: desc.splitKey[desc.splitKey.length - 1] * 1, value: desc.description };
				});
				this.setState({ taoDescriptions: _.orderBy(_descriptions, ["timestamp"], ["desc"]) });
			}
		} catch (e) {}
	}

	iframeLoaded() {
		this.setState({ loaded: true });
	}

	render() {
		const { id } = this.props.params;
		const { taoInfo, taoDescriptions, loaded } = this.state;
		const { pastEventsRetrieved } = this.props;
		if (!taoInfo || !taoDescriptions || !pastEventsRetrieved) {
			return <ProgressLoaderContainer />;
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
				{taoDescriptions.length > 0 && (
					<Wrapper className="margin-bottom-20" dangerouslySetInnerHTML={{ __html: taoDescriptions[0].value }} />
				)}
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
