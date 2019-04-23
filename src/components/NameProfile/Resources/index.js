import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { TransferResourcesContainer } from "./TransferResources/";
import { CheckERC20BalanceContainer } from "./CheckERC20Balance/";

class Resources extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: false,
			showTransferResourcesForm: false,
			showCheckERC20Balance: false
		};
		this.toggleShowForm = this.toggleShowForm.bind(this);
		this.showTransferResourcesForm = this.showTransferResourcesForm.bind(this);
		this.showCheckERC20Balance = this.showCheckERC20Balance.bind(this);
	}

	toggleShowForm() {
		this.setState({ showForm: !this.state.showForm });
		if (!this.state.showForm) {
			this.setState({ showTransferResourcesForm: false, showCheckERC20Balance: false });
		}
	}

	showTransferResourcesForm() {
		this.setState({ showForm: true, showTransferResourcesForm: true, showCheckERC20Balance: false });
	}

	showCheckERC20Balance() {
		this.setState({ showForm: true, showTransferResourcesForm: false, showCheckERC20Balance: true });
	}

	render() {
		const { id, resources, singlePageView } = this.props;
		const { showForm, showTransferResourcesForm } = this.state;

		if (!showForm) {
			return (
				<Wrapper>
					<Title className={singlePageView ? "margin-top" : ""}>Name Resources</Title>
					<FieldContainer>
						<FieldName>ETH (in Wei)</FieldName>
						<FieldValue>{resources.ethBalance ? resources.ethBalance.toNumber() : 0}</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName>AO</FieldName>
						<FieldValue>{resources.aoBalance ? resources.aoBalance.toNumber() : 0}</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName>AO+</FieldName>
						<FieldValue>{resources.primordialAOBalance ? resources.primordialAOBalance.toNumber() : 0}</FieldValue>
					</FieldContainer>
					<Icon className="animated bounceIn" onClick={this.showTransferResourcesForm}>
						<img src={process.env.PUBLIC_URL + "/images/transfer.png"} alt={"Transfer Resources"} />
						<div>Transfer Resources</div>
					</Icon>
					<Icon className="animated bounceIn" onClick={this.showCheckERC20Balance}>
						<img src={process.env.PUBLIC_URL + "/images/check-balance.png"} alt={"Check ERC20 Balance"} />
						<div>Check ERC20 Balance</div>
					</Icon>
				</Wrapper>
			);
		} else if (showTransferResourcesForm) {
			return (
				<TransferResourcesContainer id={id} toggleShowForm={this.toggleShowForm} getNameResources={this.props.getNameResources} />
			);
		} else {
			return <CheckERC20BalanceContainer id={id} toggleShowForm={this.toggleShowForm} />;
		}
	}
}

export { Resources };
