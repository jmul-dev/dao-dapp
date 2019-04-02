import * as React from "react";
import { Wrapper } from "components/";
import { ThoughtContainer } from "./Thought/";
import * as _ from "lodash";

class ListThoughts extends React.Component {
	render() {
		const { taoId, getTAOThoughts, thoughts, sortBy } = this.props;
		if (!thoughts.length) {
			return null;
		}

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
		const _sortedThoughts = _.orderBy(thoughts, _sortFields, ["desc", "desc"]);
		const ThoughtContent = _sortedThoughts.map((thought) => {
			return (
				<Wrapper key={thought.thoughtId} className="margin-bottom-20">
					<ThoughtContainer taoId={taoId} getTAOThoughts={getTAOThoughts} thoughtInfo={thought} />
					{thought.children.length > 0 && (
						<Wrapper className="padding-left-20">
							<ListThoughts
								taoId={taoId}
								getTAOThoughts={getTAOThoughts}
								thoughts={thought.children}
								sortBy={sortBy}
								isChildren={true}
							/>
						</Wrapper>
					)}
				</Wrapper>
			);
		});

		return <Wrapper>{ThoughtContent}</Wrapper>;
	}
}

export { ListThoughts };
