import styled from "styled-components";
import Form from "react-jsonschema-form";
import { Link } from "react-router";
import ReactTable from "react-table";
import Editor from "react-medium-editor";

import "css/react-table.css";
import "css/medium-editor.css";

export const Wrapper = styled.div`
	&.margin-top-30 {
		margin-top: 30px;
	}
	&.padding-40 {
		padding: 40px;
	}
	&.padding-20 {
		padding: 20px;
	}
	&.dark-bg {
		background-color: #000000;
	}
	&.margin-bottom-40 {
		margin-bottom: 40px;
	}
`;

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
	font-size: 0.875em;

	&.full {
		width: 100%;
	}

	.form-group {
		margin-bottom: 0.75em;
	}

	.form-control {
		height: calc(2em + 2px);
		font-size: 1em;
	}
`;

export const Error = styled.div`
	margin-top: 10px;
	font-size: 0.875em;
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

	&.margin-left-20 {
		margin-left: 20px;
	}
`;

export const Icon = styled.div`
	display: inline-block;
	cursor: pointer;
	text-align: center;
	font-size: 0.8em;
	margin: 30px 20px 0 0;

	&.navbar {
		font-size: 0.1em;
		color: #ffffff;
		margin: 0;

		> img {
			max-height: 15px;
		}

		> div {
			margin-top: 2px;
		}
	}

	&.margin-top-10 {
		margin-top: 10px;
	}

	> img {
		max-height: 25px;
	}

	> div {
		margin-top: 5px;
	}

	:hover {
		opacity: 0.7;
	}
`;

export const Table = styled(ReactTable)`
	font-size: 0.875em;

	button {
		color: #ffffff !important;
	}

	&.width-70 {
		width: 70%;
	}
`;

export const FieldContainer = styled.div`
	margin-bottom: 3px;
`;

export const FieldName = styled.div`
	display: inline-block;
	font-size: 0.875em;
	font-weight: 500;
	margin-right: 10px;
`;

export const FieldValue = styled.div`
	display: inline-block;
	font-size: 0.875em;
	color: #888888;
`;

export const MediumEditor = styled(Editor)`
	border: 1px solid rgba(255, 255, 255, 0.5);
	border-radius: 4px;
	color: #495057;
	background-color: #ffffff;
	padding: 10px;
	min-height: 100px;

	&.margin-bottom-20 {
		margin-bottom: 20px;
	}
`;
