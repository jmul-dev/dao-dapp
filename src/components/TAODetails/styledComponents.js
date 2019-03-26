import styled from "styled-components";

export const Button = styled.button`
	background-color: #333333;
	color: #ffffff;

	:hover {
		background-color: #cccccc;
		color: #191919;
	}
	&.selected {
		background-color: #ffffff;
		color: #191919;
	}
`;
