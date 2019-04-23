import * as React from "react";
import { Wrapper, Title, SchemaForm, Button, Error, FieldContainer, FieldName, FieldValue } from "components/";
import { schema } from "./schema";
import TokenERC20 from "ao-contracts/build/contracts/TokenERC20.json";

const promisify = require("tiny-promisify");

class CheckERC20Balance extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false,
			tokenERC20Address: null,
			tokenERC20Name: null,
			tokenERC20Symbol: null,
			erc20Balance: null
		};
		this.initialState = this.state;
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelCheck = this.cancelCheck.bind(this);
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { web3, nameTAOVault, id } = this.props;
		if (!web3 || !nameTAOVault || !id || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		if (!web3.isAddress(formData.erc20Address)) {
			this.setState({ ...this.initialState, error: true, errorMessage: "Invalid ERC20 token address value" });
			return false;
		}
		let tokenERC20, tokenERC20Name, tokenERC20Symbol, erc20Balance;
		try {
			tokenERC20 = web3.eth.contract(TokenERC20.abi).at(formData.erc20Address);
			tokenERC20Name = await promisify(tokenERC20.name)();
			tokenERC20Symbol = await promisify(tokenERC20.symbol)();
			erc20Balance = await promisify(nameTAOVault.erc20BalanceOf)(formData.erc20Address, id);
			this.setState({
				error: false,
				errorMessage: "",
				formLoading: false,
				tokenERC20Address: formData.erc20Address,
				tokenERC20Name,
				tokenERC20Symbol,
				erc20Balance
			});
		} catch (e) {
			this.setState({ ...this.initialState, error: true, errorMessage: "Invalid ERC20 token address value" });
			return false;
		}
	}

	cancelCheck() {
		this.props.toggleShowForm();
	}

	render() {
		const { error, errorMessage, formLoading, tokenERC20Address, tokenERC20Name, tokenERC20Symbol, erc20Balance } = this.state;
		return (
			<Wrapper className="margin-top-30">
				<Title>Check ERC20 Balance</Title>
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Check Balance"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelCheck}>
						Cancel
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
				{!error && tokenERC20Address && tokenERC20Name && tokenERC20Symbol && erc20Balance && (
					<Wrapper className="margin-top-20">
						<FieldContainer>
							<FieldName>ERC20 Token Address</FieldName>
							<FieldValue>{tokenERC20Address}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Name</FieldName>
							<FieldValue>{tokenERC20Name}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Symbol</FieldName>
							<FieldValue>{tokenERC20Symbol}</FieldValue>
						</FieldContainer>
						<FieldContainer>
							<FieldName>Available Balance</FieldName>
							<FieldValue>{erc20Balance.toNumber()}</FieldValue>
						</FieldContainer>
					</Wrapper>
				)}
			</Wrapper>
		);
	}
}

export { CheckERC20Balance };
