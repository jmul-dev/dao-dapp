import * as React from "react";
import { Wrapper, Title, Table, Button } from "components/";
import { formatDate } from "utils/";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class StakeEthosList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nameStakeEthos: null,
			processingWithdrawLogos: false,
			processingEthosLotId: null
		};
		this.withdrawLogos = this.withdrawLogos.bind(this);
	}

	componentDidMount() {
		const { nameStakeEthos } = this.props;
		this.setState({ nameStakeEthos });
	}

	componentDidUpdate(prevProps) {
		if (this.props.nameStakeEthos !== prevProps.nameStakeEthos) {
			this.setState({ nameStakeEthos: this.props.nameStakeEthos });
		}
	}

	async withdrawLogos(ethosLotId) {
		const { taoPool, accounts } = this.props;
		if (!taoPool || !accounts || !ethosLotId) {
			return;
		}

		this.setState({ processingWithdrawLogos: true, processingEthosLotId: ethosLotId });
		const logosAvailableToWithdraw = await promisify(taoPool.lotLogosAvailableToWithdraw)(ethosLotId);
		if (logosAvailableToWithdraw.eq(0)) {
			this.props.setError("Error!", "Currently, there is no available Logos to withdraw");
			this.setState({ processingWithdrawLogos: false, processingEthosLotId: null });
			return;
		}

		taoPool.withdrawLogos(ethosLotId, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.props.setError("Error!", err.message);
				this.setState({ processingWithdrawLogos: false, processingEthosLotId: null });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ processingWithdrawLogos: false, processingEthosLotId: null });
						this.props.getTAOPoolBalance();
						this.props.setSuccess("Success!", `You have successfully withdrawn ${logosAvailableToWithdraw.toNumber()} Logos`);
					})
					.catch((err) => {
						this.props.setError("Error!", err.message);
						this.setState({ processingWithdrawLogos: false, processingEthosLotId: null });
					});
			}
		});
	}

	render() {
		const { nameStakeEthos, processingWithdrawLogos, processingEthosLotId } = this.state;
		if (!nameStakeEthos) {
			return null;
		}

		const columns = [
			{
				Header: "Stake ID",
				accessor: "ethosLotId"
			},
			{
				Header: "Quantity",
				accessor: "lotQuantity",
				Cell: (props) => props.value.toNumber()
			},
			{
				Header: "Logos Earned",
				accessor: "logosEarned",
				Cell: (props) => props.value.toNumber()
			},
			{
				Header: "Logos Withdrawn",
				accessor: "logosWithdrawn",
				Cell: (props) => props.value.toNumber()
			},
			{
				Header: "Logos Available to Withdraw",
				Cell: (props) => props.original.logosEarned.minus(props.original.logosWithdrawn).toNumber()
			},

			{
				Header: "Timestamp",
				accessor: "timestamp",
				Cell: (props) => formatDate(props.value.toNumber())
			},
			{
				Header: "Action",
				Cell: (props) => {
					if (props.original.logosEarned.minus(props.original.logosWithdrawn).gt(0)) {
						return (
							<Button
								type="button"
								className="btn small"
								disabled={processingWithdrawLogos}
								onClick={async () => await this.withdrawLogos(props.original.ethosLotId)}
							>
								{processingEthosLotId !== props.original.ethosLotId ? "Withdraw Logos" : "Processing..."}
							</Button>
						);
					} else {
						return null;
					}
				}
			}
		];

		return (
			<Wrapper className="margin-top-40">
				<Title>Ethos Staked</Title>
				<Table data={nameStakeEthos} columns={columns} defaultPageSize={5} filterable={true} />
			</Wrapper>
		);
	}
}

export { StakeEthosList };
