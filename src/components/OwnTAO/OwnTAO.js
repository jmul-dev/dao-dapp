import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";

class OwnTAO extends React.Component {
	render() {
		const { taos, taosNeedApproval } = this.props;
		if (!taos || !taosNeedApproval) {
			return null;
		}

		const stakedEthosTAOs = [],
			stakedPathosTAOs = [];

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

		const taosNeedApprovalColumns = [
			{
				Header: "ID",
				accessor: "childId",
				Cell: (props) => <Ahref to={`/tao/${props.value}`}>{props.value}</Ahref>
			},
			{
				Header: "Name",
				accessor: "childName"
			}
		];

		return (
			<Wrapper className="padding-40">
				<Wrapper className="margin-bottom-40">
					<Title>Advocated TAOs</Title>
					{taos.length ? (
						<Table data={taos} columns={columns} defaultPageSize={5} filterable={true} />
					) : (
						<Header>Currently, you have no TAO of which you are the Advocate</Header>
					)}
				</Wrapper>
				{taosNeedApproval.length > 0 && (
					<Wrapper className="margin-bottom-40">
						<Title>Child TAOs That Need Approvals</Title>
						<Table data={taosNeedApproval} columns={taosNeedApprovalColumns} defaultPageSize={5} filterable={true} />
					</Wrapper>
				)}
				<Wrapper className="margin-bottom-40">
					<Title>Staked Ethos TAOs</Title>
					{stakedEthosTAOs.length ? (
						<Table data={stakedEthosTAOs} columns={columns} defaultPageSize={5} filterable={true} />
					) : (
						<Header>Currently, you have no TAO that is staked with Ethos</Header>
					)}
				</Wrapper>
				<Wrapper className="margin-bottom-40">
					<Title>Staked Pathos TAOs</Title>
					{stakedPathosTAOs.length ? (
						<Table data={stakedPathosTAOs} columns={columns} defaultPageSize={5} filterable={true} />
					) : (
						<Header>Currently, you have no TAO that is staked with Pathos</Header>
					)}
				</Wrapper>
			</Wrapper>
		);
	}
}

export { OwnTAO };
