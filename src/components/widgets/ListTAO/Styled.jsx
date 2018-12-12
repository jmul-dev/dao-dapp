import styled from "styled-components";

export const Wrapper = styled.div`
	background-color: ${(props) => props.backgroundColor || "#000000"};
	color: #ffffff;
	padding: 20px 0;
`;

export const Header = styled.div`
	font-size: 1.2em;
	font-weight: bold;
`;

export const TAOWrapper = styled.div`
	padding: 15px 0;
	border-bottom: 1px solid #ccc;
`;

export const TAOName = styled.div`
	font-size: 1em;
	font-weight: bold;
`;

export const TAOID = styled.div`
	font-size: 0.7em;
`;

export const Right = styled.div`
	text-align: right;
`;

export const TAOPosition = styled.div`
	font-size: 1em;
	color: #888888;
`;
