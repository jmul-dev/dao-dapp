import styled from "styled-components";
import CountUp from "react-countup";

export const Wrapper = styled.div`
	text-align: center;
	color: ${(props) => props.color || "#FFFFFF"};
	height: 30px;
`;

export const Title = styled.div`
	font-size: 1.2em;
	text-align: left;
`;

export const StyledCountUp = styled(CountUp)`
	font-size: 1.2em;
	font-weight: bold;
	text-align: right;
`;
