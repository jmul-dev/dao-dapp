import * as React from "react";
import { Wrapper } from "components/";
import { CreateNameFormContainer } from "../CreateNameForm/";
import { DashboardContainer } from "../Dashboard/";

class EnsureCreateName extends React.Component {
	render() {
		return <Wrapper>{!this.props.nameId ? <CreateNameFormContainer /> : <DashboardContainer nameId={this.props.nameId} />}</Wrapper>;
	}
}

export { EnsureCreateName };
