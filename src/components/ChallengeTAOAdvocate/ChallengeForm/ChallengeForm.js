import * as React from "react";
import { Wrapper, FieldContainer, FieldName, FieldValue, Button, Error } from "components/";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class ChallengeForm extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			advocateId: null,
			advocateLogos: null,
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.initialState = this.state;
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		this._isMounted = true;
		await this.getTAOAdvocate();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps) {
		if (this.props.id !== prevProps.id) {
			if (this._isMounted) {
				this.setState(this.initialState);
			}
			await this.getTAOAdvocate();
		}
	}

	async getTAOAdvocate() {
		const { nameTAOPosition, logos, id } = this.props;
		if (!nameTAOPosition || !logos || !id) {
			return;
		}

		const advocateId = await promisify(nameTAOPosition.getAdvocate)(id);
		const advocateLogos = await promisify(logos.sumBalanceOf)(advocateId);
		if (this._isMounted) {
			this.setState({ advocateId, advocateLogos });
		}
	}

	async handleSubmit() {
		const { nameTAOPosition, logos, accounts, nameId } = this.props;
		const { id } = this.props.params;
		const { advocateId } = this.state;
		if (!nameTAOPosition || !logos || !accounts || !nameId || !id || !advocateId) {
			return;
		}
		if (this._isMounted) {
			this.setState({ formLoading: true });
		}
		const advocateLogos = await promisify(logos.sumBalanceOf)(advocateId);
		const challengerLogos = await promisify(logos.sumBalanceOf)(nameId);
		if (advocateLogos.gt(challengerLogos)) {
			if (this._isMounted) {
				this.setState({
					error: true,
					errorMessage: "You don't have enough Logos to challenge this TAO's Advocate",
					formLoading: false
				});
			}
			return;
		}
		nameTAOPosition.challengeTAOAdvocate(id, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				if (this._isMounted) {
					this.setState({ error: true, errorMessage: err.message, formLoading: false });
				}
			} else {
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
		const { advocateId, advocateLogos, error, errorMessage, formLoading } = this.state;
		const { id, taoInfo, names, nameId, taoCurrencyBalances } = this.props;
		if (!id || !taoInfo || !names || !nameId || !taoCurrencyBalances || !advocateId) {
			return null;
		}

		const advocate = names.find((name) => name.nameId === advocateId);
		const challenger = names.find((name) => name.nameId === nameId);

		if (advocateId !== nameId) {
			return (
				<Wrapper>
					<Wrapper>
						In order to challenge and replace {taoInfo.name} as the new Advocate, you need to have more Logos than it's current
						Advocate ({advocate.name}).
					</Wrapper>
					<FieldContainer className="margin-top-20">
						<FieldName className="big">{advocate.name}'s Logos (Current Advocate)</FieldName>
						<FieldValue className="big">{advocateLogos.toNumber()}</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName className="big">{challenger.name}'s Logos (Challenger)</FieldName>
						<FieldValue className="big">{taoCurrencyBalances.logos.toNumber()}</FieldValue>
					</FieldContainer>
					<Wrapper className="margin-top-20">
						{taoCurrencyBalances.logos.gt(advocateLogos) ? (
							<Button type="button" onClick={this.handleSubmit}>
								{formLoading ? "Loading..." : "Challenge"}
							</Button>
						) : (
							<Wrapper>You don't have enough Logos to challenge this TAO's Advocate</Wrapper>
						)}
					</Wrapper>
					{error && errorMessage && <Error>{errorMessage}</Error>}
				</Wrapper>
			);
		} else {
			return <Wrapper>You're the current Advocate of this TAO</Wrapper>;
		}
	}
}

export { ChallengeForm };
