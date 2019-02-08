import styled from "styled-components";
import Form from "react-jsonschema-form";

export const Wrapper = styled.div``;

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
