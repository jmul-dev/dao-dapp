import * as React from "react";
import { Wrapper, Title, Ahref, FieldContainer, FieldName, FieldValue } from "components/";

class AncestryDetails extends React.Component {
	render() {
		const { ancestry, singlePageView } = this.props;
		if (!ancestry) {
			return null;
		}

		return (
			<Wrapper>
				<Title className={singlePageView ? "margin-top" : ""}>Ancestry</Title>
				<FieldContainer>
					<FieldName className="small">Parent</FieldName>
					<FieldValue className="small">
						<Ahref to={ancestry.parentIsTAO ? `/tao/${ancestry.parentId}` : `/profile/${ancestry.parentId}`}>
							{ancestry.parentName} ({ancestry.parentId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				{ancestry.isNotApprovedChild ? (
					<FieldContainer>
						<FieldName className="small">Parent has approved as child TAO</FieldName>
						<FieldValue className="small">No</FieldValue>
					</FieldContainer>
				) : (
					[
						!ancestry.isChild && (
							<FieldContainer>
								<FieldName className="small">Parent has removed as child TAO</FieldName>
								<FieldValue className="small">Yes</FieldValue>
							</FieldContainer>
						)
					]
				)}
				<FieldContainer>
					<FieldName className="small">Min. Required Logos to Create a Child TAO</FieldName>
					<FieldValue className="small">{ancestry.childMinLogos.toNumber()}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName className="small">Total Child TAOs</FieldName>
					<FieldValue className="small">{ancestry.totalChildren.toNumber()}</FieldValue>
				</FieldContainer>
			</Wrapper>
		);
	}
}

export { AncestryDetails };
