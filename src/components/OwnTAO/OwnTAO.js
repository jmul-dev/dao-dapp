import * as React from "react";
import { Wrapper, Title, Header, Ahref, Table, LeftContainer, RightContainer } from "components/";
import { Tab, Nav } from "react-bootstrap";
import "./style.css";

class OwnTAO extends React.Component {
	render() {
		const { pastEventsRetrieved, nameId, taoPositions, taosNeedApproval, stakeEthos, stakePathos, taos } = this.props;
		if (!pastEventsRetrieved || !nameId || !taoPositions || !taosNeedApproval || !stakeEthos || !stakePathos || !taos) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		const advocatedTAOs = [];
		const advocatedTAOIds = taoPositions.filter((tao) => tao.advocateId === nameId).map((tao) => tao.taoId);
		advocatedTAOIds.forEach((taoId) => {
			const tao = taos.find((tao) => tao.taoId === taoId);
			advocatedTAOs.push(tao);
		});

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

		const listenedTAOs = [];
		const listenedTAOIds = taoPositions.filter((tao) => tao.listenerId === nameId).map((tao) => tao.taoId);
		listenedTAOIds.forEach((taoId) => {
			const tao = taos.find((tao) => tao.taoId === taoId);
			listenedTAOs.push(tao);
		});

		const spokenTAOs = [];
		const spokenTAOIds = taoPositions.filter((tao) => tao.speakerId === nameId).map((tao) => tao.taoId);
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
							<Nav.Item>
								<Nav.Link eventKey="listener">Listened TAOs</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="speaker">Spoken TAOs</Nav.Link>
							</Nav.Item>
						</Nav>
					</LeftContainer>
					<RightContainer className="width-80">
						<Tab.Content>
							<Tab.Pane eventKey="advocated">
								<Title>TAOs Where You are The Advocate</Title>
								{advocatedTAOs.length ? (
									<Table data={advocatedTAOs} columns={columns} defaultPageSize={5} filterable={true} />
								) : (
									<Header>Currently, you have no TAO of which you are the Advocate</Header>
								)}
							</Tab.Pane>
							<Tab.Pane eventKey="need-approval">
								<Title>Child TAOs That Need Approvals</Title>
								{taosNeedApproval.length ? (
									<Table data={taosNeedApproval} columns={columns} defaultPageSize={5} filterable={true} />
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
							<Tab.Pane eventKey="listener">
								<Title>TAOs Where You are The Listener</Title>
								{listenedTAOs.length ? (
									<Table data={listenedTAOs} columns={columns} defaultPageSize={5} filterable={true} />
								) : (
									<Header>Currently, you have no TAO of which you are the Listener</Header>
								)}
							</Tab.Pane>
							<Tab.Pane eventKey="speaker">
								<Title>TAOs Where You are The Speaker</Title>
								{spokenTAOs.length ? (
									<Table data={spokenTAOs} columns={columns} defaultPageSize={5} filterable={true} />
								) : (
									<Header>Currently, you have no TAO of which you are the Speaker</Header>
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
