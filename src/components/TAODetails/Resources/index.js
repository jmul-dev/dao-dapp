import * as React from "react";
import { Wrapper, Title, FieldContainer, FieldName, FieldValue, Icon } from "components/";
import { TransferResourcesContainer } from "./TransferResources/";

class Resources extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showForm: false
		};
		this.toggleShowForm = this.toggleShowForm.bind(this);
	}

	toggleShowForm() {
		this.setState({ showForm: !this.state.showForm });
	}

	render() {
		const { id, resources, singlePageView } = this.props;
		const { showForm } = this.state;

		if (!showForm) {
			return (
				<Wrapper>
					<Title className={singlePageView ? "margin-top" : ""}>TAO Resources</Title>
					<FieldContainer>
						<FieldName>ETH (in Wei)</FieldName>
						<FieldValue>{resources.ethBalance ? resources.ethBalance.toNumber() : 0}</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName>AO</FieldName>
						<FieldValue>{resources.aoBalance ? resources.aoBalance.toNumber() : 0}</FieldValue>
					</FieldContainer>
					<FieldContainer>
						<FieldName>AO+</FieldName>
						<FieldValue>{resources.primordialAOBalance ? resources.primordialAOBalance.toNumber() : 0}</FieldValue>
					</FieldContainer>
					<Icon className="animated bounceIn" onClick={this.toggleShowForm}>
						<img src={process.env.PUBLIC_URL + "/images/transfer.png"} alt={"Transfer Resources"} />
						<div>Transfer Resources</div>
					</Icon>
				</Wrapper>
			);
		} else {
			return <TransferResourcesContainer id={id} toggleShowForm={this.toggleShowForm} getTAOResources={this.props.getTAOResources} />;
		}
	}
}

export { Resources };
