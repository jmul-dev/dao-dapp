import * as React from "react";
import { Wrapper, Title, Ahref, FieldContainer, FieldName, FieldValue, Button, Error } from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class ChallengeTAOAdvocate extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			advocateId: null,
			advocateLogos: null,
			dataPopulated: false,
			error: false,
			errorMessage: "",
			formLoading: false
		};
		this.initialState = this.state;
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		this._isMounted = true;
		await this.getData();
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	async componentDidUpdate(prevProps) {
		if (this.props.params.id !== prevProps.params.id) {
			if (this._isMounted) {
				this.setState(this.initialState);
			}
			await this.getData();
		}
	}

	async getData() {
		await this.getTAOInfo();
		await this.getTAOAdvocate();
		if (this._isMounted) {
			this.setState({ dataPopulated: true });
		}
	}

	async getTAOInfo() {
		const { id } = this.props.params;
		const { taoFactory } = this.props;
		if (!taoFactory || !id) {
			return;
		}

		const _taoInfo = await promisify(taoFactory.getTAO)(id);
		const taoInfo = {
			name: _taoInfo[0]
		};
		if (this._isMounted) {
			this.setState({ taoInfo });
		}
	}

	async getTAOAdvocate() {
		const { id } = this.props.params;
		const { nameTAOPosition, logos } = this.props;
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
						console.log("Challenge created");
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
		const { id } = this.props.params;
		const { taoInfo, advocateId, advocateLogos, dataPopulated, error, errorMessage, formLoading } = this.state;
		const { pastEventsRetrieved, names, nameId, taoCurrencyBalances } = this.props;
		if (!pastEventsRetrieved || !names || !nameId || !taoCurrencyBalances || !dataPopulated) {
			return <ProgressLoaderContainer />;
		}

		const advocate = names.find((name) => name.nameId === advocateId);
		const challenger = names.find((name) => name.nameId === nameId);
		return (
			<Wrapper className="padding-40">
				<Ahref className="small" to={`/tao/${id}`}>
					Back to TAO Details
				</Ahref>
				<Wrapper className="margin-bottom-20">
					<Title className="medium margin-top-20 margin-bottom-0">Challenge {taoInfo.name}'s Advocate</Title>
				</Wrapper>
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
	}
}

export { ChallengeTAOAdvocate };
