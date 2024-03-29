import * as React from "react";
import { Wrapper, Title, Header, FieldContainer, FieldName, FieldValue, Error, Button } from "components/";
import { getWriterKeySignature } from "utils/graphql";
import { waitForTransactionReceipt } from "utils/web3";
import { EMPTY_ADDRESS } from "common/constants";
import { metamaskPopup } from "../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";

const promisify = require("tiny-promisify");

class UpdateWriterKey extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = { error: false, errorMessage: "", formLoading: false, txHash: null };
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
		let signature;
		try {
			const response = await getWriterKeySignature(nameId, nonce.plus(1).toNumber());
			if (!response.data.writerKeySignature) {
				if (this._isMounted) {
					this.setState({ error: true, errorMessage: "Unable to get the writer key signature", formLoading: false });
				}
				return;
			}
			signature = response.data.writerKeySignature;
		} catch (e) {
			if (this._isMounted) {
				this.setState({ error: true, errorMessage: "Unable to get the writer key signature", formLoading: false });
			}
			return;
		}
		const { v, r, s } = signature;
		metamaskPopup();
		namePublicKey.addSetWriterKey(
			nameId,
			localWriterKey,
			nonce.plus(1).toNumber(),
			v,
			r,
			s,
			{ from: accounts[0] },
			(err, transactionHash) => {
				if (err) {
					if (this._isMounted) {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					}
				} else {
					if (this._isMounted) {
						this.setState({ txHash: transactionHash });
					}
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
		const { error, errorMessage, formLoading, txHash } = this.state;
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
				{txHash && <TxHashContainer txHash={txHash} />}
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { UpdateWriterKey };
