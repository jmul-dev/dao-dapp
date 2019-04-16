import * as React from "react";
import { Wrapper, Title, Header, FieldContainer, FieldName, FieldValue, Error, Button } from "components/";
import { get, encodeParams } from "utils/";
import { waitForTransactionReceipt } from "utils/web3";
import { EMPTY_ADDRESS } from "common/constants";

const EthCrypto = require("eth-crypto");
const promisify = require("tiny-promisify");

class UpdateWriterKey extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = { error: false, errorMessage: "", formLoading: false };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async handleSubmit(data) {
		const { namePublicKey, nameFactory, nameId, accounts, localWriterKey } = this.props;
		if (!namePublicKey || !nameFactory || !nameId || !accounts || !localWriterKey) {
			return;
		}
		if (this._isMounted) {
			this.setState({ formLoading: true });
		}
		const isKeyTaken = await promisify(namePublicKey.keyToNameId)(localWriterKey);
		if (isKeyTaken !== EMPTY_ADDRESS) {
			if (this._isMounted) {
				this.setState({ error: true, errorMessage: "Writer key has been taken", formLoading: false });
			}
			return;
		}
		const nonce = await promisify(nameFactory.nonces)(nameId);
		const response = await get(
			`https://localhost/api/get-writer-key-signature?${encodeParams({ nameId, nonce: nonce.plus(1).toNumber() })}`
		);
		if (!response.signature) {
			if (this._isMounted) {
				this.setState({ error: true, errorMessage: "Unable to get the writer key signature", formLoading: false });
			}
			return;
		}
		const vrs = EthCrypto.vrs.fromString(response.signature);
		namePublicKey.addSetWriterKey(
			nameId,
			localWriterKey,
			nonce.plus(1).toNumber(),
			vrs.v,
			vrs.r,
			vrs.s,
			{ from: accounts[0] },
			(err, transactionHash) => {
				if (err) {
					if (this._isMounted) {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					}
				} else {
					waitForTransactionReceipt(transactionHash)
						.then(async () => {
							if (this._isMounted) {
								this.setState({ error: false, errorMessage: "", formLoading: false });
							}
						})
						.catch((err) => {
							if (this._isMounted) {
								this.setState({ error: true, errorMessage: err.message, formLoading: false });
							}
						});
				}
			}
		);
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		const { localWriterKey, contractWriterKey } = this.props;
		if (!localWriterKey || !contractWriterKey) {
			return null;
		}
		return (
			<Wrapper className="padding-40">
				<Title>Writer Key Discrepancy Detected</Title>
				<Header>
					You won't be able to continue unless you resolve this issue by adding current node's writer key to your account. You can
					later remove your old writer key in Public Keys section under your profile page.
				</Header>
				<FieldContainer>
					<FieldName>Current Node's Writer Key</FieldName>
					<FieldValue>{localWriterKey}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Previously Stored Writer Key</FieldName>
					<FieldValue>{contractWriterKey}</FieldValue>
				</FieldContainer>
				<Wrapper className="margin-top-20">
					<Button type="button" disabled={formLoading} onClick={this.handleSubmit}>
						{formLoading ? "Loading..." : "Add Current Node's Writer Key"}
					</Button>
				</Wrapper>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { UpdateWriterKey };
