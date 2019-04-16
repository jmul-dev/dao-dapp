import * as React from "react";
import { Wrapper, Title, SchemaForm, Error, Button } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class CreateNameForm extends React.Component {
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
		const { formData } = data;
		const { nameFactory, nameTAOLookup, accounts, localWriterKey } = this.props;
		if (!nameFactory || !nameTAOLookup || !accounts || !localWriterKey || !formData) {
			return;
		}
		if (this._isMounted) {
			this.setState({ formLoading: true });
		}
		const isExist = await promisify(nameTAOLookup.isExist)(formData.username);
		if (isExist) {
			if (this._isMounted) {
				this.setState({ error: true, errorMessage: "Username has been taken", formLoading: false });
			}
			return;
		}
		nameFactory.createName(formData.username, "", "", "", "", localWriterKey, { from: accounts[0] }, (err, transactionHash) => {
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
						const nameId = await promisify(nameFactory.ethAddressToNameId)(accounts[0]);
						this.props.setNameId(nameId);
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
		const { error, errorMessage, formLoading } = this.state;
		return (
			<Wrapper className="padding-40">
				<Title className="big">Choose a Username</Title>
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Enter"}
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { CreateNameForm };
