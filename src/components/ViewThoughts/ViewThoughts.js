import * as React from "react";
import { Wrapper, Title, Header, Ahref, Hr } from "components/";
import { AddThoughtContainer } from "./AddThought/";
import { ListThoughtsContainer } from "./ListThoughts/";
import { get, encodeParams } from "utils/";

class ViewThoughts extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoDescription: null,
			thoughts: null
		};
		this.initialState = this.state;
		this.getTAOThoughts = this.getTAOThoughts.bind(this);
	}

	async componentDidMount() {
		await this.getTAODescription();
		await this.getTAOThoughts();
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getTAODescription();
			await this.getTAOThoughts();
		}
	}

	async getTAODescription() {
		const { id } = this.props.params;
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

	async getTAOThoughts() {
		const { id } = this.props.params;
		if (!id) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-tao-thoughts?${encodeParams({ taoId: id })}`);
			if (response.thoughts) {
				this.setState({ thoughts: response.thoughts });
			}
		} catch (e) {}
	}

	render() {
		const { id } = this.props.params;
		const { taos } = this.props;
		const { taoDescription, thoughts } = this.state;

		let tao = null;
		if (taos) {
			tao = taos.find((_tao) => _tao.taoId === id);
		}
		if (!tao || !taoDescription || !thoughts) {
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
				<AddThoughtContainer taoId={id} getTAOThoughts={this.getTAOThoughts} />
				<Hr />
				<ListThoughtsContainer thoughts={thoughts} />
			</Wrapper>
		);
	}
}

export { ViewThoughts };
