import * as React from "react";
import { Wrapper } from "components/";
import { ThoughtContainer } from "./Thought/";
import * as _ from "lodash";

class ListThoughts extends React.Component {
	render() {
		const { names, thoughts } = this.props;
		if (!names) {
			return <Wrapper className="padding-40">Loading thoughts...</Wrapper>;
		}
		if (!thoughts.length) {
			return null;
		}

		const _thoughts = [];
		thoughts.forEach((thought) => {
			const _name = names.find((name) => name.nameId === thought.value.nameId);
			if (_name) {
				_thoughts.push({
					name: _name.name,
					key: thought.splitKey[6],
					...thought.value
				});
			}
		});

		const _sortedThoughts = _.orderBy(_thoughts, ["timestamp", "name"], ["desc", "asc"]);
		const ThoughtContent = _sortedThoughts.map((thought) => <ThoughtContainer key={thought.key} thoughtInfo={thought} />);
		return <Wrapper>{ThoughtContent}</Wrapper>;
	}
}

export { ListThoughts };
