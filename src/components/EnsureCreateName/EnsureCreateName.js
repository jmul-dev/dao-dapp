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
		const { pastEventsRetrieved, nameId } = this.props;
		const { taoTreeData } = this.state;
		if (!pastEventsRetrieved) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		}
		return (
			<Wrapper>
				{!nameId ? <CreateNameFormContainer /> : <TAOPlotContainer taoData={taoTreeData} width={1200} height={800} />}
			</Wrapper>
		);
	}
}

export { EnsureCreateName };
