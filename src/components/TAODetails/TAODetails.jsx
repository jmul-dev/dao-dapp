import * as React from "react";

class TAODetails extends React.Component {
	render() {
		if (!this.props || !this.props.match) {
			return null;
		}
		const { id } = this.props.match.params;
		console.log(id);
		return <div>Hello</div>;
	}
}

export { TAODetails };
