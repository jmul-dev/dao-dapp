import * as React from "react";
import { Wrapper, Ahref, MediumEditor } from "components/";
import { TAOName } from "./TAOName/";
import { get, encodeParams } from "utils/";

const promisify = require("tiny-promisify");

class TAODetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			taoDescription: null,
			position: null
		};
		this.initialState = this.state;
		this.handleEditorChange = this.handleEditorChange.bind(this);
	}

	async componentDidMount() {
		await this.getTAOInfo(this.props.params.id);
		await this.getTAODescription(this.props.params.id);
		await this.getTAOPosition(this.props.params.id);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getTAOInfo(this.props.params.id);
			await this.getTAODescription(this.props.params.id);
			await this.getTAOPosition(this.props.params.id);
		}
	}

	async getTAOInfo(id) {
		const { taoFactory } = this.props;
		if (!taoFactory || !id) {
			return;
		}

		const _taoInfo = await promisify(taoFactory.getTAO)(id);
		const taoInfo = {
			name: _taoInfo[0]
		};
		this.setState({ taoInfo });
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

	async getTAOPosition(id) {
		const { nameTAOPosition } = this.props;
		if (!nameTAOPosition || !id) {
			return;
		}

		const _position = await promisify(nameTAOPosition.getPositionById)(id);
		const position = {
			advocateName: _position[0],
			advocateId: _position[1],
			listenerName: _position[2],
			listenerId: _position[3],
			speakerName: _position[4],
			speakerId: _position[5]
		};
		this.setState({ position });
	}

	handleEditorChange(taoDescription) {
		this.setState({ taoDescription });
	}

	render() {
		const { id } = this.props.params;
		const { taoInfo, taoDescription, position } = this.state;
		if (!taoInfo || !taoDescription || !position) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to="/">
					Back to Dashboard
				</Ahref>
				<TAOName id={id} name={taoInfo.name} />
				<MediumEditor text={taoDescription} onChange={this.handleEditorChange} />
			</Wrapper>
		);
	}
}

export { TAODetails };
