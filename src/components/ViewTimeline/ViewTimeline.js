import * as React from "react";
import { Wrapper, Title, Header, Ahref } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { Timeline, TimelineItem } from "vertical-timeline-component-for-react";
import { formatDate } from "utils/";
import { getTAODescriptions as graphqlGetTAODescriptions } from "utils/graphql";
import * as _ from "lodash";

class ViewTimeline extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoDescriptions: null
		};
		this.initialState = this.state;
	}

	async componentDidMount() {
		await this.getTAODescriptions();
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getTAODescriptions();
		}
	}

	async getTAODescriptions() {
		const { id } = this.props.params;
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

	render() {
		const { id } = this.props.params;
		const { taos, pastEventsRetrieved } = this.props;
		const { taoDescriptions } = this.state;

		let tao = null;
		if (taos) {
			tao = taos.find((_tao) => _tao.taoId === id);
		}
		if (!tao || !pastEventsRetrieved) {
			return <ProgressLoaderContainer />;
		}

		let taoDescriptionsContent;
		if (taoDescriptions && taoDescriptions.length) {
			taoDescriptionsContent = taoDescriptions.map((desc) => (
				<TimelineItem
					key={desc.timestamp}
					dateText={formatDate(desc.timestamp)}
					dateInnerStyle={{ background: "#000000" }}
					bodyContainerStyle={{ color: "#FFFFFF" }}
				>
					<Wrapper dangerouslySetInnerHTML={{ __html: desc.value }} />
				</TimelineItem>
			));
		}

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${id}`}>
					Back to TAO Details
				</Ahref>
				<Wrapper className="margin-bottom-20">
					<Title className="medium margin-top-20 margin-bottom-0">{tao.name}</Title>
					<Header>{id}</Header>
				</Wrapper>
				{taoDescriptions && taoDescriptions.length > 0 && <Timeline lineColor={"#444"}>{taoDescriptionsContent}</Timeline>}
			</Wrapper>
		);
	}
}

export { ViewTimeline };
