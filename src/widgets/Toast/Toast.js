import * as React from "react";
import { Alert, AlertContainer } from "react-bs-notifier";

class Toast extends React.Component {
	constructor(props) {
		super(props);
		this.state = { visible: false };

		this.onDismiss = this.onDismiss.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.message !== prevProps.message || this.props.headline !== prevProps.headline) {
			this.setState({ visible: true });

			if (!this.props.persisted) {
				setTimeout(() => {
					this.setState({ visible: false });
				}, 5000);
			}
		}
	}

	onDismiss() {
		this.props.handleClearToast();
		this.setState({ visible: false });
	}

	render() {
		return (
			<AlertContainer position="top-right">
				{this.props.message && this.state.visible && (
					<Alert type={this.props.type} headline={this.props.headline} onDismiss={this.onDismiss}>
						{this.props.message}
					</Alert>
				)}
			</AlertContainer>
		);
	}
}

export { Toast };
