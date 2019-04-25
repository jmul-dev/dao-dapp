import styled from "styled-components";

export const DateColumn = styled.div`
	display: inline-block;
	vertical-align: top;
	width: 20%;
	font-size: 0.875em;

	&.header {
		font-size: 1.2em;
		font-weight: 400;
	}
`;

export const TypeColumn = styled(DateColumn)``;

export const MessageColumn = styled(DateColumn)`
	width: 60%;
`;
