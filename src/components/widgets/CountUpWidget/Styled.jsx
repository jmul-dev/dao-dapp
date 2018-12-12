import styled from "styled-components";
import CountUp from "react-countup";

export const Wrapper = styled.div`
	text-align: center;
	background-color: ${(props) => props.backgroundColor || "#DDDDDD"};
	color: #ffffff;
	height: 200px;
	margin: 4px;
`;

export const Content = styled.div`
	position: relative;
	top: 50%;
	-webkit-transform: translateY(-50%);
	-ms-transform: translateY(-50%);
	transform: translateY(-50%);
`;

export const Title = styled.div`
	font-size: 2em;
`;

export const StyledCountUp = styled(CountUp)`
	font-size: 3em;
	font-weight: bold;
`;
