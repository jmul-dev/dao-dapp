import * as React from "react";
import {
	Wrapper,
	Title,
	Header,
	Ahref,
	LeftContainer,
	RightContainer,
	FieldContainer,
	FieldName,
	FieldValue,
	Button,
	Error
} from "components/";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { BarChart } from "widgets/BarChart/";
import { waitForTransactionReceipt } from "utils/web3";
import { hashHistory } from "react-router";
import { metamaskPopup } from "../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";

const promisify = require("tiny-promisify");

class ParentReplaceTAOAdvocate extends React.Component {
	_isMounted = false;

	constructor(props) {
		super(props);
		this.state = {
			taoInfo: null,
			advocateId: null,
			advocateLogos: null,
			isAdvocateOfParent: null,
			dataPopulated: false,
			error: false,
			errorMessage: "",
			formLoading: false,
			txHash: null
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
		} else if (this.props.taoPositions !== prevProps.taoPositions || this.props.taoCurrencyBalances !== prevProps.taoCurrencyBalances) {
			await this.getTAOAdvocate();
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
		const { nameTAOPosition, logos, accounts } = this.props;
		if (!nameTAOPosition || !logos || !accounts || !id) {
			return;
		}

		const isAdvocateOfParent = await promisify(nameTAOPosition.senderIsAdvocateOfParent)(accounts[0], id);
		const advocateId = await promisify(nameTAOPosition.getAdvocate)(id);
		const advocateLogos = await promisify(logos.sumBalanceOf)(advocateId);
		if (this._isMounted) {
			this.setState({ isAdvocateOfParent, advocateId, advocateLogos });
		}
	}

	async handleSubmit() {
		const { id } = this.props.params;
		const { nameTAOPosition, logos, accounts, nameId } = this.props;
		const { advocateId } = this.state;
		if (!nameTAOPosition || !logos || !accounts || !nameId || !id || !advocateId) {
			return;
		}
		if (this._isMounted) {
			this.setState({ formLoading: true });
		}

		const isAdvocateOfParent = await promisify(nameTAOPosition.senderIsAdvocateOfParent)(accounts[0], id);
		if (!isAdvocateOfParent && this._isMounted) {
			this.setState({
				error: true,
				errorMessage: "You are not the Advocate of TAO's parent",
				formLoading: false
			});
			return;
		}
		const advocateLogos = await promisify(logos.sumBalanceOf)(advocateId);
		const parentAdvocateLogos = await promisify(logos.sumBalanceOf)(nameId);
		if (advocateLogos.gt(parentAdvocateLogos) && this._isMounted) {
			this.setState({
				error: true,
				errorMessage: "You don't have enough Logos to replace this TAO's Advocate",
				formLoading: false
			});
			return;
		}
		metamaskPopup();
		nameTAOPosition.parentReplaceChildAdvocate(id, { from: accounts[0] }, (err, transactionHash) => {
			if (err && this._isMounted) {
				this.setState({ error: true, errorMessage: err.message, formLoading: false });
			} else {
				this.setState({ txHash: transactionHash });
				waitForTransactionReceipt(transactionHash)
					.then(async () => {
						if (this._isMounted) {
							this.setState({ error: false, errorMessage: "", formLoading: false });
						}

						setTimeout(() => {
							hashHistory.push(`/tao/${id}`);
						}, 2000);
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
		const {
			taoInfo,
			advocateId,
			advocateLogos,
			isAdvocateOfParent,
			dataPopulated,
			error,
			errorMessage,
			formLoading,
			txHash
		} = this.state;
		const { pastEventsRetrieved, names, nameId, taoCurrencyBalances } = this.props;
		if (!pastEventsRetrieved || !names || !nameId || !taoCurrencyBalances || !dataPopulated) {
			return <ProgressLoaderContainer />;
		}

		const advocate = names.find((name) => name.nameId === advocateId);
		const parentAdvocate = names.find((name) => name.nameId === nameId);

		const losingColor = "rgba(220, 220, 220, 0.2)";
		const winningColor = "rgba(0, 204, 71, 0.8)";
		const logosData = {
			labels: ["Current Advocate", "Parent Advocate"],
			datasets: [
				{
					fillColor: [
						advocateLogos.gt(taoCurrencyBalances.logos) ? winningColor : losingColor,
						taoCurrencyBalances.logos.gt(advocateLogos) ? winningColor : losingColor
					],
					data: [advocateLogos.toNumber(), taoCurrencyBalances.logos.toNumber()]
				}
			]
		};

		if (nameId === advocateId) {
			return (
				<Wrapper className="padding-40">
					<Ahref className="small" to={`/tao/${id}`}>
						Back to TAO Details
					</Ahref>
					<Wrapper className="margin-top-20">You are the current Advocate of {taoInfo.name}</Wrapper>
				</Wrapper>
			);
		} else if (!isAdvocateOfParent) {
			return (
				<Wrapper className="padding-40">
					<Ahref className="small" to={`/tao/${id}`}>
						Back to TAO Details
					</Ahref>
					<Wrapper className="margin-top-20">
						Oops! Only the Advocate of {taoInfo.name}'s parent has access to this feature
					</Wrapper>
				</Wrapper>
			);
		} else {
			return (
				<Wrapper className="padding-40">
					<Ahref className="small" to={`/tao/${id}`}>
						Back to TAO Details
					</Ahref>
					<Wrapper className="margin-bottom-20">
						<Title className="medium margin-top-20 margin-bottom-0">Replace {taoInfo.name}'s Advocate</Title>
					</Wrapper>
					<Header>
						In order to replace {taoInfo.name} as the new Advocate, you need to have higher Logos than it's current Advocate (
						{advocate.name}).
					</Header>
					<Wrapper className="margin-top-20">
						<LeftContainer>
							<FieldContainer className="margin-top-20">
								<FieldName className="big">{advocate.name}'s Logos (Current Advocate)</FieldName>
								<FieldValue className={advocateLogos.gt(taoCurrencyBalances.logos) ? "big green" : "big"}>
									{advocateLogos.toNumber()}
								</FieldValue>
							</FieldContainer>
							<FieldContainer>
								<FieldName className="big">{parentAdvocate.name}'s Logos (Parent Advocate)</FieldName>
								<FieldValue className={taoCurrencyBalances.logos.gt(advocateLogos) ? "big green" : "big"}>
									{taoCurrencyBalances.logos.toNumber()}
								</FieldValue>
							</FieldContainer>
							<Wrapper className="margin-top-20">
								{taoCurrencyBalances.logos.gt(advocateLogos) ? (
									<Button type="button" onClick={this.handleSubmit}>
										{formLoading ? "Loading..." : "Replace Advocate"}
									</Button>
								) : (
									<Wrapper>You don't have enough Logos to replace this TAO's Advocate</Wrapper>
								)}
								{txHash && <TxHashContainer txHash={txHash} />}
							</Wrapper>
							{error && errorMessage && <Error>{errorMessage}</Error>}
						</LeftContainer>
						<RightContainer>
							<BarChart title={`Logos Chart`} data={logosData} height={300} />
						</RightContainer>
					</Wrapper>
				</Wrapper>
			);
		}
	}
}

export { ParentReplaceTAOAdvocate };
