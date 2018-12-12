import styled from "styled-components";
import CountUp from "react-countup";

export const Wrapper = styled.div`
	text-align: center;
	background-color: #000000;
	color: ${(props) => props.color || "#FFFFFF"};
	padding: 0 15px;
`;

export const Content = styled.div`
	padding: 10px;
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
