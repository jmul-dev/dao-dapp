import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";
import { EMPTY_ADDRESS } from "common/constants";
import { metamaskPopup } from "../../../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";

const promisify = require("tiny-promisify");

class NewAddressForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false,
			txHash: null
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelSet = this.cancelSet.bind(this);
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { nameFactory, nameAccountRecovery, web3, accounts, id } = this.props;
		if (!nameFactory || !nameAccountRecovery || !web3 || !accounts || !id || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		// Validation
		if (!web3.isAddress(formData.address)) {
			this.setState({ error: true, errorMessage: "Invalid address value", formLoading: false });
			return;
		}
		const _nameId = await promisify(nameFactory.ethAddressToNameId)(formData.address);
		if (_nameId !== EMPTY_ADDRESS) {
			this.setState({ error: true, errorMessage: "Address is already taken by another Name", formLoading: false });
			return;
		}
		const isCompromised = await promisify(nameAccountRecovery.isCompromised)(id);
		if (!isCompromised) {
			this.setState({
				error: true,
				errorMessage: "Account recovery period has finished. Name is no longer locked.",
				formLoading: false
			});
			return;
		}
		metamaskPopup();
		nameAccountRecovery.setNameNewAddress(id, formData.address, { from: accounts[0], gas: 250000 }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				this.setState({ txHash: transactionHash });
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.setSuccess("Success!", `New ETH address was set successfully`);
						this.props.setCompromised(false);
						this.props.toggleNewAddressForm();
					})
					.catch((err) => {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					});
			}
		});
	}

	cancelSet() {
		this.props.toggleNewAddressForm();
	}

	render() {
		const { error, errorMessage, formLoading, txHash } = this.state;
		return (
			<Wrapper>
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Submit"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelSet}>
						Cancel
					</Button>
				</SchemaForm>
				{txHash && <TxHashContainer txHash={txHash} />}
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { NewAddressForm };
