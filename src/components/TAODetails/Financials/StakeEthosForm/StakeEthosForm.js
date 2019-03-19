import * as React from "react";
import { Wrapper, FieldContainer, FieldName, FieldValue, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";

class StakeEthosForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelStake = this.cancelStake.bind(this);
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { taoCurrencyBalances, taoPool, accounts, id } = this.props;
		if (!taoCurrencyBalances || !taoPool || !accounts || !id || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		// Validation
		if (taoCurrencyBalances.ethos.lt(formData.amount)) {
			this.setState({ error: true, errorMessage: "Insufficient Ethos balance", formLoading: false });
			return;
		}
		taoPool.stakeEthos(id, formData.amount, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.setSuccess("Success!", `${formData.amount} Ethos were staked successfully`);
						this.props.getTAOPool();
					})
					.catch((err) => {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					});
			}
		});
	}

	cancelStake() {
		this.props.toggleShowForm();
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		const { ethosCapStatus, ethosCapAmount, ethosBalance } = this.props;
		if (ethosCapStatus && ethosCapAmount) {
			schema.properties.amount.maximum = ethosCapAmount.minus(ethosBalance).toNumber();
		}
		return (
			<Wrapper>
				<FieldContainer>
					<FieldName>Current Ethos Staked</FieldName>
					<FieldValue>{ethosBalance.toNumber()}</FieldValue>
				</FieldContainer>
				{ethosCapStatus && (
					<Wrapper>
						<FieldContainer>
							<FieldName>Available Amount to Stake</FieldName>
							<FieldValue>{ethosCapAmount.minus(ethosBalance).toNumber()}</FieldValue>
						</FieldContainer>
					</Wrapper>
				)}
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Stake Ethos"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelStake}>
						Cancel
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { StakeEthosForm };
