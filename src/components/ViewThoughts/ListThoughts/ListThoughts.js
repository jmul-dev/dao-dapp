import * as React from "react";
import { Wrapper } from "components/";
import { ThoughtContainer } from "./Thought/";
import * as _ from "lodash";

class ListThoughts extends React.Component {
	render() {
		const { names, namesSumLogos, pastEventsRetrieved, thoughts } = this.props;
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
					key: thought.splitKey[6],
					sumLogos: _nameSumLogos.sumLogos,
					...thought.value
				});
			}
		});

		const _sortedThoughts = _.orderBy(
			_thoughts,
			[
				(t) => {
					return t.sumLogos.toNumber();
				},
				"timestamp"
			],
			["desc", "desc"]
		);
		const ThoughtContent = _sortedThoughts.map((thought) => <ThoughtContainer key={thought.key} thoughtInfo={thought} />);
		return <Wrapper>{ThoughtContent}</Wrapper>;
	}
}

export { ListThoughts };
