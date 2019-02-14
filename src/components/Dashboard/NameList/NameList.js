import * as React from "react";
import { Title, Ahref } from "components/";
import { Wrapper } from "./styledComponents";
import ReactTable from "react-table";
import "./react-table.css";

class NameList extends React.Component {
	render() {
		const { names } = this.props;
		if (!names) {
			return null;
		}

		const columns = [
			{
				Header: "Name ID",
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
				<Title>List of Names</Title>
				<ReactTable data={names} columns={columns} defaultPageSize={5} />
			</Wrapper>
		);
	}
}

export { NameList };
