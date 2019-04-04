import * as React from "react";
import { Wrapper, Title, Error, MediumEditor, Button } from "components/";
import { post } from "utils/";

const promisify = require("tiny-promisify");

class AddTAODescriptionForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false,
			taoDescription: ""
		};
		this.initialState = this.state;
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.cancelAdd = this.cancelAdd.bind(this);
	}

	handleEditorChange(taoDescription) {
		this.setState({ taoDescription });
	}

	cancelAdd() {
		this.props.toggleAddTAODescriptionForm();
	}

	async handleSubmit() {
		const { nameTAOPosition, nameId, id } = this.props;
		const { taoDescription } = this.state;
		if (!nameTAOPosition || !nameId || !id) {
			return;
		}
		this.setState({ formLoading: true });
		const nameIsAdvocate = await promisify(nameTAOPosition.nameIsAdvocate)(nameId, id);
		if (!nameIsAdvocate) {
			this.setState({ error: true, errorMessage: "You are no longer the Advocate of the TAO", formLoading: false });
			return;
		}
		if (taoDescription.length < 30) {
			this.setState({ error: true, errorMessage: "Description is too short (min. 30 chars)", formLoading: false });
			return;
		}

		try {
			const response = await post(`https://localhost/api/add-tao-description`, {
				taoId: id,
				description: taoDescription
			});
			if (!response.error && !response.errorMessage) {
				this.setState({
					error: false,
					errorMessage: "",
					formLoading: false,
					taoDescription: ""
				});
				await this.props.getTAODescriptions();
				this.props.toggleAddTAODescriptionForm();
			} else {
				this.setState({ error: true, errorMessage: response.errorMessage, formLoading: false });
			}
		} catch (e) {
			this.setState({ error: true, errorMessage: e.message, formLoading: false });
		}
	}

	render() {
		const { name } = this.props;
		const { error, errorMessage, formLoading, taoDescription } = this.state;

		return (
			<Wrapper>
				<Title>Write New Description for {name}</Title>
				<MediumEditor
					className="margin-bottom-20"
					text={taoDescription}
					onChange={this.handleEditorChange}
					options={{ placeholder: { text: "Enter the description here" } }}
				/>
				<Button type="button" disabled={formLoading} onClick={this.handleSubmit}>
					{formLoading ? "Loading..." : "Submit"}
				</Button>
				<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.cancelAdd}>
					Cancel
				</Button>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { AddTAODescriptionForm };
