import * as React from "react";
import { Wrapper, Button, Error } from "components/";
import { FieldWrapper, Label, Select, ButtonWrapper } from "./styledComponents";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class SetSpeakerForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			speakerId: null,
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleSpeakerChange = this.handleSpeakerChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelSet = this.cancelSet.bind(this);
	}

	handleSpeakerChange(event) {
		event.persist();
		this.setState({ speakerId: event.target.value });
	}

	async handleSubmit(data) {
		const { speakerId } = this.state;
		const { nameTAOPosition, accounts, nameId, id } = this.props;
		if (!nameTAOPosition || !accounts || !nameId || !id) {
			return;
		}
		this.setState({ formLoading: true });

		if (!speakerId) {
			this.setState({ error: true, errorMessage: "Please select a Speaker", formLoading: false });
			return;
		}

		// Validation
		const advocateId = await promisify(nameTAOPosition.getAdvocate)(id);
		if (advocateId !== nameId) {
			this.setState({ error: true, errorMessage: "You are currently not the Advocate of this TAO", formLoading: false });
			return;
		}
		nameTAOPosition.setSpeaker(id, speakerId, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				waitForTransactionReceipt(transactionHash)
					.then(async () => {
						await this.props.getTAOPosition();
						this.setState({ error: false, errorMessage: "", formLoading: false });
						this.props.setSuccess("Success!", `A new Speaker was set successfully`);
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
		const { names, taos, nameId, currentSpeakerId, id } = this.props;
		if (!names || !taos || !nameId) {
			return null;
		}

		const _names = names.filter((_name) => _name.nameId !== currentSpeakerId);
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
					<Label>Select a Speaker*</Label>
					<Select className="form-control" onChange={this.handleSpeakerChange}>
						<option value="" />
						<optgroup label="Name">{nameOptions}</optgroup>
						<optgroup label="TAO">{taoOptions}</optgroup>
					</Select>
				</FieldWrapper>
				<ButtonWrapper>
					<Button type="button" disabled={formLoading} onClick={this.handleSubmit}>
						{formLoading ? "Loading..." : "Set Speaker"}
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

export { SetSpeakerForm };
