import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";
import { formatDate } from "utils/";
import * as _ from "lodash";

class AdvocateChallenge extends React.Component {
	render() {
		const { id, names, challengeTAOAdvocates, singlePageView } = this.props;
		if (!names || !challengeTAOAdvocates) {
			return null;
		}

		let activeChallenges = [];
		if (challengeTAOAdvocates && challengeTAOAdvocates.length) {
			const currentTimestamp = Math.round(new Date().getTime() / 1000);
			activeChallenges = _.orderBy(
				challengeTAOAdvocates.filter((challenge) => challenge.taoId === id && challenge.lockedUntilTimestamp.gt(currentTimestamp)),
				[
					(c) => {
						return c.lockedUntilTimestamp.toNumber();
					}
				],
				["desc"]
			);
		}

		const columns = [
			{
				Header: "Date",
				accessor: "createdTimestamp",
				Cell: (props) => formatDate(props.value.toNumber())
			},
			{
				Header: "Challenge ID",
				accessor: "challengeId",
				Cell: (props) => <Ahref to={`/view-challenged-tao/${props.value}`}>{props.value}</Ahref>
			},
			{
				Header: "Challenger",
				accessor: "challengerAdvocateId",
				Cell: (props) => {
					const name = names.find((_name) => _name.nameId === props.value);
					return name.name;
				}
			}
		];

		return (
			<Wrapper>
				<Title className={singlePageView ? "margin-top" : ""}>Advocate Challenges</Title>
				{activeChallenges.length ? (
					<Table data={activeChallenges} columns={columns} defaultPageSize={5} filterable={true} />
				) : (
					<Header>Currently, there is no active challenges</Header>
				)}
			</Wrapper>
		);
	}
}

export { AdvocateChallenge };
