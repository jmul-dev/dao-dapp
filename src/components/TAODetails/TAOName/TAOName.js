import * as React from "react";
import { Wrapper, Title, Header, Ahref, Icon, LeftContainer, RightContainer } from "components/";
import { AddTAODescriptionFormContainer } from "./AddTAODescriptionForm/";
import { waitForTransactionReceipt } from "utils/web3";
import { metamaskPopup } from "../../../utils/electron";
import { TxHashContainer } from "widgets/TxHash/";

const promisify = require("tiny-promisify");

class TAOName extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showAddTAODescriptionForm: false,
			formLoading: false,
			txHash: null
		};
		this.approveTAO = this.approveTAO.bind(this);
		this.toggleAddTAODescriptionForm = this.toggleAddTAODescriptionForm.bind(this);
	}

	toggleAddTAODescriptionForm() {
		this.setState({ showAddTAODescriptionForm: !this.state.showAddTAODescriptionForm });
	}

	async approveTAO() {
		const { formLoading } = this.state;
		const { id, parentId, name, accounts, taoAncestry } = this.props;
		if (!id || !parentId || !name || !accounts || !taoAncestry || formLoading) {
			return;
		}
		this.setState({ formLoading: true });

		// Validation
		const isNotApprovedChild = await promisify(taoAncestry.isNotApprovedChild)(parentId, id);
		if (!isNotApprovedChild) {
			this.props.setError("Error!", `${name} no longer needs approval`);
			return;
		}
		metamaskPopup();
		taoAncestry.approveChild(parentId, id, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ formLoading: false });
				this.props.setError("Error!", err.message);
			} else {
				this.setState({ txHash: transactionHash });
				waitForTransactionReceipt(transactionHash)
					.then(() => {
						this.setState({ formLoading: false });
						this.props.setSuccess("Success!", `${name} was approved successfully`);
					})
					.catch((err) => {
						this.setState({ formLoading: false });
						this.props.setError("Error!", err.message);
					});
			}
		});
	}

	render() {
		const { id, name, singlePageView, needApproval, taoDescriptions, isAdvocate, isAdvocateOfParent } = this.props;
		const { showAddTAODescriptionForm, txHash } = this.state;
		if (!id || !name) {
			return null;
		}
		const actionContent = (
			<Wrapper>
				{isAdvocate && (
					<Icon className="animated bounceIn" onClick={this.toggleAddTAODescriptionForm}>
						<img src={process.env.PUBLIC_URL + "/images/edit.png"} alt={"Write New Description"} />
						<div>Write New Description</div>
					</Icon>
				)}
				{!isAdvocate && [
					!isAdvocateOfParent ? (
						<Ahref className="white" to={`/challenge-tao-advocate/${id}/`} key="challenge">
							<Icon className="animated bounceIn">
								<img src={process.env.PUBLIC_URL + "/images/challenge-advocate.png"} alt={"Challenge Advocate"} />
								<div>Challenge Advocate</div>
							</Icon>
						</Ahref>
					) : (
						<Ahref className="white" to={`/parent-replace-tao-advocate/${id}/`} key="parent-replace">
							<Icon className="animated bounceIn">
								<img src={process.env.PUBLIC_URL + "/images/challenge-advocate.png"} alt={"Parent Replace Advocate"} />
								<div>Parent Replace Advocate</div>
							</Icon>
						</Ahref>
					)
				]}
				{needApproval && (
					<Icon className="animated bounceIn" onClick={this.approveTAO}>
						<img src={process.env.PUBLIC_URL + "/images/approve_child_tao.png"} alt={"Approve TAO"} />
						<div>Approve TAO</div>
					</Icon>
				)}
				<Ahref className="white" to={`/create-tao/${id}/`}>
					<Icon className="animated bounceIn">
						<img src={process.env.PUBLIC_URL + "/images/create_child_tao.png"} alt={"Create Child TAO"} />
						<div>Create Child TAO</div>
					</Icon>
				</Ahref>
				<Ahref className="white" to={`/view-thoughts/${id}/`}>
					<Icon className="animated bounceIn">
						<img src={process.env.PUBLIC_URL + "/images/view_thoughts.png"} alt={"View Thoughts"} />
						<div>View Thoughts</div>
					</Icon>
				</Ahref>
				<Ahref className="white" to={`/view-timeline/${id}/`}>
					<Icon className="animated bounceIn">
						<img src={process.env.PUBLIC_URL + "/images/timeline.png"} alt={"View Timeline"} />
						<div>View Timeline</div>
					</Icon>
				</Ahref>
				<Ahref className="white" to={`/meet/${id}/`}>
					<Icon className="animated bounceIn">
						<img src={process.env.PUBLIC_URL + "/images/video_call.png"} alt={"Video Call"} />
						<div>Video Call</div>
					</Icon>
				</Ahref>
				<Ahref className="white" to={`/ide/${id}/`}>
					<Icon className="animated bounceIn last-child">
						<img src={process.env.PUBLIC_URL + "/images/open_ide.png"} alt={"Open IDE"} />
						<div>Open IDE</div>
					</Icon>
				</Ahref>
				{txHash && <TxHashContainer txHash={txHash} />}
			</Wrapper>
		);

		if (!showAddTAODescriptionForm) {
			if (singlePageView) {
				return (
					<Wrapper>
						<Wrapper className="margin-bottom-20">
							<LeftContainer>
								<Title className={`medium margin-bottom-0 ${singlePageView ? "margin-top-20" : ""}`}>{name}</Title>
								<Header>{id}</Header>
							</LeftContainer>
							<RightContainer className="right">{actionContent}</RightContainer>
						</Wrapper>
						{taoDescriptions && taoDescriptions.length > 0 && (
							<Wrapper className="margin-bottom-20" dangerouslySetInnerHTML={{ __html: taoDescriptions[0].value }} />
						)}
					</Wrapper>
				);
			} else {
				return (
					<Wrapper>
						<Wrapper className="margin-bottom-20">
							<Title className={`medium margin-bottom-0 ${singlePageView ? "margin-top-20" : ""}`}>{name}</Title>
							<Header>{id}</Header>
						</Wrapper>
						{taoDescriptions && taoDescriptions.length > 0 && (
							<Wrapper className="margin-bottom-20" dangerouslySetInnerHTML={{ __html: taoDescriptions[0].value }} />
						)}
						{actionContent}
					</Wrapper>
				);
			}
		} else {
			return (
				<AddTAODescriptionFormContainer
					id={id}
					name={name}
					toggleAddTAODescriptionForm={this.toggleAddTAODescriptionForm}
					getTAODescriptions={this.props.getTAODescriptions}
				/>
			);
		}
	}
}

export { TAOName };
