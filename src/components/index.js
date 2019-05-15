import styled from "styled-components";
import Form from "react-jsonschema-form";
import { Link } from "react-router";
import ReactTable from "react-table";
import Editor from "react-medium-editor";
import { Nav } from "react-bootstrap";

import "css/react-table.css";
import "css/medium-editor.css";
import "css/animate.min.css";

export const Wrapper = styled.div`
	font-size: 1em;

	&.padding-left-20 {
		padding-left: 20px;
	}
	&.margin-top-20 {
		margin-top: 20px;
	}
	&.margin-top-30 {
		margin-top: 30px;
	}
	&.margin-top-40 {
		margin-top: 40px;
	}
	&.margin-bottom-20 {
		margin-bottom: 20px;
	}
	&.margin-bottom-30 {
		margin-bottom: 30px;
	}
	&.margin-bottom-40 {
		margin-bottom: 40px;
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
	&.center {
		text-align: center;
	}
	&.white {
		color: #ffffff;
	}
	&.small {
		font-size: 0.875em;
	}
	&.tx-hash {
		font-size: 0.75em;
		margin-top: 10px;
		width: 90%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
	&.tx-hash-small {
		font-size: 0.7em;
		margin-top: 3px;
		width: 90%;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
`;

export const Title = styled.div`
	font-size: 1.5em;
	font-weight: 500;
	margin-bottom: 40px;

	&.small {
		font-size: 0.875em;
	}
	&.medium {
		font-size: 2.5em;
	}
	&.big {
		font-size: 4em;
		margin-bottom: 5px;
	}
	&.margin-bottom-0 {
		margin-bottom: 0;
	}
	&.margin-top {
		margin-top: 40px;
	}
	&.margin-top-20 {
		margin-top: 20px;
	}
`;

export const Header = styled.div`
	font-size: 0.875em;
	margin: 10px 0;

	&.strong {
		font-weight: 800;
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
	&.small {
		font-size: 0.875em;
	}
	&.white {
		color: #ffffff;
	}
`;

export const Icon = styled.div`
	display: inline-block;
	cursor: pointer;
	text-align: center;
	font-size: 0.7em;
	margin: 30px 20px 0 0;

	&.navbar {
		font-size: 0.7em;
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
		max-height: 20px;
	}

	> div {
		margin-top: 5px;
	}

	:hover {
		opacity: 0.7;
	}
	&.last-child {
		margin-right: 0;
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
	margin-bottom: 5px;

	&.margin-top-20 {
		margin-top: 20px;
	}
`;

export const FieldName = styled.div`
	display: inline-block;
	vertical-align: top;
	font-size: 0.875em;
	font-weight: 500;
	width: 200px;

	&.small {
		width: 150px;
	}
	&.big {
		width: 300px;
	}
`;

export const FieldValue = styled.div`
	display: inline-block;
	vertical-align: top;
	padding-right: 10px;
	padding-left: 10px;
	font-size: 0.875em;
	color: #888888;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	width: calc(100% - 200px);

	&.small {
		width: calc(100% - 150px);
	}
	&.big {
		width: calc(100% - 300px);
	}
	&.green {
		color: #00cc47;
	}
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

export const LeftContainer = styled.div`
	display: inline-block;
	width: 50%;
	vertical-align: top;
	padding-right: 10px;

	&.width-20 {
		width: 20%;
	}
	&.width-65 {
		width: 65%;
	}
`;

export const RightContainer = styled.div`
	display: inline-block;
	width: 50%;
	vertical-align: top;
	padding-left: 10px;

	&.width-35 {
		width: 35%;
	}
	&.width-80 {
		width: 80%;
	}
	&.right {
		text-align: right;
	}
`;

export const GroupButton = styled.button`
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

export const NavLink = styled(Nav.Link)`
	color: rgba(255, 255, 255, 0.5);
	padding: 0.5rem 0;

	:hover {
		color: rgba(255, 255, 255, 0.8);
	}

	&.active {
		color: rgba(255, 255, 255, 1);
		font-weight: 800;
	}
`;

export const Hr = styled.hr`
	background-color: rgba(255, 255, 255, 0.2);
`;

export const Badge = styled.div`
	border-radius: 50%;
	background-color: #f44336;
	position: absolute;
	padding: 2px 6px;
	top: 0px;
	left: 52px;
`;
