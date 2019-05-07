import * as React from "react";
import { Wrapper, Title, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";
import TokenERC20 from "ao-contracts/build/contracts/TokenERC20.json";
import { metamaskPopup } from "../../../../utils/electron";

const promisify = require("tiny-promisify");

class TransferResources extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelTransfer = this.cancelTransfer.bind(this);
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { web3, nameTAOVault, accounts, nameId, id } = this.props;
		if (!web3 || !nameTAOVault || !accounts || !nameId || !id || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		// Validation
		if (formData.recipient === id) {
			this.setState({ error: true, errorMessage: "Can not transfer to the your own address", formLoading: false });
			return;
		} else if (!web3.isAddress(formData.recipient)) {
			this.setState({ error: true, errorMessage: "Invalid recipient address value", formLoading: false });
			return;
		}
		switch (formData.resourceType) {
			case "ETH":
				let balance = await promisify(nameTAOVault.ethBalanceOf)(id);
				if (balance.lt(formData.amount)) {
					this.setState({ error: true, errorMessage: "Name has insufficient ETH balance", formLoading: false });
					return false;
				}
				metamaskPopup();
				nameTAOVault.transferEth(id, formData.recipient, formData.amount, { from: accounts[0] }, (err, transactionHash) => {
					if (err) {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					} else {
						waitForTransactionReceipt(transactionHash)
							.then(async () => {
								await this.props.getNameResources();
								this.setState({ error: false, errorMessage: "", formLoading: false });
								this.props.setSuccess(
									"Success",
									`${formData.amount} Wei was transferred successfully to ${formData.recipient}`
								);
								this.props.toggleShowForm();
							})
							.catch((err) => {
								this.setState({ error: true, errorMessage: err.message, formLoading: false });
							});
					}
				});
				break;
			case "AO":
				balance = await promisify(nameTAOVault.AOBalanceOf)(id);
				if (balance.lt(formData.amount)) {
					this.setState({ error: true, errorMessage: "Name has insufficient AO balance", formLoading: false });
					return false;
				}
				metamaskPopup();
				nameTAOVault.transferAO(id, formData.recipient, formData.amount, { from: accounts[0] }, (err, transactionHash) => {
					if (err) {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					} else {
						waitForTransactionReceipt(transactionHash)
							.then(async () => {
								await this.props.getNameResources();
								this.setState({ error: false, errorMessage: "", formLoading: false });
								this.props.setSuccess(
									"Success",
									`${formData.amount} AO was transferred successfully to ${formData.recipient}`
								);
								this.props.toggleShowForm();
							})
							.catch((err) => {
								this.setState({ error: true, errorMessage: err.message, formLoading: false });
							});
					}
				});
				break;
			case "AO+":
				balance = await promisify(nameTAOVault.primordialAOBalanceOf)(id);
				if (balance.lt(formData.amount)) {
					this.setState({ error: true, errorMessage: "Name has insufficient AO+ balance", formLoading: false });
					return false;
				}
				metamaskPopup();
				nameTAOVault.transferPrimordialAO(
					id,
					formData.recipient,
					formData.amount,
					{ from: accounts[0] },
					(err, transactionHash) => {
						if (err) {
							this.setState({ error: true, errorMessage: err.message, formLoading: false });
						} else {
							waitForTransactionReceipt(transactionHash)
								.then(async () => {
									await this.props.getNameResources();
									this.setState({ error: false, errorMessage: "", formLoading: false });
									this.props.setSuccess(
										"Success",
										`${formData.amount} AO+ was transferred successfully to ${formData.recipient}`
									);
									this.props.toggleShowForm();
								})
								.catch((err) => {
									this.setState({ error: true, errorMessage: err.message, formLoading: false });
								});
						}
					}
				);
				break;
			case "ERC20":
				if (!web3.isAddress(formData.erc20Address)) {
					this.setState({ error: true, errorMessage: "Invalid ERC20 token address value", formLoading: false });
					return false;
				}
				let tokenERC20, tokenERC20Name, tokenERC20Symbol;
				try {
					tokenERC20 = web3.eth.contract(TokenERC20.abi).at(formData.erc20Address);
					tokenERC20Name = await promisify(tokenERC20.name)();
					tokenERC20Symbol = await promisify(tokenERC20.symbol)();
					balance = await promisify(nameTAOVault.erc20BalanceOf)(formData.erc20Address, id);
					if (balance.lt(formData.amount)) {
						this.setState({
							error: true,
							errorMessage: `Name has insufficient ${tokenERC20Name} (${tokenERC20Symbol}) balance`,
							formLoading: false
						});
						return false;
					}
				} catch (e) {
					this.setState({ error: true, errorMessage: "Invalid ERC20 token address value", formLoading: false });
					return false;
				}
				nameTAOVault.transferERC20(
					formData.erc20Address,
					id,
					formData.recipient,
					formData.amount,
					{ from: accounts[0] },
					(err, transactionHash) => {
						if (err) {
							this.setState({ error: true, errorMessage: err.message, formLoading: false });
						} else {
							waitForTransactionReceipt(transactionHash)
								.then(async () => {
									await this.props.getNameResources();
									this.setState({ error: false, errorMessage: "", formLoading: false });
									this.props.setSuccess(
										"Success",
										`${formData.amount} ${tokenERC20Name} (${tokenERC20Symbol}) was transferred successfully to ${
											formData.recipient
										}`
									);
									this.props.toggleShowForm();
								})
								.catch((err) => {
									this.setState({ error: true, errorMessage: err.message, formLoading: false });
								});
						}
					}
				);
				break;
			default:
				this.setState({ error: true, errorMessage: "Invalid resource type", formLoading: false });
				return false;
		}
	}

	cancelTransfer() {
		this.props.toggleShowForm();
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		return (
			<Wrapper className="margin-top-30">
				<Title>Transfer Resources</Title>
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Transfer"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelTransfer}>
						Cancel
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { TransferResources };
