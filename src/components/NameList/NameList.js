import * as React from "react";
import { Wrapper, Title, Ahref, Table } from "components/";

class NameList extends React.Component {
	render() {
		const { names } = this.props;
		if (!names) {
			return null;
		}

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
			<Wrapper className="padding-40">
				<Title>View Names</Title>
				<Table data={names} columns={columns} defaultPageSize={5} filterable={true} />
			</Wrapper>
		);
	}
}

export { NameList };
