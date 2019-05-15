import * as React from "react";
import { Wrapper, FieldContainer, FieldName, FieldValue, Button, Error } from "components/";
import { waitForTransactionReceipt } from "utils/web3";
import { metamaskPopup } from "../../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";

const promisify = require("tiny-promisify");

class ChallengeForm extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false,
			txHash: null
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async handleSubmit() {
		const { nameTAOPosition, advocate, logos, accounts, nameId, id } = this.props;
		if (!nameTAOPosition || !logos || !accounts || !nameId || !id || !advocate) {
			return;
		}
		if (this._isMounted) {
			this.setState({ formLoading: true });
		}
		const advocateLogos = await promisify(logos.sumBalanceOf)(advocate.nameId);
		const challengerLogos = await promisify(logos.sumBalanceOf)(nameId);
		if (advocateLogos.gt(challengerLogos) && this._isMounted) {
			this.setState({
				error: true,
				errorMessage: "You don't have enough Logos to challenge this TAO's Advocate",
				formLoading: false
			});
			return;
		}
		metamaskPopup();
		nameTAOPosition.challengeTAOAdvocate(id, { from: accounts[0] }, (err, transactionHash) => {
			if (err && this._isMounted) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				this.setState({ txHash: transactionHash });
				waitForTransactionReceipt(transactionHash)
					.then(async () => {
						if (this._isMounted) {
							this.setState({ error: false, errorMessage: "", formLoading: false });
						}
					})
					.catch((err) => {
						if (this._isMounted) {
							this.setState({ error: true, errorMessage: err.message, formLoading: false });
						}
					});
			}
		});
	}

	render() {
		const { error, errorMessage, formLoading, txHash } = this.state;
		const { id, taoInfo, advocate, challenger, nameId } = this.props;
		if (!id || !taoInfo || !advocate || !challenger || !nameId) {
			return null;
		}

		if (advocate.nameId !== nameId) {
			return (
				<Wrapper>
					<Wrapper>
						In order to challenge and replace {taoInfo.name} as the new Advocate, you need to have higher Logos than it's
						current Advocate ({advocate.name}).
					</Wrapper>
					<FieldContainer className="margin-top-20">
						<FieldName className="big">{advocate.name}'s Logos (Current Advocate)</FieldName>
						<FieldValue className={advocate.logos.gt(challenger.logos) ? "big green" : "big"}>
							{advocate.logos.toNumber()}
						</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName className="big">{challenger.name}'s Logos (Challenger)</FieldName>
						<FieldValue className={challenger.logos.gt(advocate.logos) ? "big green" : "big"}>
							{challenger.logos.toNumber()}
						</FieldValue>
					</FieldContainer>
					<Wrapper className="margin-top-20">
						{challenger.logos.gt(advocate.logos) ? (
							<Button type="button" onClick={this.handleSubmit}>
								{formLoading ? "Loading..." : "Challenge"}
							</Button>
						) : (
							<Wrapper>You don't have enough Logos to challenge this TAO's Advocate</Wrapper>
						)}
					</Wrapper>
					{txHash && <TxHashContainer txHash={txHash} />}
					{error && errorMessage && <Error>{errorMessage}</Error>}
				</Wrapper>
			);
		} else {
			return <Wrapper>You're the current Advocate of this TAO</Wrapper>;
		}
	}
}

export { ChallengeForm };
