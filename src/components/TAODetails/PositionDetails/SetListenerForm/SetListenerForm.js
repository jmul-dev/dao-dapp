import * as React from "react";
import { Wrapper, Button, Error } from "components/";
import { FieldWrapper, Label, Select, ButtonWrapper } from "./styledComponents";
import { waitForTransactionReceipt } from "utils/web3";
import { metamaskPopup } from "../../../../utils/electron";

const promisify = require("tiny-promisify");

class SetListenerForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			listenerId: null,
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleListenerChange = this.handleListenerChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelSet = this.cancelSet.bind(this);
	}

	handleListenerChange(event) {
		event.persist();
		this.setState({ listenerId: event.target.value });
	}

	async handleSubmit(data) {
		const { listenerId } = this.state;
		const { nameTAOPosition, accounts, nameId, id } = this.props;
		if (!nameTAOPosition || !accounts || !nameId || !id) {
			return;
		}
		this.setState({ formLoading: true });

		if (!listenerId) {
			this.setState({ error: true, errorMessage: "Please select a Listener", formLoading: false });
			return;
		}

		// Validation
		const advocateId = await promisify(nameTAOPosition.getAdvocate)(id);
		if (advocateId !== nameId) {
			this.setState({ error: true, errorMessage: "You are currently not the Advocate of this TAO", formLoading: false });
			return;
		}
		metamaskPopup();
		nameTAOPosition.setListener(id, listenerId, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(async () => {
						await this.props.getTAOPosition();
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.setSuccess("Success!", `A new Listener was set successfully`);
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
		const { error, errorMessage, formLoading } = this.state;
		const { names, taos, nameId, currentListenerId, id } = this.props;
		if (!names || !taos || !nameId) {
			return null;
		}

		const _names = names.filter((_name) => _name.nameId !== currentListenerId);
		const nameOptions = _names.map((name) => (
			<option key={name.nameId} value={name.nameId}>
				{name.name} ({name.nameId})
			</option>
		));

		const _taos = taos.filter((_tao) => _tao.taoId !== id);
		const taoOptions = _taos.map((tao) => (
			<option key={tao.taoId} value={tao.taoId}>
				{tao.name} ({tao.taoId})
			</option>
		));

		return (
			<Wrapper>
				<FieldWrapper>
					<Label>Select a Listener*</Label>
					<Select className="form-control" onChange={this.handleListenerChange}>
						<option value="" />
						<optgroup label="Name">{nameOptions}</optgroup>
						<optgroup label="TAO">{taoOptions}</optgroup>
					</Select>
				</FieldWrapper>
				<ButtonWrapper>
					<Button type="button" disabled={formLoading} onClick={this.handleSubmit}>
						{formLoading ? "Loading..." : "Set Listener"}
					</Button>
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelSet}>
						Cancel
					</Button>
				</ButtonWrapper>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { SetListenerForm };
