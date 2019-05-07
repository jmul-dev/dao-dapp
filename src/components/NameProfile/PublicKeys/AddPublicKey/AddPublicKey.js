import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";
import { metamaskPopup } from "../../../../utils/electron";

const EthCrypto = require("eth-crypto");
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
		const { namePublicKey, nameFactory, accounts, nameId } = this.props;
		if (!namePublicKey || !nameFactory || !accounts || !nameId || !formData) {
			return;
		}
		this.setState({ formLoading: true });
		const isKeyExist = await promisify(namePublicKey.isKeyExist)(nameId, formData.publicKey);
		if (isKeyExist) {
			this.setState({ error: true, errorMessage: "Public key already exist", formLoading: false });
			return;
		}

		try {
			const _publicKey = EthCrypto.publicKeyByPrivateKey(formData.privateKey);
			if (EthCrypto.publicKey.toAddress(_publicKey) !== formData.publicKey) {
				this.setState({ error: true, errorMessage: "Incorrect private key", formLoading: false });
				return;
			}
		} catch (e) {
			this.setState({ error: true, errorMessage: "Invalid private key value", formLoading: false });
			return;
		}

		const nonce = await promisify(nameFactory.nonces)(nameId);
		const signHash = EthCrypto.hash.keccak256([
			{
				type: "address",
				value: namePublicKey.address
			},
			{
				type: "address",
				value: nameId
			},
			{
				type: "address",
				value: formData.publicKey
			},
			{
				type: "uint256",
				value: nonce.plus(1).toNumber()
			}
		]);
		const signature = EthCrypto.sign(formData.privateKey, signHash);
		const vrs = EthCrypto.vrs.fromString(signature);
		metamaskPopup();
		namePublicKey.addKey(
			nameId,
			formData.publicKey,
			nonce.plus(1).toNumber(),
			vrs.v,
			vrs.r,
			vrs.s,
			{ from: accounts[0] },
			(err, transactionHash) => {
				if (err) {
					this.setState({ error: true, errorMessage: err.message, formLoading: false });
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
			}
		);
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
