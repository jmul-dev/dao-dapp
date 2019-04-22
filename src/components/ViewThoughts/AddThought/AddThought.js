import * as React from "react";
import { Wrapper, MediumEditor, Button, Error } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { insertTAOThought as graphqlInsertTAOThought } from "utils/graphql";

class AddThought extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			thought: "",
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.addThought = this.addThought.bind(this);
	}

	handleEditorChange(thought) {
		this.setState({ thought });
	}

	async addThought() {
		const { taoId, nameId, parentThoughtId } = this.props;
		const { thought } = this.state;
		if (!taoId || !nameId) {
			return;
		}

		this.setState({ formLoading: true });
		if (!thought) {
			this.setState({ error: true, errorMessage: "Thoughts can not be empty", formLoading: false });
			return;
		}
		try {
			const response = await graphqlInsertTAOThought(nameId, taoId, parentThoughtId || 0, thought);
			if (!response.errors) {
				this.setState({
					error: false,
					errorMessage: "",
					formLoading: false,
					thought: ""
				});
				this.props.getTAOThoughts();
				//this.props.setSuccess("Success!", `Thought was added successfully`);
				if (parentThoughtId) {
					this.props.toggleShowForm();
				}
			} else {
				this.setState({ error: true, errorMessage: response.errors[0].message, formLoading: false });
			}
		} catch (e) {
			this.setState({ error: true, errorMessage: e.message, formLoading: false });
		}
	}

	render() {
		const { taoId, parentThoughtId, pastEventsRetrieved } = this.props;
		const { thought, error, errorMessage, formLoading } = this.state;
		if (!taoId || !pastEventsRetrieved) {
			return <ProgressLoaderContainer />;
		}
		return (
			<Wrapper>
				<MediumEditor
					className="margin-bottom-20"
					text={thought}
					onChange={this.handleEditorChange}
					options={{ placeholder: { text: "What are your thoughts?" } }}
				/>
				<Button type="button" disabled={formLoading} onClick={this.addThought}>
					{formLoading ? "Loading..." : "Think"}
				</Button>
				{parentThoughtId > 0 && (
					<Button className="no-bg margin-left" type="button" disabled={formLoading} onClick={this.props.toggleShowForm}>
						Cancel
					</Button>
				)}
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { AddThought };
