import * as React from "react";
import { Wrapper, Title, Ahref, FieldContainer, FieldName, FieldValue, Table } from "components/";

class AncestryDetails extends React.Component {
	render() {
		const { ancestry, taos, id, singlePageView } = this.props;
		if (!ancestry || !taos) {
			return null;
		}

		const _tao = taos.find((tao) => tao.taoId === id);
		const childTAOs = [];
		_tao.children.forEach((childId) => {
			const _childTAO = taos.find((tao) => tao.taoId === childId);
			childTAOs.push(_childTAO);
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
				<Title className={singlePageView ? "margin-top" : ""}>Ancestry</Title>
				<FieldContainer>
					<FieldName className="small">Parent</FieldName>
					<FieldValue className="small">
						<Ahref to={ancestry.parentIsTAO ? `/tao/${ancestry.parentId}` : `/profile/${ancestry.parentId}`}>
							{ancestry.parentName} ({ancestry.parentId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				{ancestry.isNotApprovedChild ? (
					<FieldContainer>
						<FieldName className="small">Parent has approved as child TAO</FieldName>
						<FieldValue className="small">No</FieldValue>
					</FieldContainer>
				) : (
					[
						!ancestry.isChild && (
							<FieldContainer>
								<FieldName className="small">Parent has removed as child TAO</FieldName>
								<FieldValue className="small">Yes</FieldValue>
							</FieldContainer>
						)
					]
				)}
				<FieldContainer>
					<FieldName className="small">Min. Required Logos to Create a Child TAO</FieldName>
					<FieldValue className="small">{ancestry.childMinLogos.toNumber()}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName className="small">Total Child TAOs</FieldName>
					<FieldValue className="small">{ancestry.totalChildren.toNumber()}</FieldValue>
				</FieldContainer>
				{childTAOs.length > 0 && (
					<Wrapper>
						<Title className="margin-top">Child TAOs</Title>
						<Table data={childTAOs} columns={columns} defaultPageSize={5} filterable={true} />
					</Wrapper>
				)}
			</Wrapper>
		);
	}
}

export { AncestryDetails };
