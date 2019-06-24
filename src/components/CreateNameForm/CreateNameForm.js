import * as React from "react";
import { Wrapper, Title, SchemaForm, Error, Button } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";
import { metamaskPopup } from "../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";
import { getNameLookup as graphqlGetNameLookup, insertNameLookup as graphqlInsertNameLookup } from "utils/graphql";

const promisify = require("tiny-promisify");

class CreateNameForm extends React.Component {
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

	validate(formData, errors) {
		if (!formData.username.match(/^[a-zA-Z0-9_]{3,20}$/)) {
			errors.username.addError(
				"Username can only contain alphanumeric characters (letters A-Z, numbers 0-9) with the exception of underscores."
			);
		}
		return errors;
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { nameFactory, nameTAOLookup, accounts, localWriterKey } = this.props;
		if (!nameFactory || !nameTAOLookup || !accounts || !localWriterKey || !formData) {
			return;
		}
		if (this._isMounted) {
			this.setState({ formLoading: true });
		}
		const isExist = await promisify(nameTAOLookup.isExist)(formData.username);
		let keyExist = false;
		try {
			const response = await graphqlGetNameLookup(formData.username);
			keyExist = response.data.nameLookup.id ? true : false;
		} catch (e) {}
		if (isExist || keyExist) {
			if (this._isMounted) {
				this.setState({ error: true, errorMessage: "Username has been taken", formLoading: false });
			}
			return;
		}
		metamaskPopup();
		nameFactory.createName(formData.username, "", "", "", "", localWriterKey, { from: accounts[0] }, (err, transactionHash) => {
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
						const nameId = await promisify(nameFactory.ethAddressToNameId)(accounts[0]);
						this.props.setNameId(nameId);
						try {
							await graphqlInsertNameLookup(formData.username, nameId);
						} catch (e) {}
					})
					.catch((err) => {
						if (this._isMounted) {
							this.setState({ error: true, errorMessage: err.message, formLoading: false });
						}
					});
			}
		});
	}

	render() {
		const { error, errorMessage, formLoading, txHash } = this.state;
		return (
			<Wrapper className="padding-40">
				<Title className="big">Choose a Username</Title>
				<SchemaForm schema={schema} showErrorList={false} validate={this.validate} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Enter"}
					</Button>
					{txHash && <TxHashContainer txHash={txHash} />}
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { CreateNameForm };
