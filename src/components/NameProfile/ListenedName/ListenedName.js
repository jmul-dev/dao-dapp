import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";

class ListenedName extends React.Component {
	render() {
		const { id, names, namePositions, singlePageView } = this.props;
		if (!names || !namePositions) {
			return null;
		}

		const selectedName = names.find((name) => name.nameId === id);
		if (!selectedName) {
			return null;
		}

		const listenedNames = [];
		const listenedNameIds = namePositions.filter((name) => name.listenerId === id).map((name) => name.nameId);
		listenedNameIds.forEach((nameId) => {
			const name = names.find((name) => name.nameId === nameId);
			listenedNames.push(name);
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
				<Title className={singlePageView ? "margin-top" : ""}>Names Where You are The Listener</Title>
				{listenedNames.length ? (
					<Table data={listenedNames} columns={columns} defaultPageSize={5} filterable={true} />
				) : (
					<Header>Currently, {selectedName.name} is not a Listener of any Name</Header>
				)}
			</Wrapper>
		);
	}
}

export { ListenedName };
