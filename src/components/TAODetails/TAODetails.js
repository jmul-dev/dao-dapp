import * as React from "react";
import { Wrapper, Ahref, MediumEditor } from "components/";
import { TAOName } from "./TAOName/";
import { PositionDetails } from "./PositionDetails/";
import { get, encodeParams } from "utils/";

const promisify = require("tiny-promisify");

class TAODetails extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			taoDescription: null,
			position: null,
			ancestry: null
		};
		this.initialState = this.state;
	}

	async componentDidMount() {
		await this.getTAOInfo(this.props.params.id);
		await this.getTAODescription(this.props.params.id);
		await this.getTAOPosition(this.props.params.id);
		await this.getTAOAncestry(this.props.params.id);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			this.setState(this.initialState);
			await this.getTAOInfo(this.props.params.id);
			await this.getTAODescription(this.props.params.id);
			await this.getTAOPosition(this.props.params.id);
			await this.getTAOAncestry(this.props.params.id);
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
		const { nameTAOPosition, aoLibrary } = this.props;
		if (!nameTAOPosition || !aoLibrary || !id) {
			return;
		}

		const _position = await promisify(nameTAOPosition.getPositionById)(id);
		const position = {
			advocate: {
				name: _position[0],
				id: _position[1],
				isTAO: false
			},
			listener: {
				name: _position[2],
				id: _position[3],
				isTAO: false
			},
			speaker: {
				name: _position[4],
				id: _position[5],
				isTAO: false
			}
		};
		position.advocate.isTAO = await promisify(aoLibrary.isTAO)(position.advocate.id);
		position.listener.isTAO = await promisify(aoLibrary.isTAO)(position.listener.id);
		position.speaker.isTAO = await promisify(aoLibrary.isTAO)(position.speaker.id);
		this.setState({ position });
	}

	async getTAOAncestry(id) {
		const { taoAncestry } = this.props;
		if (!taoAncestry || !id) {
			return;
		}

		const _ancestry = await promisify(taoAncestry.getAncestryById)(id);
		const ancestry = {
			parentId: _ancestry[0],
			childMinLogos: _ancestry[1],
			totalChildren: _ancestry[2]
		};
		this.setState({ ancestry });
	}

	render() {
		const { id } = this.props.params;
		const { taoInfo, taoDescription, position, ancestry } = this.state;
		if (!taoInfo || !taoDescription || !position || !ancestry) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}

		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to="/">
					Back to Dashboard
				</Ahref>
				<TAOName id={id} name={taoInfo.name} />
				<MediumEditor text={taoDescription} />
				<PositionDetails position={position} />
			</Wrapper>
		);
	}
}

export { TAODetails };
