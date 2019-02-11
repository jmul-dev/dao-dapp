import styled from "styled-components";
import Form from "react-jsonschema-form";

export const Wrapper = styled.div`
	padding: 40px;
`;

export const Title = styled.div`
	font-size: 4em;
	margin-bottom: 5px;
`;

export const StyledForm = styled(Form)`
	width: 50%;
`;

export const Error = styled.div`
	margin-top: 10px;
	font-size: 1em;
	font-weight: bold;
	color: #ff0000;
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
`;
