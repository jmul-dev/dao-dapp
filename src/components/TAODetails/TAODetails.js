import * as React from "react";
import { Wrapper, Ahref, MediumEditor, LeftContainer, RightContainer } from "components/";
import { Tab, Nav } from "react-bootstrap";
import { Button } from "./styledComponents";
import { TAONameContainer } from "./TAOName/";
import { PositionDetailsContainer } from "./PositionDetails/";
import { ListenedTAOContainer } from "./ListenedTAO/";
import { SpokenTAOContainer } from "./SpokenTAO/";
import { AncestryDetailsContainer } from "./AncestryDetails/";
import { Financials } from "./Financials/";
import { get, encodeParams } from "utils/";

const promisify = require("tiny-promisify");

class TAODetails extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			tabKey: "tao-info",
			taoInfo: null,
			taoDescription: null,
			position: null,
			ancestry: null,
			ethosCapStatus: null,
			ethosCapAmount: null,
			status: null,
			poolTotalLogosWithdrawn: null,
			ethosBalance: null,
			pathosBalance: null,
			nameEthosStaked: null,
			namePathosStaked: null,
			nameLogosWithdrawn: null,
			dataPopulated: false
		};
		this.initialState = this.state;
		this.getTAOPool = this.getTAOPool.bind(this);
		this.getTAOPosition = this.getTAOPosition.bind(this);
	}

	async componentDidMount() {
		this._isMounted = true;
		await this.getData();
	}

	async componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getData();
		} else if (this.props.stakedTAOs !== prevProps.stakedTAOs && this.props.params.id) {
			if (this.props.stakedTAOs.find((tao) => tao.taoId === this.props.params.id)) {
				await this.getTAOPool();
			}
		} else if (this.props.taoPositions !== prevProps.taoPositions) {
			await this.getTAOPosition();
		}
	}

	async getData() {
		await this.getTAOInfo();
		await this.getTAODescription();
		await this.getTAOPosition();
		await this.getTAOAncestry();
		await this.getTAOPool();
		if (this._isMounted) {
			this.setState({ dataPopulated: true });
		}
	}

	async getTAOInfo() {
		const { id } = this.props.params;
		const { taoFactory } = this.props;
		if (!taoFactory || !id) {
			return;
		}

		const _taoInfo = await promisify(taoFactory.getTAO)(id);
		const taoInfo = {
			name: _taoInfo[0]
		};
		if (this._isMounted) {
			this.setState({ taoInfo });
		}
	}

	async getTAODescription() {
		const { id } = this.props.params;
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-tao-description?${encodeParams({ taoId: id })}`);
			if (response.description && this._isMounted) {
				this.setState({ taoDescription: response.description });
			}
		} catch (e) {}
	}

	async getTAOPosition() {
		const { id } = this.props.params;
		const { taoPositions, names, nameTAOPosition, aoLibrary } = this.props;
		if (!taoPositions || !names || !nameTAOPosition || !aoLibrary || !id) {
			return;
		}

		const _position = await promisify(nameTAOPosition.getPositionById)(id);
		const position = {
			advocate: {
				name: _position[0],
				id: _position[1],
				isTAO: false
			},
			listener: {
				name: _position[2],
				id: _position[3],
				isTAO: false
			},
			speaker: {
				name: _position[4],
				id: _position[5],
				isTAO: false
			}
		};
		position.listener.isTAO = await promisify(aoLibrary.isTAO)(position.listener.id);
		position.speaker.isTAO = await promisify(aoLibrary.isTAO)(position.speaker.id);

		if (this._isMounted) {
			this.setState({ position });
		}
	}

	async getTAOAncestry() {
		const { id } = this.props.params;
		const { taoAncestry, nameTAOLookup } = this.props;
		if (!taoAncestry || !nameTAOLookup || !id) {
			return;
		}

		const _ancestry = await promisify(taoAncestry.getAncestryById)(id);
		const ancestry = {
			parentId: _ancestry[0],
			parentIsTAO: false,
			parentName: "",
			isChild: true,
			isNotApprovedChild: false,
			childMinLogos: _ancestry[1],
			totalChildren: _ancestry[2]
		};

		const _taoInfo = await promisify(nameTAOLookup.getById)(ancestry.parentId);
		ancestry.parentIsTAO = _taoInfo[2].eq(0);
		ancestry.parentName = _taoInfo[0];
		if (ancestry.parentIsTAO) {
			ancestry.isChild = await promisify(taoAncestry.isChild)(ancestry.parentId, id);
			ancestry.isNotApprovedChild = await promisify(taoAncestry.isNotApprovedChild)(ancestry.parentId, id);
		}

		if (this._isMounted) {
			this.setState({ ancestry });
		}
	}

	async getTAOPool() {
		const { id } = this.props.params;
		const { taoPool, ethos, pathos, nameId } = this.props;
		if (!taoPool || !ethos || !pathos || !nameId || !id) {
			return;
		}
		const _pool = await promisify(taoPool.pools)(id);
		const poolTotalLogosWithdrawn = await promisify(taoPool.poolTotalLogosWithdrawn)(id);
		const ethosBalance = await promisify(ethos.balanceOf)(id);
		const pathosBalance = await promisify(pathos.balanceOf)(id);
		const nameEthosStaked = await promisify(taoPool.namePoolEthosStaked)(nameId, id);
		const namePathosStaked = await promisify(taoPool.namePoolPathosStaked)(nameId, id);
		const nameLogosWithdrawn = await promisify(taoPool.namePoolLogosWithdrawn)(nameId, id);

		if (this._isMounted) {
			this.setState({
				ethosCapStatus: _pool[1],
				ethosCapAmount: _pool[2],
				status: _pool[3],
				poolTotalLogosWithdrawn,
				ethosBalance,
				pathosBalance,
				nameEthosStaked,
				namePathosStaked,
				nameLogosWithdrawn
			});
		}
	}

	render() {
		const { id } = this.props.params;
		const { pastEventsRetrieved, taosNeedApproval, singlePageView } = this.props;
		const {
			tabKey,
			taoInfo,
			taoDescription,
			position,
			ancestry,
			ethosCapStatus,
			ethosCapAmount,
			status,
			poolTotalLogosWithdrawn,
			ethosBalance,
			pathosBalance,
			nameEthosStaked,
			namePathosStaked,
			nameLogosWithdrawn,
			dataPopulated
		} = this.state;
		if (!pastEventsRetrieved || !taosNeedApproval || !dataPopulated || typeof singlePageView === "undefined") {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		const needApproval = taosNeedApproval.find((tao) => tao.taoId === id) ? true : false;

		return (
			<Wrapper className="padding-40">
				<Wrapper className="margin-bottom-40">
					<LeftContainer>
						<Ahref className="small" to="/">
							Back to Dashboard
						</Ahref>
					</LeftContainer>
					<RightContainer className="right">
						<div className="btn-group btn-group-sm" role="group">
							<Button
								type="button"
								className={`btn btn-default ${!singlePageView ? "selected" : ""}`}
								onClick={this.props.toggleView}
							>
								Tab View
							</Button>
							<Button
								type="button"
								className={`btn btn-default ${singlePageView ? "selected" : ""}`}
								onClick={this.props.toggleView}
							>
								Single Page View
							</Button>
						</div>
					</RightContainer>
				</Wrapper>
				{singlePageView ? (
					<Wrapper>
						<TAONameContainer
							id={id}
							name={taoInfo.name}
							singlePageView={singlePageView}
							needApproval={needApproval}
							parentId={ancestry.parentId}
						/>
						<MediumEditor text={taoDescription} />
						<LeftContainer>
							<PositionDetailsContainer
								id={id}
								position={position}
								getTAOPosition={this.getTAOPosition}
								singlePageView={singlePageView}
							/>
							<ListenedTAOContainer id={id} singlePageView={singlePageView} />
							<SpokenTAOContainer id={id} singlePageView={singlePageView} />
							<AncestryDetailsContainer id={id} ancestry={ancestry} singlePageView={singlePageView} />
						</LeftContainer>
						<RightContainer>
							<Financials
								id={id}
								ethosCapStatus={ethosCapStatus}
								ethosCapAmount={ethosCapAmount}
								status={status}
								poolTotalLogosWithdrawn={poolTotalLogosWithdrawn}
								ethosBalance={ethosBalance}
								pathosBalance={pathosBalance}
								nameEthosStaked={nameEthosStaked}
								namePathosStaked={namePathosStaked}
								nameLogosWithdrawn={nameLogosWithdrawn}
								getTAOPool={this.getTAOPool}
								singlePageView={singlePageView}
							/>
						</RightContainer>
					</Wrapper>
				) : (
					<Tab.Container id="tao-details" defaultActiveKey="tao-info" onSelect={(key) => this.setState({ tabKey: key })}>
						<LeftContainer className="width-20">
							<Nav className="flex-column">
								<Nav.Item>
									<Nav.Link eventKey="tao-info">TAO Info</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="position">Position</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="listened-tao">Listened TAOs</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="spoken-tao">Spoken TAOs</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="ancestry">Ancestry</Nav.Link>
								</Nav.Item>
								<Nav.Item>
									<Nav.Link eventKey="financials">TAO Financials</Nav.Link>
								</Nav.Item>
							</Nav>
						</LeftContainer>
						<RightContainer className="width-80">
							<Tab.Content>
								<Tab.Pane eventKey="tao-info">
									<TAONameContainer
										id={id}
										name={taoInfo.name}
										singlePageView={singlePageView}
										needApproval={needApproval}
										parentId={ancestry.parentId}
									/>
									<MediumEditor text={taoDescription} />
								</Tab.Pane>
								<Tab.Pane eventKey="position">
									<PositionDetailsContainer
										id={id}
										position={position}
										getTAOPosition={this.getTAOPosition}
										singlePageView={singlePageView}
									/>
								</Tab.Pane>
								<Tab.Pane eventKey="listened-tao">
									<ListenedTAOContainer id={id} singlePageView={singlePageView} />
								</Tab.Pane>
								<Tab.Pane eventKey="spoken-tao">
									<SpokenTAOContainer id={id} singlePageView={singlePageView} />
								</Tab.Pane>
								<Tab.Pane eventKey="ancestry">
									<AncestryDetailsContainer id={id} ancestry={ancestry} singlePageView={singlePageView} />
								</Tab.Pane>
								<Tab.Pane eventKey="financials">
									<Financials
										id={id}
										populateBar={tabKey === "financials"}
										ethosCapStatus={ethosCapStatus}
										ethosCapAmount={ethosCapAmount}
										status={status}
										poolTotalLogosWithdrawn={poolTotalLogosWithdrawn}
										ethosBalance={ethosBalance}
										pathosBalance={pathosBalance}
										nameEthosStaked={nameEthosStaked}
										namePathosStaked={namePathosStaked}
										nameLogosWithdrawn={nameLogosWithdrawn}
										getTAOPool={this.getTAOPool}
										singlePageView={singlePageView}
									/>
								</Tab.Pane>
							</Tab.Content>
						</RightContainer>
					</Tab.Container>
				)}
			</Wrapper>
		);
	}
}

export { TAODetails };
