import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table, LeftContainer, RightContainer } from "components/";
import { Tab, Nav } from "react-bootstrap";
import "./style.css";

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
				<Tab.Container id="taos-table" defaultActiveKey="advocated">
					<LeftContainer className="width-20">
						<Nav className="flex-column">
							<Nav.Item>
								<Nav.Link eventKey="advocated">Advocated TAOs</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="need-approval">TAOs Need Approval</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="staked-ethos">Staked Ethos TAOs</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="staked-pathos">Staked Pathos TAOs</Nav.Link>
							</Nav.Item>
						</Nav>
					</LeftContainer>
					<RightContainer className="width-80">
						<Tab.Content>
							<Tab.Pane eventKey="advocated">
								<Title>Advocated TAOs</Title>
								{ownTAOs.length ? (
									<Table data={ownTAOs} columns={columns} defaultPageSize={5} filterable={true} />
								) : (
									<Header>Currently, you have no TAO of which you are the Advocate</Header>
								)}
							</Tab.Pane>
							<Tab.Pane eventKey="need-approval">
								<Title>Child TAOs That Need Approvals</Title>
								{taosNeedApproval.length ? (
									<Table
										data={taosNeedApproval}
										columns={taosNeedApprovalColumns}
										defaultPageSize={5}
										filterable={true}
									/>
								) : (
									<Header>Currently, there is no child TAO that needs your approval</Header>
								)}
							</Tab.Pane>
							<Tab.Pane eventKey="staked-ethos">
								<Title>Staked Ethos TAOs</Title>
								{stakedEthosTAOs.length ? (
									<Table data={stakedEthosTAOs} columns={columns} defaultPageSize={5} filterable={true} />
								) : (
									<Header>Currently, you have no TAO that is staked with Ethos</Header>
								)}
							</Tab.Pane>
							<Tab.Pane eventKey="staked-pathos">
								<Title>Staked Pathos TAOs</Title>
								{stakedPathosTAOs.length ? (
									<Table data={stakedPathosTAOs} columns={columns} defaultPageSize={5} filterable={true} />
								) : (
									<Header>Currently, you have no TAO that is staked with Pathos</Header>
								)}
							</Tab.Pane>
						</Tab.Content>
					</RightContainer>
				</Tab.Container>
			</Wrapper>
		);
	}
}

export { OwnTAO };
