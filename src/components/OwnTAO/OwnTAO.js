import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table } from "components/";

class OwnTAO extends React.Component {
	render() {
		const { ownTAOs, taosNeedApproval, stakeEthos, stakePathos, taos } = this.props;
		if (!ownTAOs || !taosNeedApproval || !stakeEthos || !stakePathos || !taos) {
			return null;
		}

		const stakedEthosTAOIds = stakeEthos.map((tao) => tao.taoId).filter((value, index, self) => self.indexOf(value) === index);
		const stakedEthosTAOs = [];
		stakedEthosTAOIds.forEach((taoId) => {
			const tao = taos.find((tao) => tao.taoId === taoId);
			stakedEthosTAOs.push(tao);
		});

		const stakedPathosTAOIds = stakePathos.map((tao) => tao.taoId).filter((value, index, self) => self.indexOf(value) === index);
		const stakedPathosTAOs = [];
		stakedPathosTAOIds.forEach((taoId) => {
			const tao = taos.find((tao) => tao.taoId === taoId);
			stakedPathosTAOs.push(tao);
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
					{ownTAOs.length ? (
						<Table data={ownTAOs} columns={columns} defaultPageSize={5} filterable={true} />
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
