import * as React from "react";
import { Wrapper, ImgContainer } from "./styledComponents";
import { CreateNameFormContainer } from "../CreateNameForm/";
import { Dashboard } from "../Dashboard";
import { EMPTY_ADDRESS } from "../../common/constants";

const promisify = require("tiny-promisify");

class EnsureCreateName extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			getNameIdCalled: false
		};
	}

	async componentDidMount() {
		await this.getNameId(this.props.nameFactory, this.props.accounts);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.nameFactory !== prevProps.nameFactory || this.props.nameId !== prevProps.nameId) {
			this.getNameId(this.props.nameFactory, this.props.accounts);
		}
	}

	async getNameId(nameFactory, accounts) {
		if (!nameFactory || !accounts) {
			return;
		}
		const nameId = await promisify(nameFactory.ethAddressToNameId)(accounts[0]);
		if (nameId !== EMPTY_ADDRESS) {
			this.props.setNameId(nameId);
		}
		this.setState({ getNameIdCalled: true });
	}

	render() {
		return (
			<Wrapper>
				{!this.state.getNameIdCalled ? (
					<ImgContainer>
						<img src={process.env.PUBLIC_URL + "/images/img_0.png"} alt={"AO Logo"} />
					</ImgContainer>
				) : !this.props.nameId ? (
					<CreateNameFormContainer />
				) : (
					<Dashboard nameId={this.props.nameId} />
				)}
			</Wrapper>
		);
	}
}

export { EnsureCreateName };
