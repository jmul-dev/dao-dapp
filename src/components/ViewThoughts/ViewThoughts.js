import * as React from "react";
import { Wrapper, Title, Header, Ahref, Hr } from "components/";
import { AddThoughtContainer } from "./AddThought/";
import { ListThoughts } from "./ListThoughts/";
import { get, encodeParams } from "utils/";
import { buildThoughtsHierarchy } from "utils/";
import { DropdownButton, Dropdown } from "react-bootstrap";
import * as _ from "lodash";

class ViewThoughts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoDescriptions: null,
			thoughts: null,
			sortBy: "logos"
		};
		this.initialState = this.state;
		this.getTAOThoughts = this.getTAOThoughts.bind(this);
		this.sortBy = this.sortBy.bind(this);
	}

	async componentDidMount() {
		await this.getTAODescriptions();
		await this.getTAOThoughts();
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getTAODescriptions();
			await this.getTAOThoughts();
		}
	}

	async getTAODescriptions() {
		const { id } = this.props.params;
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-tao-descriptions?${encodeParams({ taoId: id })}`);
			if (response.descriptions) {
				const _descriptions = response.descriptions.map((desc) => {
					return { timestamp: desc.splitKey[desc.splitKey.length - 1] * 1, value: desc.value };
				});
				this.setState({ taoDescriptions: _.orderBy(_descriptions, ["timestamp"], ["desc"]) });
			}
		} catch (e) {}
	}

	async getTAOThoughts() {
		const { id } = this.props.params;
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-tao-thoughts?${encodeParams({ taoId: id })}`);
			if (response.thoughts) {
				this.setState({ thoughts: response.thoughts });
			}
		} catch (e) {}
	}

	sortBy(key) {
		this.setState({ sortBy: key });
	}

	render() {
		const { id } = this.props.params;
		const { taos, names, namesSumLogos, pastEventsRetrieved } = this.props;
		const { taoDescriptions, thoughts, sortBy } = this.state;

		let tao = null;
		if (taos) {
			tao = taos.find((_tao) => _tao.taoId === id);
		}
		if (!tao || !taoDescriptions || !thoughts || !names || !namesSumLogos || !pastEventsRetrieved) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}
		let _thoughtsHierarchy = [];
		if (thoughts.length) {
			const _thoughts = [];
			thoughts.forEach((thought) => {
				const _name = names.find((name) => name.nameId === thought.value.nameId);
				const _nameSumLogos = namesSumLogos.find((name) => name.nameId === thought.value.nameId);
				if (_name && _nameSumLogos) {
					_thoughts.push({
						name: _name.name,
						thoughtId: thought.splitKey[6],
						sumLogos: _nameSumLogos.sumLogos,
						...thought.value
					});
				}
			});
			const _sortedThoughts = _.orderBy(_thoughts, ["thoughtId"], ["asc"]);
			_thoughtsHierarchy = buildThoughtsHierarchy(_sortedThoughts);
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
				{taoDescriptions.length > 0 && (
					<Wrapper className="margin-bottom-20" dangerouslySetInnerHTML={{ __html: taoDescriptions[0].value }} />
				)}
				<AddThoughtContainer taoId={id} getTAOThoughts={this.getTAOThoughts} />
				<Hr />
				{_thoughtsHierarchy.length > 0 && (
					<Wrapper>
						<Wrapper className="margin-bottom-20">
							<DropdownButton id="sort-button" title="Sort By" size="sm">
								<Dropdown.Item as="button" onSelect={() => this.sortBy("logos")}>
									Logos
								</Dropdown.Item>
								<Dropdown.Item as="button" onSelect={() => this.sortBy("timestamp")}>
									Timestamp
								</Dropdown.Item>
							</DropdownButton>
						</Wrapper>
						<ListThoughts taoId={id} getTAOThoughts={this.getTAOThoughts} thoughts={_thoughtsHierarchy} sortBy={sortBy} />
					</Wrapper>
				)}
			</Wrapper>
		);
	}
}

export { ViewThoughts };
