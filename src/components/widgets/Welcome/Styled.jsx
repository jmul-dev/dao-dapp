import styled from "styled-components";

export const Wrapper = styled.div`
	background-color: ${(props) => props.backgroundColor || "#000000"};
	color: #ffffff;
	height: 80px;
`;

export const Content = styled.div`
	position: relative;
	top: 50%;
	-webkit-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
`;

export const Header = styled.div`
	font-size: 1.2em;
	font-weight: bold;
`;

export const SmallHeader = styled.div`
	font-size: 0.8em;
`;
