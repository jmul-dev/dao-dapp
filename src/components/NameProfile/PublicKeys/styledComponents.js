import styled from "styled-components";

export const OwnerContent = styled.div``;

export const PublicKeyContainer = styled.div`
	margin-bottom: 5px;
	font-size: 0.875em;
	color: #888888;

	&.default {
		color: #ffffff;
		font-weight: 500;
	}
`;

export const PublicKeyValue = styled.div`
	display: inline-block;
	width: 370px;
	vertical-align: top;
`;

export const PublicKeyBalance = styled.div`
	display: inline-block;
	text-align: right;
	width: 100px;
	margin-right: 20px;
	vertical-align: top;
`;

export const PublicKeyAction = styled.div`
	display: inline-block;
	vertical-align: top;
`;

export const NonDefaultKeyAction = styled.div`
	display: inline-block;
	vertical-align: top;
`;
