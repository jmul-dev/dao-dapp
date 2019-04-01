import * as React from "react";
import { Wrapper, Title, Header, Ahref, MediumEditor, Button, Error, Hr } from "components/";
import { get, encodeParams } from "utils/";
import { post } from "utils/";

class ViewThoughts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoDescription: null,
			thought: "",
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.addThought = this.addThought.bind(this);
	}

	async componentDidMount() {
		await this.getTAODescription(this.props.params.id);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			await this.getTAODescription(this.props.params.id);
		}
	}

	async getTAODescription(id) {
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-tao-description?${encodeParams({ taoId: id })}`);
			if (response.description) {
				this.setState({ taoDescription: response.description });
			}
		} catch (e) {}
	}

	handleEditorChange(thought) {
		this.setState({ thought });
	}

	async addThought() {
		const { id } = this.props.params;
		const { nameId } = this.props;
		if (!id || !nameId) {
			return;
		}

		const { thought } = this.state;
		this.setState({ formLoading: true });
		if (!thought) {
			this.setState({ error: true, errorMessage: "Thoughts can not be empty", formLoading: false });
			return;
		}
		try {
			const response = await post(`https://localhost/api/add-tao-thought`, {
				nameId,
				taoId: id,
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
				this.props.setSuccess("Success!", `Thought was added successfully`);
			} else {
				this.setState({ error: true, errorMessage: response.errorMessage, formLoading: false });
			}
		} catch (e) {
			this.setState({ error: true, errorMessage: e.message, formLoading: false });
		}
	}

	render() {
		const { id } = this.props.params;
		const { taos } = this.props;
		const { taoDescription, thought, error, errorMessage, formLoading } = this.state;

		let tao = null;
		if (taos) {
			tao = taos.find((_tao) => _tao.taoId === id);
		}
		if (!tao || !taoDescription) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}
		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${id}`}>
					Back to TAO Details
				</Ahref>
				<Wrapper className="margin-bottom-20">
					<Title className="medium margin-top-20 margin-bottom-0">{tao.name}</Title>
					<Header>{id}</Header>
				</Wrapper>
				<Wrapper className="margin-bottom-20" dangerouslySetInnerHTML={{ __html: taoDescription }} />
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
				<Hr />
			</Wrapper>
		);
	}
}

export { ViewThoughts };
