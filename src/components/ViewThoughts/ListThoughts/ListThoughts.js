import * as React from "react";
import { Wrapper } from "components/";
import { ThoughtContainer } from "./Thought/";
import { DropdownButton, Dropdown } from "react-bootstrap";
import * as _ from "lodash";

class ListThoughts extends React.Component {
	constructor(props) {
		super(props);
		this.state = { sortBy: "logos" };
		this.sortBy = this.sortBy.bind(this);
	}

	sortBy(key) {
		this.setState({ sortBy: key });
	}

	render() {
		const { names, namesSumLogos, pastEventsRetrieved, taoId, getTAOThoughts, thoughts } = this.props;
		const { sortBy } = this.state;
		if (!names || !namesSumLogos || !pastEventsRetrieved) {
			return <Wrapper className="small">Loading thoughts...</Wrapper>;
		}
		if (!thoughts.length) {
			return null;
		}

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

		const _sortFields =
			sortBy === "logos"
				? [
						(t) => {
							return t.sumLogos.toNumber();
						},
						"timestamp"
				  ]
				: [
						"timestamp",
						(t) => {
							return t.sumLogos.toNumber();
						}
				  ];

		const _sortedThoughts = _.orderBy(_thoughts, _sortFields, ["desc", "desc"]);
		const ThoughtContent = _sortedThoughts.map((thought) => (
			<ThoughtContainer key={thought.thoughtId} taoId={taoId} getTAOThoughts={getTAOThoughts} thoughtInfo={thought} />
		));
		return (
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
				{ThoughtContent}
			</Wrapper>
		);
	}
}

export { ListThoughts };
