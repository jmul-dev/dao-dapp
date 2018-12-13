import styled from "styled-components";
import { Link } from "react-router";

export const Name = styled.div`
	font-size: 2em;
	font-weight: bold;
`;

export const Id = styled.div`
	font-size: 1em;
	margin-bottom: 40px;
`;

export const Right = styled.div`
	text-align: right;
`;

export const InlineDiv = styled.div`
	display: inline-block;
	text-align: center;
	margin-left: 10px;
`;

export const Img = styled.img`
	max-height: 20px;
	max-width: 100px;
	margin-bottom: 5px;
`;

export const StyledLink = styled(Link)`
	color: #ffffff;
	font-size: 0.9em;

	:hover {
		text-decoration: none;
		color: #555555;
	}
`;
