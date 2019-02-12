import * as React from "react";
import { Wrapper, StyledForm, StyledButton, CancelButton, Error } from "./styledComponents";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "reducers/contractReducer";

const promisify = require("tiny-promisify");

class AddPublicKey extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.validate = this.validate.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelAdd = this.cancelAdd.bind(this);
	}

	validate(formData, errors) {
		const { web3 } = this.props;
		const isAddress = web3.isAddress(formData.publicKey);
		if (!isAddress) {
			errors.publicKey.addError("Invalid public key address");
		}
		return errors;
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { namePublicKey, accounts, nameId } = this.props;
		if (!namePublicKey || !accounts || !nameId || !formData) {
			return;
		}
		this.setState({ formLoading: true });
		const isKeyExist = await promisify(namePublicKey.isKeyExist)(nameId, formData.publicKey);
		if (isKeyExist) {
			this.setState({ error: true, errorMessage: "Public key already exist", formLoading: false });
			return;
		}
		namePublicKey.addKey(nameId, formData.publicKey, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ formLoading: false });
						this.props.appendPublicKey(formData.publicKey);
					})
					.catch((err) => {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					});
			}
		});
	}

	cancelAdd() {
		this.props.toggleAddKeyForm();
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		return (
			<Wrapper>
				<StyledForm schema={schema} showErrorList={false} validate={this.validate} onSubmit={this.handleSubmit}>
					<StyledButton type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Add"}
					</StyledButton>
					<CancelButton type="button" disabled={formLoading} onClick={this.cancelAdd}>
						Cancel
					</CancelButton>
				</StyledForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { AddPublicKey };
