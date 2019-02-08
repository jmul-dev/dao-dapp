import * as React from "react";
import { Wrapper, Title, StyledForm, Error } from "./styledComponents";
import { schema } from "./schema";
import { waitForTransactionReceipt } from "../../reducers/contractReducer";
import { setError } from "../../widgets/Toast/actions";

const promisify = require("tiny-promisify");

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: false, errorMessage: "" };
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { nameFactory, nameTAOLookup, accounts } = this.props;
		if (!nameFactory || !nameTAOLookup || !accounts || !formData) {
			return;
		}
		const isExist = await promisify(nameTAOLookup.isExist)(formData.username);
		if (isExist) {
			this.setState({ error: true, errorMessage: "Username has been taken" });
			return;
		}
		nameFactory.createName(formData.username, "", "", "", "", { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				setError(err);
			} else {
				let eventListener = nameFactory.CreateName({ ethAddress: accounts[0] });
				eventListener.watch((err, result) => {
					if (result && result.transactionHash === transactionHash) {
						this.props.setNameId(result.args.nameId);
						eventListener.stopWatching();
					}
				});
				waitForTransactionReceipt(transactionHash).then(() => {
					eventListener.stopWatching();
				});
			}
		});
	}

	render() {
		const { error, errorMessage } = this.state;
		return (
			<Wrapper>
				<Title>Choose a Username</Title>
				<StyledForm schema={schema} onSubmit={this.handleSubmit} />
				{error && errorMessage && <Error>{errorMessage}</Error>}
			</Wrapper>
		);
	}
}

export { Signup };
