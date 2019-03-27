import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";

class ListenedTAO extends React.Component {
	render() {
		const { id, taos, taoPositions, singlePageView } = this.props;
		if (!taos || !taoPositions) {
			return null;
		}

		const selectedTAO = taos.find((tao) => tao.taoId === id);
		if (!selectedTAO) {
			return null;
		}

		const listenedTAOs = [];
		const listenedTAOIds = taoPositions.filter((tao) => tao.listenerId === id).map((tao) => tao.taoId);
		listenedTAOIds.forEach((taoId) => {
			const tao = taos.find((tao) => tao.taoId === taoId);
			listenedTAOs.push(tao);
		});

		const columns = [
			{
				Header: "ID",
				accessor: "taoId",
				Cell: (props) => <Ahref to={`/tao/${props.value}`}>{props.value}</Ahref>
			},
			{
				Header: "Name",
				accessor: "name"
			}
		];

		return (
			<Wrapper>
				<Title className={singlePageView ? "margin-top" : ""}>TAOs Where This TAO is The Listener</Title>
				{listenedTAOs.length ? (
					<Table data={listenedTAOs} columns={columns} defaultPageSize={5} filterable={true} />
				) : (
					<Header>Currently, {selectedTAO.name} is not a Listener of any TAO</Header>
				)}
			</Wrapper>
		);
	}
}

export { ListenedTAO };
