import * as React from "react";
import { Wrapper, Title, Header, Ahref, Icon, LeftContainer, RightContainer } from "components/";
import { waitForTransactionReceipt } from "utils/web3";

const promisify = require("tiny-promisify");

class TAOName extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formLoading: false
		};
		this.approveTAO = this.approveTAO.bind(this);
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
		taoAncestry.approveChild(parentId, id, { from: accounts[0] }, (err, transactionHash) => {
			if (err) {
				this.setState({ formLoading: false });
				this.props.setError("Error!", err.message);
			} else {
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
		const { id, name, singlePageView, needApproval } = this.props;
		if (!id || !name) {
			return null;
		}
		return (
			<Wrapper className="margin-bottom-20">
				<LeftContainer>
					<Title className={`medium margin-bottom-0 ${singlePageView ? "margin-top-20" : ""}`}>{name}</Title>
					<Header>{id}</Header>
				</LeftContainer>
				<RightContainer className="right">
					{needApproval && (
						<Icon className="animated bounceIn" onClick={this.approveTAO}>
							<img src={process.env.PUBLIC_URL + "/images/approve_child_tao.png"} alt={"Approve TAO"} />
							<div>Approve TAO</div>
						</Icon>
					)}
					<Ahref className="white" to={`/view-thoughts/${id}/`}>
						<Icon className="animated bounceIn">
							<img src={process.env.PUBLIC_URL + "/images/view_thoughts.png"} alt={"View Thoughts"} />
							<div>View Thoughts</div>
						</Icon>
					</Ahref>
					<Ahref className="white" to={`/create-tao/${id}/`}>
						<Icon className="animated bounceIn">
							<img src={process.env.PUBLIC_URL + "/images/create_child_tao.png"} alt={"Create Child TAO"} />
							<div>Create Child TAO</div>
						</Icon>
					</Ahref>
					<Ahref className="white" to={`/meet/${id}/`}>
						<Icon className="animated bounceIn">
							<img src={process.env.PUBLIC_URL + "/images/video_call.png"} alt={"Video Call"} />
							<div>Video Call</div>
						</Icon>
					</Ahref>
					<Ahref className="white" to={`/ide/${id}/`}>
						<Icon className="animated bounceIn">
							<img src={process.env.PUBLIC_URL + "/images/open_ide.png"} alt={"Open IDE"} />
							<div>Open IDE</div>
						</Icon>
					</Ahref>
				</RightContainer>
			</Wrapper>
		);
	}
}

export { TAOName };
