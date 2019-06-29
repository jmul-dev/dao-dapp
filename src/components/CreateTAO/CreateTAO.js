import * as React from "react";
import { Wrapper, Title, SchemaForm, Error, MediumEditor, Button, Ahref } from "components/";
import { FieldWrapper, Label, Select, MinLogos, SelectedParent } from "./styledComponents";
import { ProgressLoaderContainer } from "widgets/ProgressLoader/";
import { schema } from "./schema";
import { getTransactionReceipt, waitForTransactionReceipt } from "utils/web3";
import { abi as TAOFactoryABI } from "ao-contracts/build/contracts/TAOFactory.json";
import { insertTAODescription as graphqlInsertTAODescription } from "utils/graphql";
import { metamaskPopup } from "../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";
import { getNameLookup as graphqlGetNameLookup, insertNameLookup as graphqlInsertNameLookup } from "utils/graphql";

const promisify = require("tiny-promisify");
const abiDecoder = require("abi-decoder");
abiDecoder.addABI(TAOFactoryABI);

class CreateTAO extends React.Component {
	constructor(props) {
		super(props);
		this.formData = {
			taoName: "",
			childMinLogos: "",
			ethosCapStatus: "No",
			ethosCapAmount: ""
		};
		this.state = {
			error: false,
			errorMessage: "",
			formLoading: false,
			parentId: null,
			parentIsName: true,
			createChildTAOMinLogos: null,
			parentMinLogos: null,
			formData: this.formData,
			taoDescription: "",
			txHash: null
		};
		this.initialState = this.state;
		this.handleParentChange = this.handleParentChange.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		await this.getCreateChildTAOMinLogos();
		if (this.props.params.id) {
			this.setState({ parentId: this.props.params.id });
		} else {
			this.setState({ parentId: this.props.nameId });
		}
		this.setParentMinLogos(this.state.parentId);
	}

	async componentDidUpdate(prevProps) {
		if (
			this.props.aoSetting !== prevProps.aoSetting ||
			this.props.settingTAOId !== prevProps.settingTAOId ||
			this.props.nameId !== prevProps.nameId ||
			this.props.params.id !== prevProps.params.id
		) {
			this.setState(this.initialState);
			await this.getCreateChildTAOMinLogos();
			if (this.props.params.id) {
				this.setState({ parentId: this.props.params.id });
			} else {
				this.setState({ parentId: this.props.nameId });
			}
			this.setParentMinLogos(this.state.parentId);
		}
	}

	async getCreateChildTAOMinLogos() {
		const { aoSetting, settingTAOId } = this.props;
		if (!aoSetting || !settingTAOId) {
			return;
		}
		const [createChildTAOMinLogos] = await promisify(aoSetting.getSettingValuesByTAOName)(settingTAOId, "createChildTAOMinLogos");
		this.setState({ createChildTAOMinLogos });
	}

	async handleParentChange(event) {
		event.persist();
		await this.setParentMinLogos(event.target.value);
	}

	async setParentMinLogos(parentId) {
		const { nameId, taoAncestry } = this.props;
		if (!taoAncestry || !nameId || !parentId) {
			return;
		}
		const { createChildTAOMinLogos } = this.state;
		if (parentId === nameId) {
			this.setState({ parentId, parentIsName: true, parentMinLogos: createChildTAOMinLogos });
		} else {
			const [, minLogos] = await promisify(taoAncestry.getAncestryById)(parentId);
			this.setState({ parentId, parentIsName: false, parentMinLogos: minLogos });
		}
	}

	handleEditorChange(taoDescription) {
		this.setState({ taoDescription });
	}

	handleFormChange(data) {
		const { formData } = data;
		this.setState({ formData });
	}

	validate(formData, errors) {
		if (!formData.taoName.match(/^[a-zA-Z]+[a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/)) {
			errors.taoName.addError(
				"TAO name can only contain alphanumeric characters (letters A-Z, numbers 0-9) with the exception of underscores, spaces and hyphens."
			);
		}
		return errors;
	}

	async handleSubmit(data) {
		const { formData } = data;
		const { taoFactory, nameFactory, nameTAOLookup, accounts } = this.props;
		const { parentId, taoDescription } = this.state;
		if (!taoFactory || !nameFactory || !nameTAOLookup || !accounts || !formData || !parentId) {
			return;
		}
		this.setState({ formLoading: true });
		const isExist = await promisify(nameTAOLookup.isExist)(formData.taoName);
		let keyExist = false;
		try {
			const response = await graphqlGetNameLookup(formData.taoName);
			keyExist = response.data.nameLookup.id ? true : false;
		} catch (e) {}

		if (isExist || keyExist) {
			this.setState({ error: true, errorMessage: "TAO name has been taken", formLoading: false });
			return;
		}
		if (taoDescription.length < 30) {
			this.setState({ error: true, errorMessage: "Description is too short (min. 30 chars)", formLoading: false });
			return;
		}
		metamaskPopup();
		taoFactory.createTAO(
			formData.taoName,
			"",
			"",
			"",
			"",
			parentId,
			formData.childMinLogos,
			formData.ethosCapStatus === "Yes" ? 1 : 0,
			formData.ethosCapAmount ? formData.ethosCapAmount : 0,
			{ from: accounts[0] },
			(err, transactionHash) => {
				if (err) {
					this.setState({ error: true, errorMessage: err.message, formLoading: false });
				} else {
					this.setState({ txHash: transactionHash });
					waitForTransactionReceipt(transactionHash)
						.then(async () => {
							const receipt = await getTransactionReceipt(transactionHash);
							const logs = abiDecoder.decodeLogs(receipt.logs);
							const createTAOEvent = logs.filter((log) => log && log.name === "CreateTAO");
							const taoIdArgs = createTAOEvent[0].events.filter((e) => e.name === "taoId");
							const taoId = taoIdArgs[0].value;

							try {
								await graphqlInsertNameLookup(formData.taoName, taoId);
								setTimeout(async () => {
									const response = await graphqlInsertTAODescription(taoId, taoDescription);
									this.setState({
										error: false,
										errorMessage: "",
										formLoading: false,
										formData: this.formData,
										taoDescription: ""
									});
									if (!response.errors) {
										this.props.setSuccess(
											"Success!",
											<div>
												TAO # <Ahref to={`/tao/${taoId}`}>{taoId}</Ahref> was created successfully
											</div>
										);
									} else {
										this.props.setInfo(
											"Success!",
											<div>
												TAO # <Ahref to={`/tao/${taoId}`}>{taoId}</Ahref> was created successfully but there was a
												network congestion when inserting the TAO description. Click{" "}
												<Ahref to={`/tao/${taoId}`}>here</Ahref> to update the description manually
											</div>
										);
									}
								}, 500);
							} catch (e) {
								this.setState({
									error: false,
									errorMessage: "",
									formLoading: false,
									formData: this.formData,
									taoDescription: ""
								});
								this.props.setInfo(
									"Success!",
									<div>
										TAO # <Ahref to={`/tao/${taoId}`}>{taoId}</Ahref> was created successfully but there was a network
										congestion when inserting the TAO description. Click <Ahref to={`/tao/${taoId}`}>{taoId}</Ahref> to
										update the description manually
									</div>
								);
							}
						})
						.catch((err) => {
							this.setState({ error: true, errorMessage: err.message, formLoading: false });
						});
				}
			}
		);
	}

	render() {
		const { error, errorMessage, formLoading, parentMinLogos, parentId, formData, taoDescription, txHash } = this.state;
		const { pastEventsRetrieved, nameId, nameInfo, taos, taoCurrencyBalances } = this.props;
		if (!pastEventsRetrieved || !nameId || !nameInfo || !taos || !taoCurrencyBalances || !parentMinLogos) {
			return <ProgressLoaderContainer />;
		}
		const { id } = this.props.params;
		const taoOptions = taos.map((tao) => (
			<option key={tao.taoId} value={tao.taoId}>
				{tao.name} ({tao.taoId})
			</option>
		));

		let selectedParent = null;
		if (id) {
			if (id === nameId) {
				selectedParent = (
					<div>
						<Label>Parent Name</Label>
						<SelectedParent>
							Yourself - {nameInfo.name} ({nameId})
						</SelectedParent>
					</div>
				);
			} else if (taos) {
				const selectedTAO = taos.filter((tao) => tao.taoId === id);
				if (selectedTAO.length) {
					selectedParent = (
						<div>
							<Label>Parent TAO</Label>
							<SelectedParent>
								{selectedTAO[0].name} ({selectedTAO[0].taoId})
							</SelectedParent>
						</div>
					);
				}
			}
		}

		return (
			<Wrapper className="padding-40">
				<Title>Create TAO</Title>
				<FieldWrapper>
					{!id ? (
						<div>
							<Label>Which parent Name/TAO are you creating this new TAO from?*</Label>
							<Select className="form-control" onChange={this.handleParentChange}>
								<optgroup label="Name">
									<option key={nameId} value={nameId}>
										Yourself - {nameInfo.name} ({nameId})
									</option>
								</optgroup>
								<optgroup label="TAO">{taoOptions}</optgroup>
							</Select>
						</div>
					) : (
						<div>{selectedParent}</div>
					)}
				</FieldWrapper>
				<FieldWrapper>
					{parentId === nameId ? "Global" : "Parent TAO's"} minimum required Logos to create TAO:
					<MinLogos>{parentMinLogos && parentMinLogos.toNumber()}</MinLogos>
				</FieldWrapper>
				{taoCurrencyBalances.logos.gte(parentMinLogos) ? (
					<div>
						<SchemaForm
							className="full"
							schema={schema}
							formData={formData}
							onChange={this.handleFormChange}
							showErrorList={false}
							validate={this.validate}
							onSubmit={this.handleSubmit}
						>
							<Label>Describe the description for this TAO*</Label>
							<MediumEditor className="margin-bottom-20" text={taoDescription} onChange={this.handleEditorChange} />
							<Button type="submit" disabled={formLoading}>
								{formLoading ? "Loading..." : "Create"}
							</Button>
							<Ahref className="margin-left-20" to="/">
								Back to Dashboard
							</Ahref>
						</SchemaForm>
						{txHash && <TxHashContainer txHash={txHash} />}
						{error && errorMessage && <Error>{errorMessage}</Error>}
					</div>
				) : (
					<Error>You do not have enough Logos to create a TAO of this parent</Error>
				)}
			</Wrapper>
		);
	}
}

export { CreateTAO };
