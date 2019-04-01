import * as React from "react";
import { Wrapper, MediumEditor, Button, Error } from "components/";
import { post } from "utils/";

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
		const { taoId, nameId } = this.props;
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
			const response = await post(`https://localhost/api/add-tao-thought`, {
				nameId,
				taoId,
				parentThoughtId: 0,
				thought
			});
			if (!response.error && !response.errorMessage) {
				this.setState({
					error: false,
					errorMessage: "",
					formLoading: false,
					thought: ""
				});
				this.props.getTAOThoughts();
				this.props.setSuccess("Success!", `Thought was added successfully`);
			} else {
				this.setState({ error: true, errorMessage: response.errorMessage, formLoading: false });
			}
		} catch (e) {
			this.setState({ error: true, errorMessage: e.message, formLoading: false });
		}
	}

	render() {
		const { taoId } = this.props;
		const { thought, error, errorMessage, formLoading } = this.state;
		if (!taoId) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
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
					{formLoading ? "Loading..." : "Comment"}
				</Button>
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { AddThought };
