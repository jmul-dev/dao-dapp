import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";
import "./style.css";

class ListenedTAO extends React.Component {
	render() {
		const { id, taos, taoPositions } = this.props;
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
				<Title className="margin-top">Listened TAOs</Title>
				{listenedTAOs.length ? (
					<Table data={listenedTAOs} columns={columns} defaultPageSize={5} filterable={true} />
				) : (
					<Header>Currently, there is no TAO of which {selectedTAO.name} is the Listener</Header>
				)}
			</Wrapper>
		);
	}
}

export { ListenedTAO };
