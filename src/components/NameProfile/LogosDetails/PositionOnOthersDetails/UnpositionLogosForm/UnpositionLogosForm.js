import * as React from "react";
import { Wrapper, FieldContainer, FieldName, FieldValue, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class UnpositionLogosForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelUnposition = this.cancelUnposition.bind(this);
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { positionLogos, logos, accounts, nameId, targetNameId } = this.props;
		if (!positionLogos || !logos || !accounts || !nameId || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		const _targetName = positionLogos.find((position) => position.nameId === targetNameId);

		// Validation
		const availableToUnpositionAmount = await promisify(logos.positionOnOthers)(nameId, targetNameId);
		if (availableToUnpositionAmount.lt(formData.amount)) {
			this.setState({ error: true, errorMessage: "Exceeds available Logos amount", formLoading: false });
			return;
		}
		logos.unpositionFrom(nameId, targetNameId, formData.amount, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.refreshPositionLogos();
						this.props.setSuccess(
							"Success!",
							`You have successfully unpositioned Logos from ${_targetName.name} (${_targetName.nameId})`
						);
					})
					.catch((err) => {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					});
			}
		});
	}

	cancelUnposition() {
		this.props.toggleUnpositionLogosForm();
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		const { positionLogos, nameId, targetNameId } = this.props;
		if (!positionLogos || !nameId || !targetNameId) {
			return null;
		}
		const _targetName = positionLogos.find((position) => position.nameId === targetNameId);
		schema.properties.amount.maximum = _targetName.value.toNumber();
		return (
			<Wrapper>
				<FieldContainer>
					<FieldName>Target</FieldName>
					<FieldValue>
						{_targetName.name} ({_targetName.nameId})
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName>Maximum Unposition Amount</FieldName>
					<FieldValue>{_targetName.value.toNumber()}</FieldValue>
				</FieldContainer>
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Unposition"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelUnposition}>
						Cancel
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { UnpositionLogosForm };
