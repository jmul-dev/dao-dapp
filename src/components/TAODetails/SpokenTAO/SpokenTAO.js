import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";

class SpokenTAO extends React.Component {
	render() {
		const { id, taos, taoPositions, singlePageView } = this.props;
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
				<Title className={singlePageView ? "margin-top" : ""}>TAOs Where This TAO is The Speaker</Title>
				{spokenTAOs.length ? (
					<Table data={spokenTAOs} columns={columns} defaultPageSize={5} filterable={true} />
				) : (
					<Header>Currently, {selectedTAO.name} is not a Speaker of any TAO</Header>
				)}
			</Wrapper>
		);
	}
}

export { SpokenTAO };
