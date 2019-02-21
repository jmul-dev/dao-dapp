import * as React from "react";
import { Wrapper, Title, Ahref, FieldContainer, FieldName, FieldValue } from "components/";

class AncestryDetails extends React.Component {
	render() {
		const { ancestry } = this.props;
		if (!ancestry) {
			return null;
		}

		console.log(ancestry);
		return (
			<Wrapper>
				<Title className="margin-top">Ancestry</Title>
				<FieldContainer>
					<FieldName className="small">Parent</FieldName>
					<FieldValue>
						<Ahref to={ancestry.parentIsTAO ? `/tao/${ancestry.parentId}` : `/profile/${ancestry.parentId}`}>
							{ancestry.parentName} ({ancestry.parentId})
						</Ahref>
					</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName className="small">Min. Required Logos to Create a Child TAO</FieldName>
					<FieldValue>{ancestry.childMinLogos.toNumber()}</FieldValue>
				</FieldContainer>
				<FieldContainer>
					<FieldName className="small">Total Child TAOs</FieldName>
					<FieldValue>{ancestry.totalChildren.toNumber()}</FieldValue>
				</FieldContainer>
			</Wrapper>
		);
	}
}

export { AncestryDetails };
