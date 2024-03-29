import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";
import { metamaskPopup } from "../../../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";

const promisify = require("tiny-promisify");

class SetAdvocateForm extends React.Component {
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
		const { nameTAOPosition, accounts, nameId, id } = this.props;
		if (!nameTAOPosition || !accounts || !nameId || !id || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		// Validation
		const advocateId = await promisify(nameTAOPosition.getAdvocate)(id);
		if (advocateId !== nameId) {
			this.setState({ error: true, errorMessage: "You are currently not the Advocate of this TAO", formLoading: false });
			return;
		}
		metamaskPopup();
		nameTAOPosition.setAdvocate(id, formData.advocateId, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				this.setState({ txHash: transactionHash });
				waitForTransactionReceipt(transactionHash)
					.then(async () => {
						await this.props.getTAOPosition();
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.setSuccess("Success!", `A new Advocate was set successfully`);
						this.props.toggleShowForm();
					})
					.catch((err) => {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					});
			}
		});
	}

	cancelSet() {
		this.props.toggleShowForm();
	}

	render() {
		const { error, errorMessage, formLoading, txHash } = this.state;
		const { names, nameId } = this.props;
		if (!names || !nameId) {
			return null;
		}
		const _names = names.filter((_name) => _name.nameId !== nameId);
		const _enum = [];
		const _enumNames = [];
		_names.forEach((_name) => {
			_enum.push(_name.nameId);
			_enumNames.push(`${_name.name} (${_name.nameId})`);
		});
		schema.properties.advocateId.enum = _enum;
		schema.properties.advocateId.enumNames = _enumNames;
		return (
			<Wrapper>
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Set Advocate"}
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

export { SetAdvocateForm };
