import * as React from "react";
import { Wrapper } from "./styledComponents";
import { CreateNameFormContainer } from "../CreateNameForm/";
import { Dashboard } from "../Dashboard";

class EnsureCreateName extends React.Component {
	render() {
		return <Wrapper>{!this.props.nameId ? <CreateNameFormContainer /> : <Dashboard nameId={this.props.nameId} />}</Wrapper>;
	}
}

export { EnsureCreateName };
