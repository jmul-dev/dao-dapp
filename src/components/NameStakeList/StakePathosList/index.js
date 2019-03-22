import * as React from "react";
import { Wrapper, Title, Table } from "components/";
import { formatDate } from "utils/";

class StakePathosList extends React.Component {
	render() {
		const { nameStakePathos } = this.props;
		if (!nameStakePathos) {
			return null;
		}

		const columns = [
			{
				Header: "Stake ID",
				accessor: "stakeId"
			},
			{
				Header: "Quantity",
				accessor: "stakeQuantity",
				Cell: (props) => props.value.toNumber()
			},
			{
				Header: "Timestamp",
				accessor: "timestamp",
				Cell: (props) => formatDate(props.value.toNumber())
			}
		];

		return (
			<Wrapper className="margin-top-40">
				<Title>Pathos Staked</Title>
				<Table data={nameStakePathos} columns={columns} defaultPageSize={5} filterable={true} />
			</Wrapper>
		);
	}
}

export { StakePathosList };
