import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "reducers/contractReducer";

const promisify = require("tiny-promisify");

class TransferIon extends React.Component {
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
		const { aoion, accounts, nameId } = this.props;
		if (!aoion || !accounts || !nameId || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		// Validation
		if (formData.from === formData.to) {
			this.setState({ error: true, errorMessage: "Can not transfer to the same address", formLoading: false });
			return;
		}
		if (formData.type === "AO") {
			const networkBalance = await promisify(aoion.balanceOf)(formData.from);
			if (networkBalance.lt(formData.amount)) {
				this.setState({ error: true, errorMessage: "From address has insufficient AO balance", formLoading: false });
				return;
			}
		} else {
			const primordialBalance = await promisify(aoion.primordialBalanceOf)(formData.from);
			if (primordialBalance.lt(formData.amount)) {
				this.setState({ error: true, errorMessage: "From address has insufficient AO+ balance", formLoading: false });
				return;
			}
		}
		if (formData.type === "AO") {
			aoion.transferBetweenPublicKeys(
				nameId,
				formData.from,
				formData.to,
				formData.amount,
				{ from: accounts[0] },
				(err, transactionHash) => {
					if (err) {
						this.setState({ error: true, errorMessage: err, formLoading: false });
					} else {
						waitForTransactionReceipt(transactionHash)
							.then(() => {
								this.setState({ error: false, errorMessage: "", formLoading: false });
								this.props.refreshPublicKeyBalance(formData.from);
								this.props.refreshPublicKeyBalance(formData.to);
							})
							.catch((err) => {
								this.setState({ error: true, errorMessage: err.message, formLoading: false });
							});
					}
				}
			);
		} else {
			aoion.transferPrimordialBetweenPublicKeys(
				nameId,
				formData.from,
				formData.to,
				formData.amount,
				{ from: accounts[0] },
				(err, transactionHash) => {
					if (err) {
						this.setState({ error: true, errorMessage: err, formLoading: false });
					} else {
						waitForTransactionReceipt(transactionHash)
							.then(() => {
								this.setState({ error: false, errorMessage: "", formLoading: false });
								this.props.refreshPublicKeyBalance(formData.from);
								this.props.refreshPublicKeyBalance(formData.to);
							})
							.catch((err) => {
								this.setState({ error: true, errorMessage: err.message, formLoading: false });
							});
					}
				}
			);
		}
	}

	cancelTransfer() {
		this.props.toggleTransferIonForm();
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		schema.definitions.publicKeys.enum = this.props.publicKeys;
		return (
			<Wrapper>
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

export { TransferIon };
