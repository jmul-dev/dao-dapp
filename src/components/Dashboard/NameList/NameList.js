import * as React from "react";
import { Wrapper, Title, StyledLink } from "./styledComponents";
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
				Cell: (props) => <StyledLink to={`/profile/${props.value}`}>{props.value}</StyledLink>
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
