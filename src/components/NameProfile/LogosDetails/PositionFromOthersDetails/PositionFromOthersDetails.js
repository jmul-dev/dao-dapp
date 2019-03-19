import * as React from "react";
import { Wrapper, Title, Ahref, Table } from "components/";

class PositionFromOthersDetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			positionLogosFrom: null
		};
	}

	componentDidMount() {
		const { positionLogosFrom } = this.props;
		this.setState({ positionLogosFrom });
	}

	componentDidUpdate(prevProps) {
		if (this.props.positionLogosFrom !== prevProps.positionLogosFrom) {
			this.setState({ positionLogosFrom: this.props.positionLogosFrom });
		}
	}

	render() {
		const { positionLogosFrom } = this.state;
		if (!positionLogosFrom || !positionLogosFrom.length) {
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
			},
			{
				Header: "Logos Positioned",
				accessor: "value",
				Cell: (props) => props.value.toNumber()
			}
		];

		return (
			<Wrapper className="margin-top-40">
				<Title>Logos Positioned From Others Details</Title>
				<Table data={positionLogosFrom} columns={columns} defaultPageSize={5} filterable={true} />
			</Wrapper>
		);
	}
}

export { PositionFromOthersDetails };
