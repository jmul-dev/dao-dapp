import * as React from "react";
import { Wrapper, Title, SchemaForm, Error, MediumEditor, Button, Ahref } from "components/";
import { FieldWrapper, Label, Select, MinLogos } from "./styledComponents";
import { schema } from "./schema";
import { getTransactionReceipt, waitForTransactionReceipt } from "utils/web3";
import { abi as TAOFactoryABI } from "contracts/TAOFactory.json";

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
			taoDescription: ""
		};
		this.initialState = this.state;
		this.handleParentChange = this.handleParentChange.bind(this);
		this.handleEditorChange = this.handleEditorChange.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	async componentDidMount() {
		if (this.props.nameId) {
			this.setState({ parentId: this.props.nameId });
		}
		await this.getCreateChildTAOMinLogos();
	}

	async componentDidUpdate(prevProps) {
		if (
			this.props.aoSetting !== prevProps.aoSetting ||
			this.props.settingTAOId !== prevProps.settingTAOId ||
			this.props.nameId !== prevProps.nameId
		) {
			this.setState(this.initialState);
			if (this.props.nameId) {
				this.setState({ parentId: this.props.nameId });
			}
			await this.getCreateChildTAOMinLogos();
		}
	}

	async getCreateChildTAOMinLogos() {
		const { aoSetting, settingTAOId } = this.props;
		if (!aoSetting || !settingTAOId) {
			return;
		}
		const [createChildTAOMinLogos] = await promisify(aoSetting.getSettingValuesByTAOName)(settingTAOId, "createChildTAOMinLogos");
		this.setState({ createChildTAOMinLogos, parentMinLogos: createChildTAOMinLogos });
	}

	async handleParentChange(event) {
		event.persist();
		const { nameId, taoAncestry } = this.props;
		if (!nameId || !taoAncestry) {
			return;
		}
		const { createChildTAOMinLogos } = this.state;
		if (event.target.value === nameId) {
			this.setState({ parentId: event.target.value, parentIsName: true, parentMinLogos: createChildTAOMinLogos });
		} else {
			const [, minLogos] = await promisify(taoAncestry.getAncestryById)(event.target.value);
			this.setState({ parentId: event.target.value, parentIsName: false, parentMinLogos: minLogos });
		}
	}

	handleEditorChange(taoDescription) {
		this.setState({ taoDescription });
	}

	handleFormChange(data) {
		const { formData } = data;
		this.setState({ formData });
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
		if (isExist) {
			this.setState({ error: true, errorMessage: "TAO name has been taken", formLoading: false });
			return;
		}
		if (taoDescription.length < 30) {
			this.setState({ error: true, errorMessage: "Description is too short (min. 30 chars)", formLoading: false });
			return;
		}
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
					waitForTransactionReceipt(transactionHash)
						.then(async () => {
							this.setState({
								error: false,
								errorMessage: "",
								formLoading: false,
								formData: this.formData,
								taoDescription: ""
							});
							const receipt = await getTransactionReceipt(transactionHash);
							const logs = abiDecoder.decodeLogs(receipt.logs);
							const createTAOEvent = logs.filter((log) => log && log.name === "CreateTAO");
							const taoIdArgs = createTAOEvent[0].events.filter((e) => e.name === "taoId");
							const taoId = taoIdArgs[0].value;
							this.props.setSuccess("Success!", `TAO # ${taoId} has been created`);
						})
						.catch((err) => {
							this.setState({ error: true, errorMessage: err.message, formLoading: false });
						});
				}
			}
		);
	}

	render() {
		const { error, errorMessage, formLoading, parentMinLogos, parentId, formData, taoDescription } = this.state;
		const { nameId, nameInfo, taos, taoCurrencyBalances } = this.props;
		if (!nameId || !nameInfo || !taos || !taoCurrencyBalances || !parentMinLogos) {
			return null;
		}

		const taoOptions = taos.map((tao) => (
			<option key={tao.taoId} value={tao.taoId}>
				{tao.name} ({tao.taoId})
			</option>
		));

		return (
			<Wrapper className="padding-40">
				<Title>Create a TAO</Title>
				<FieldWrapper>
					<Label>Which parent Name/TAO are you creating this new TAO from?*</Label>
					<Select className="form-control" onChange={this.handleParentChange}>
						<optgroup label="Name">
							<option key={nameId} value={nameId}>
								Yourself - {nameInfo.name} ({nameId})
							</option>
							)
						</optgroup>
						<optgroup label="TAO">{taoOptions}</optgroup>
					</Select>
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
