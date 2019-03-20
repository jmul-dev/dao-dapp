import * as React from "react";
import { Wrapper, Ahref, MediumEditor } from "components/";
import { LeftContainer, RightContainer } from "./styledComponents";
import { TAOName } from "./TAOName/";
import { PositionDetails } from "./PositionDetails/";
import { AncestryDetails } from "./AncestryDetails/";
import { Financials } from "./Financials/";
import { get, encodeParams } from "utils/";

const promisify = require("tiny-promisify");

class TAODetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			taoDescription: null,
			position: null,
			ancestry: null,
			ethosCapStatus: null,
			ethosCapAmount: null,
			status: null,
			poolTotalLot: null,
			poolTotalLogosWithdrawn: null,
			ethosBalance: null,
			pathosBalance: null
		};
		this.initialState = this.state;
		this.getTAOPool = this.getTAOPool.bind(this);
	}

	async componentDidMount() {
		await this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getData();
		} else if (this.props.stakedTAOs !== prevProps.stakedTAOs && this.props.params.id) {
			if (this.props.stakedTAOs.find((tao) => tao.taoId === this.props.params.id)) {
				await this.getTAOPool();
			}
		}
	}

	async getData() {
		await this.getTAOInfo();
		await this.getTAODescription();
		await this.getTAOPosition();
		await this.getTAOAncestry();
		await this.getTAOPool();
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
		this.setState({ taoInfo });
	}

	async getTAODescription() {
		const { id } = this.props.params;
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-tao-description?${encodeParams({ taoId: id })}`);
			if (response.description) {
				this.setState({ taoDescription: response.description });
			}
		} catch (e) {}
	}

	async getTAOPosition() {
		const { id } = this.props.params;
		const { nameTAOPosition, aoLibrary } = this.props;
		if (!nameTAOPosition || !aoLibrary || !id) {
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
		position.advocate.isTAO = await promisify(aoLibrary.isTAO)(position.advocate.id);
		position.listener.isTAO = await promisify(aoLibrary.isTAO)(position.listener.id);
		position.speaker.isTAO = await promisify(aoLibrary.isTAO)(position.speaker.id);
		this.setState({ position });
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
		this.setState({ ancestry });
	}

	async getTAOPool() {
		const { id } = this.props.params;
		const { taoPool, ethos, pathos } = this.props;
		if (!taoPool || !ethos || !pathos || !id) {
			return;
		}
		const _pool = await promisify(taoPool.pools)(id);
		const poolTotalLot = await promisify(taoPool.poolTotalLot)(id);
		const poolTotalLogosWithdrawn = await promisify(taoPool.poolTotalLogosWithdrawn)(id);
		const ethosBalance = await promisify(ethos.balanceOf)(id);
		const pathosBalance = await promisify(pathos.balanceOf)(id);

		this.setState({
			ethosCapStatus: _pool[1],
			ethosCapAmount: _pool[2],
			status: _pool[3],
			poolTotalLot,
			poolTotalLogosWithdrawn,
			ethosBalance,
			pathosBalance
		});
	}

	render() {
		const { id } = this.props.params;
		const {
			taoInfo,
			taoDescription,
			position,
			ancestry,
			ethosCapStatus,
			ethosCapAmount,
			status,
			poolTotalLot,
			poolTotalLogosWithdrawn,
			ethosBalance,
			pathosBalance
		} = this.state;
		if (!taoInfo || !taoDescription || !position || !ancestry || !pathosBalance) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to="/">
					Back to Dashboard
				</Ahref>
				<TAOName id={id} name={taoInfo.name} />
				<MediumEditor text={taoDescription} />
				<LeftContainer>
					<PositionDetails position={position} />
					<AncestryDetails ancestry={ancestry} />
				</LeftContainer>
				<RightContainer>
					<Financials
						id={id}
						ethosCapStatus={ethosCapStatus}
						ethosCapAmount={ethosCapAmount}
						status={status}
						poolTotalLot={poolTotalLot}
						poolTotalLogosWithdrawn={poolTotalLogosWithdrawn}
						ethosBalance={ethosBalance}
						pathosBalance={pathosBalance}
						getTAOPool={this.getTAOPool}
					/>
				</RightContainer>
			</Wrapper>
		);
	}
}

export { TAODetails };
