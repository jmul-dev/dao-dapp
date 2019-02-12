import styled from "styled-components";
import { Link } from "react-router";

export const TAOLogo = styled.img`
	height: 20px;
`;

export const CurrencyName = styled.span`
	font-size: 0.875em;
	font-weight: 500;
	text-align: center;
	margin: 0 10px 0 25px;

	&.ethos {
		color: rgb(9, 159, 255);
	}
	&.pathos {
		color: rgb(102, 194, 165);
	}
	&.logos {
		color: rgb(255, 51, 0);
	}
`;

export const CurrencyValue = styled.span`
	font-size: 0.875em;
	text-align: center;
`;

export const Avatar = styled.img`
	width: 20px;
	margin: 0 10px 0 25px;
`;

export const StyledLink = styled(Link)`
	font-size: 0.875em;
	:hover {
		text-decoration: none;
	}
`;
