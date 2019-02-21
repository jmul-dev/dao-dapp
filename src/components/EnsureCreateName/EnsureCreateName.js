import * as React from "react";
import { Wrapper } from "components/";
import { CreateNameFormContainer } from "components/CreateNameForm/";
import { TAOPlotContainer } from "components/TAOPlot/";
import { buildTAOTreeData } from "utils/";

class EnsureCreateName extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taoTreeData: null
		};
	}

	componentDidMount() {
		if (this.props.taos) {
			const taoTreeData = buildTAOTreeData(this.props.taos);
			this.setState({ taoTreeData });
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.taos !== prevProps.taos) {
			const taoTreeData = buildTAOTreeData(this.props.taos);
			this.setState({ taoTreeData });
		}
	}

	render() {
		return (
			<Wrapper>
				{!this.props.nameId ? (
					<CreateNameFormContainer />
				) : (
					<TAOPlotContainer taoData={this.state.taoTreeData} width={1200} height={800} />
				)}
			</Wrapper>
		);
	}
}

export { EnsureCreateName };
