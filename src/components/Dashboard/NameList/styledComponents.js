import styled from "styled-components";
import { Link } from "react-router";

export const Wrapper = styled.div`
	background-color: #000000;
	padding: 20px;
`;

export const Title = styled.div`
	font-size: 1.5em;
	font-weight: bold;
	margin-bottom: 5px;
`;

export const StyledLink = styled(Link)`
	text-decoration: none;
	color: #888888;
	:hover {
		text-decoration: none;
		color: #666666;
	}
`;
