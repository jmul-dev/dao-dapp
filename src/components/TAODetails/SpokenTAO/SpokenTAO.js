import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";
import "./style.css";

class SpokenTAO extends React.Component {
	render() {
		const { id, taos, taoPositions } = this.props;
		if (!taos || !taoPositions) {
			return null;
		}

		const selectedTAO = taos.find((tao) => tao.taoId === id);
		if (!selectedTAO) {
			return null;
		}

		const spokenTAOs = [];
		const spokenTAOIds = taoPositions.filter((tao) => tao.speakerId === id).map((tao) => tao.taoId);
		spokenTAOIds.forEach((taoId) => {
			const tao = taos.find((tao) => tao.taoId === taoId);
			spokenTAOs.push(tao);
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
				<Title className="margin-top">Spoken TAOs</Title>
				{spokenTAOs.length ? (
					<Table data={spokenTAOs} columns={columns} defaultPageSize={5} filterable={true} />
				) : (
					<Header>Currently, there is no TAO of which {selectedTAO.name} is the Speaker</Header>
				)}
			</Wrapper>
		);
	}
}

export { SpokenTAO };
