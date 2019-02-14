import styled from "styled-components";

export const Wrapper = styled.div`
	padding: 40px;
`;

export const FieldContainer = styled.div`
	margin-bottom: 3px;
`;

export const FieldName = styled.div`
	display: inline-block;
	font-size: 0.875em;
	font-weight: 500;
	margin-right: 10px;
`;

export const FieldValue = styled.div`
	display: inline-block;
	font-size: 0.875em;
	color: #888888;
`;

export const OwnerContent = styled.div``;

export const PublicKeyContainer = styled.div`
	margin-bottom: 5px;

	&.default {
		color: #ffffff;
		font-weight: 500;
	}
`;

export const PublicKeyValue = styled.div`
	display: inline-block;
	width: 370px;
`;

export const PublicKeyBalance = styled.div`
	display: inline-block;
	text-align: right;
	width: 100px;
	margin-right: 20px;
`;

export const PublicKeyAction = styled.div`
	display: inline-block;
`;

export const NonDefaultKeyAction = styled.div`
	display: inline-block;
`;
