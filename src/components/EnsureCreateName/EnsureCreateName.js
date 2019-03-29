import * as React from "react";
import { Wrapper } from "components/";
import { CreateNameFormContainer } from "components/CreateNameForm/";
import { TAOPlotContainer } from "components/TAOPlot/";
import { buildTAOTreeData } from "utils/";

class EnsureCreateName extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			taoTreeData: null
		};
	}

	componentDidMount() {
		this._isMounted = true;
		if (this.props.taos) {
			const taoTreeData = buildTAOTreeData(this.props.taos);
			if (this._isMounted) {
				this.setState({ taoTreeData });
			}
		}
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	componentDidUpdate(prevProps) {
		if (this.props.taos !== prevProps.taos) {
			const taoTreeData = buildTAOTreeData(this.props.taos);
			if (this._isMounted) {
				this.setState({ taoTreeData });
			}
		}
	}

	render() {
		const { pastEventsRetrieved, nameId } = this.props;
		const { taoTreeData } = this.state;
		if (!nameId) {
			return <CreateNameFormContainer />;
		} else if (!pastEventsRetrieved) {
			return <Wrapper className="padding-40">Loading...</Wrapper>;
		} else {
			return <TAOPlotContainer taoData={taoTreeData} width={1200} height={800} />;
		}
	}
}

export { EnsureCreateName };
