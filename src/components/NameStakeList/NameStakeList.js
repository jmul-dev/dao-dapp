import * as React from "react";
import { Wrapper, Ahref } from "components/";
import { TAOName } from "./TAOName/";
import { Financials } from "./Financials/";
import { StakeEthosListContainer } from "./StakeEthosList/";
import { StakePathosList } from "./StakePathosList/";

const promisify = require("tiny-promisify");

class NameStakeList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ethosStaked: null,
			pathosStaked: null,
			logosWithdrawn: null,
			dataPopulated: false
		};
		this.initialState = this.state;
	}

	async componentDidMount() {
		await this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (
			this.props.params.id !== prevProps.params.id ||
			this.props.nameStakeEthos !== prevProps.nameStakeEthos ||
			this.props.nameStakePathos !== prevProps.nameStakePathos
		) {
			if (this.props.params.id !== prevProps.params.id) {
				this.setState(this.initialState);
			}
			await this.getData();
		}
	}

	async getData() {
		const { id } = this.props.params;
		const { nameId, taoPool } = this.props;
		if (!id || !nameId || !taoPool) {
			return;
		}
		const ethosStaked = await promisify(taoPool.namePoolEthosStaked)(nameId, id);
		const pathosStaked = await promisify(taoPool.namePoolPathosStaked)(nameId, id);
		const logosWithdrawn = await promisify(taoPool.namePoolLogosWithdrawn)(nameId, id);
		this.setState({ ethosStaked, pathosStaked, logosWithdrawn, dataPopulated: true });
	}

	render() {
		const { id } = this.props.params;
		const { taos, nameStakeEthos, nameStakePathos } = this.props;
		const { ethosStaked, pathosStaked, logosWithdrawn, dataPopulated } = this.state;
		const taoInfo = taos.find((tao) => tao.taoId === id);
		const _nameStakeEthos = nameStakeEthos.filter((tao) => tao.taoId === id);
		const _nameStakePathos = nameStakePathos.filter((tao) => tao.taoId === id);

		if (!taoInfo || !id || !dataPopulated) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${id}/`}>
					Back to TAO Details
				</Ahref>
				<TAOName name={taoInfo.name} id={id} />
				<Financials ethosStaked={ethosStaked} pathosStaked={pathosStaked} logosWithdrawn={logosWithdrawn} />
				<StakeEthosListContainer nameStakeEthos={_nameStakeEthos} />
				<StakePathosList nameStakePathos={_nameStakePathos} />
			</Wrapper>
		);
	}
}

export { NameStakeList };
