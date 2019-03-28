import * as React from "react";
import { Wrapper, SchemaForm, Button, Error } from "components/";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class PositionLogosForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelPosition = this.cancelPosition.bind(this);
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { logos, accounts, nameId } = this.props;
		if (!logos || !accounts || !nameId || !formData) {
			return;
		}
		this.setState({ formLoading: true });

		// Validation
		const availableToPositionAmount = await promisify(logos.availableToPositionAmount)(nameId);
		if (availableToPositionAmount.lt(formData.amount)) {
			this.setState({ error: true, errorMessage: "Insufficient Logos balance", formLoading: false });
			return;
		}
		logos.positionFrom(nameId, formData.recipient, formData.amount, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.refreshPositionLogos();
					})
					.catch((err) => {
						this.setState({ error: true, errorMessage: err.message, formLoading: false });
					});
			}
		});
	}

	cancelPosition() {
		this.props.togglePositionLogosForm();
	}

	render() {
		const { error, errorMessage, formLoading } = this.state;
		const { names, namesCompromised, nameId } = this.props;
		if (!names || !namesCompromised || !nameId) {
			return null;
		}
		const _names = names.filter((_name) => _name.nameId !== nameId);
		const _enum = [];
		const _enumNames = [];
		const _currentTimestamp = Math.round(new Date().getTime() / 1000);
		_names.forEach((_name) => {
			const _compromised = namesCompromised.find((name) => name.nameId === _name.nameId);
			if (!_compromised.compromised || (_compromised.compromised && _compromised.lockedUntilTimestamp.lte(_currentTimestamp))) {
				_enum.push(_name.nameId);
				_enumNames.push(`${_name.name} (${_name.nameId})`);
			}
		});
		schema.properties.recipient.enum = _enum;
		schema.properties.recipient.enumNames = _enumNames;
		return (
			<Wrapper>
				<SchemaForm schema={schema} showErrorList={false} onSubmit={this.handleSubmit}>
					<Button type="submit" disabled={formLoading}>
						{formLoading ? "Loading..." : "Position"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelPosition}>
						Cancel
					</Button>
				</SchemaForm>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { PositionLogosForm };
