import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
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
						this.setState({ error: false, errorMessage: "", formLoading: false });
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
			<Wrapper className="margin-top-30">
				<SchemaForm schema={schema} showErrorList={false} validate={this.validate} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Add"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelAdd}>
						Cancel
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { AddPublicKey };
