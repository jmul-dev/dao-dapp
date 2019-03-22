import * as React from "react";
import { Wrapper, Title, Table, Button } from "components/";
//import { UnpositionLogosFormContainer } from "./UnpositionLogosForm/";
import { formatDate } from "utils/";

class StakeEthosList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nameStakeEthos: null,
			showWithdrawLogosForm: false,
			ethosLotId: null
		};
		this.toggleWithdrawLogosForm = this.toggleWithdrawLogosForm.bind(this);
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

	toggleWithdrawLogosForm(ethosLotId) {
		this.setState({ showWithdrawLogosForm: !this.state.showWithdrawLogosForm, ethosLotId });
	}

	render() {
		const { nameStakeEthos, showWithdrawLogosForm } = this.state;
		//		const { refreshPositionLogos } = this.props;
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
								onClick={() => this.toggleWithdrawLogosForm(props.original.ethosLotId)}
							>
								Withdraw Logos
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
				{!showWithdrawLogosForm ? (
					<Wrapper>
						<Title>Ethos Staked</Title>
						<Table data={nameStakeEthos} columns={columns} defaultPageSize={5} filterable={true} />
					</Wrapper>
				) : null}
			</Wrapper>
		);
	}
}

export { StakeEthosList };
