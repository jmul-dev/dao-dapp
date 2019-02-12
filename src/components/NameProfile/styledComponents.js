import styled from "styled-components";
import { Link } from "react-router";

export const Wrapper = styled.div`
	padding: 40px;
`;

export const Title = styled.div`
	font-size: 1.5em;
	font-weight: 500;
	margin-bottom: 40px;
`;

export const TitleMargin = styled(Title)`
	margin-top: 40px;
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

export const StyledLink = styled(Link)`
	text-decoration: none;
	color: #888888;
	:hover {
		text-decoration: none;
		color: #666666;
	}
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

export const StyledButton = styled.button`
	background: rgba(0, 204, 71, 1);
	color: #ffffff;
	border: none;
	padding: 8px 16px;
	min-width: 88px;
	font-size: 1em;
	min-height: 36px;
	line-height: 1.4em;
	font-weight: 500;
	margin: 10px 0;
	cursor: pointer;
`;

export const StyledButtonSmall = styled(StyledButton)`
	padding: 5px 16px;
	min-width: 88px;
	font-size: 0.8em;
	min-height: auto;
	margin-right: 15px;

	&.remove {
		background: #d34343;
	}
`;
