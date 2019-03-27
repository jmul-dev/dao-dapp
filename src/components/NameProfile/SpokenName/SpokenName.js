import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";

class SpokenName extends React.Component {
	render() {
		const { id, names, namePositions, singlePageView } = this.props;
		if (!names || !namePositions) {
			return null;
		}

		const selectedName = names.find((name) => name.nameId === id);
		if (!selectedName) {
			return null;
		}

		const spokenNames = [];
		const spokenNameIds = namePositions.filter((name) => name.speakerId === id).map((name) => name.nameId);
		spokenNameIds.forEach((nameId) => {
			const name = names.find((name) => name.nameId === nameId);
			spokenNames.push(name);
		});

		const columns = [
			{
				Header: "ID",
				accessor: "nameId",
				Cell: (props) => <Ahref to={`/profile/${props.value}`}>{props.value}</Ahref>
			},
			{
				Header: "Name",
				accessor: "name"
			}
		];

		return (
			<Wrapper>
				<Title className={singlePageView ? "margin-top" : ""}>Names Where You are The Speaker</Title>
				{spokenNames.length ? (
					<Table data={spokenNames} columns={columns} defaultPageSize={5} filterable={true} />
				) : (
					<Header>Currently, {selectedName.name} is not a Speaker of any Name</Header>
				)}
			</Wrapper>
		);
	}
}

export { SpokenName };
