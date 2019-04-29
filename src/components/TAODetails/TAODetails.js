import * as React from "react";
import { Wrapper, Ahref, LeftContainer, RightContainer, NavLink } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { TogglePageViewContainer } from "widgets/TogglePageView/";
import { Tab, Nav } from "react-bootstrap";
import { TAONameContainer } from "./TAOName/";
import { PositionDetailsContainer } from "./PositionDetails/";
import { ListenedTAOContainer } from "./ListenedTAO/";
import { AdvocateChallengeContainer } from "./AdvocateChallenge/";
import { SpokenTAOContainer } from "./SpokenTAO/";
import { AncestryDetailsContainer } from "./AncestryDetails/";
import { Financials } from "./Financials/";
import { Resources } from "./Resources/";
import { getTAODescriptions as graphqlGetTAODescriptions } from "utils/graphql";
import * as _ from "lodash";

const promisify = require("tiny-promisify");

class TAODetails extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			tabKey: "tao-info",
			taoInfo: null,
			taoDescriptions: null,
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
			isAdvocate: null,
			resources: null,
			isAdvocateOfParent: null,
			dataPopulated: false
		};
		this.initialState = this.state;
		this.getTAOPool = this.getTAOPool.bind(this);
		this.getTAOPosition = this.getTAOPosition.bind(this);
		this.getTAODescriptions = this.getTAODescriptions.bind(this);
		this.getTAOResources = this.getTAOResources.bind(this);
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
			if (this._isMounted) {
				this.setState(this.initialState);
			}
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
		await this.getTAODescriptions();
		await this.getTAOPosition();
		await this.getTAOAncestry();
		await this.getTAOPool();
		await this.getTAOResources();
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

	async getTAODescriptions() {
		const { id } = this.props.params;
		if (!id) {
			return;
		}
		try {
			const response = await graphqlGetTAODescriptions(id);
			if (response.data.taoDescriptions) {
				const _descriptions = response.data.taoDescriptions.map((desc) => {
					return { timestamp: desc.splitKey[desc.splitKey.length - 1] * 1, value: desc.description };
				});
				this.setState({ taoDescriptions: _.orderBy(_descriptions, ["timestamp"], ["desc"]) });
			}
		} catch (e) {}
	}

	async getTAOPosition() {
		const { id } = this.props.params;
		const { taoPositions, names, nameTAOPosition, aoLibrary, nameId, accounts } = this.props;
		if (!taoPositions || !names || !nameTAOPosition || !aoLibrary || !id || !nameId || !accounts) {
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

		const isAdvocate = _position[1] === nameId;
		const isAdvocateOfParent = await promisify(nameTAOPosition.senderIsAdvocateOfParent)(accounts[0], id);
		if (this._isMounted) {
			this.setState({ position, isAdvocate, isAdvocateOfParent });
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

	async getTAOResources() {
		const { id } = this.props.params;
		const { nameTAOVault } = this.props;
		if (!nameTAOVault || !id) {
			return;
		}

		const ethBalance = await promisify(nameTAOVault.ethBalanceOf)(id);
		const aoBalance = await promisify(nameTAOVault.AOBalanceOf)(id);
		const primordialAOBalance = await promisify(nameTAOVault.primordialAOBalanceOf)(id);

		if (this._isMounted) {
			this.setState({
				resources: {
					ethBalance,
					aoBalance,
					primordialAOBalance
				}
			});
		}
	}

	render() {
		const { id } = this.props.params;
		const { pastEventsRetrieved, taosNeedApproval, singlePageView } = this.props;
		const {
			tabKey,
			taoInfo,
			taoDescriptions,
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
			isAdvocate,
			isAdvocateOfParent,
			resources,
			dataPopulated
		} = this.state;
		if (!pastEventsRetrieved || !taosNeedApproval || !dataPopulated || typeof singlePageView === "undefined") {
			return <ProgressLoaderContainer />;
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
						<TogglePageViewContainer />
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
							taoDescriptions={taoDescriptions}
							getTAODescriptions={this.getTAODescriptions}
							isAdvocate={isAdvocate}
							isAdvocateOfParent={isAdvocateOfParent}
						/>
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
							<AdvocateChallengeContainer id={id} singlePageView={singlePageView} />
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
							{isAdvocate && (
								<Resources
									id={id}
									resources={resources}
									getTAOResources={this.getTAOResources}
									singlePageView={singlePageView}
								/>
							)}
						</RightContainer>
					</Wrapper>
				) : (
					<Tab.Container
						id="tao-details"
						defaultActiveKey="tao-info"
						onSelect={(key) => this._isMounted && this.setState({ tabKey: key })}
					>
						<LeftContainer className="width-20">
							<Nav className="flex-column">
								<Nav.Item>
									<NavLink eventKey="tao-info">TAO Info</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="position">Position</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="listened-tao">Listened TAOs</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="spoken-tao">Spoken TAOs</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="ancestry">Ancestry</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="advocate-challenge">Advocate Challenges</NavLink>
								</Nav.Item>
								<Nav.Item>
									<NavLink eventKey="financials">TAO Financials</NavLink>
								</Nav.Item>
								{isAdvocate && (
									<Nav.Item>
										<NavLink eventKey="resources">TAO Resources</NavLink>
									</Nav.Item>
								)}
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
										taoDescriptions={taoDescriptions}
										getTAODescriptions={this.getTAODescriptions}
										isAdvocate={isAdvocate}
										isAdvocateOfParent={isAdvocateOfParent}
									/>
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
								<Tab.Pane eventKey="advocate-challenge">
									<AdvocateChallengeContainer id={id} singlePageView={singlePageView} />
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
								{isAdvocate && (
									<Tab.Pane eventKey="resources">
										<Resources
											id={id}
											resources={resources}
											getTAOResources={this.getTAOResources}
											singlePageView={singlePageView}
										/>
									</Tab.Pane>
								)}
							</Tab.Content>
						</RightContainer>
					</Tab.Container>
				)}
			</Wrapper>
		);
	}
}

export { TAODetails };
