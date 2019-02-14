import styled from "styled-components";
import Form from "react-jsonschema-form";
import { Link } from "react-router";

export const Wrapper = styled.div``;

export const Title = styled.div`
	font-size: 1.5em;
	font-weight: 500;
	margin-bottom: 40px;

	&.big {
		font-size: 4em;
		margin-bottom: 5px;
	}

	&.margin-top {
		margin-top: 40px;
	}
`;

export const SchemaForm = styled(Form)`
	width: 50%;
`;

export const Error = styled.div`
	margin-top: 10px;
	font-size: 1em;
	font-weight: 500;
	color: #ff0000;
`;

export const Button = styled.button`
	background: rgba(0, 204, 71, 1);
	color: #ffffff;
	border: none;
	padding: 8px 16px;
	min-width: 88px;
	font-size: 1em;
	min-height: 36px;
	line-height: 1.4em;
	font-weight: 500;
	cursor: pointer;

	&.small {
		padding: 5px 16px;
		font-size: 0.8em;
		min-height: auto;
	}
	&.orange {
		background: #ffbe01;
	}
	&.red {
		background: #d34343;
	}
	&.margin-left {
		margin-left: 10px;
	}
	&.margin-right {
		margin-right: 15px;
	}
	&.no-bg {
		background: none;
	}
`;

export const Ahref = styled(Link)`
	text-decoration: none;
	color: #888888;
	:hover {
		text-decoration: none;
		color: #666666;
	}
`;

export const Icon = styled.div`
	display: inline-block;
	cursor: pointer;
	text-align: center;
	font-size: 0.8em;
	margin: 10px 20px 0 0;

	> img {
		max-height: 20px;
	}

	> div {
		margin-top: 5px;
	}

	:hover {
		opacity: 0.7;
	}
`;
