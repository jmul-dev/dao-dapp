import * as React from "react";
import { Navbar } from "react-bootstrap";
import { TAOLogo, CurrencyName, CurrencyValue, Avatar, StyledLink } from "./styledComponents";
import "./style.css";

const promisify = require("tiny-promisify");

class TopNavBar extends React.Component {
	async componentDidMount() {
		const { nameId } = this.props;
		await this.getNameInfo(nameId);
		await this.getTAOCurrencyBalances(nameId);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.nameId !== prevProps.nameId) {
			const { nameId } = this.props;
			await this.getNameInfo(nameId);
			await this.getTAOCurrencyBalances(nameId);
		}
	}

	async getNameInfo(nameId) {
		const { nameTAOLookup, setNameInfo } = this.props;
		if (!nameTAOLookup || !nameId) {
			return;
		}
		const _nameInfo = await promisify(nameTAOLookup.getById)(nameId);
		const nameInfo = {
			name: _nameInfo[0],
			nameId: _nameInfo[1],
			typeId: _nameInfo[2],
			parentName: _nameInfo[3],
			parentId: _nameInfo[4],
			parentTypeId: _nameInfo[5]
		};
		setNameInfo(nameInfo);
	}

	async getTAOCurrencyBalances(nameId) {
		const { ethos, pathos, logos, setTAOCurrencyBalances } = this.props;
		if (!ethos || !pathos || !logos || !nameId) {
			return;
		}
		const ethosBalance = await promisify(ethos.balanceOf)(nameId);
		const pathosBalance = await promisify(pathos.balanceOf)(nameId);
		const logosBalance = await promisify(logos.sumBalanceOf)(nameId);

		const balances = {
			ethos: ethosBalance,
			pathos: pathosBalance,
			logos: logosBalance
		};
		setTAOCurrencyBalances(balances);
	}

	render() {
		const { nameId, nameInfo, taoCurrencyBalances } = this.props;
		if (!nameId || !nameInfo || !taoCurrencyBalances) return null;
		return (
			<Navbar bg="dark" variant="dark" sticky="top">
				<Navbar.Brand>
					<StyledLink to="/">
						<TAOLogo src={process.env.PUBLIC_URL + "/images/img_0.png"} alt={"AO Logo"} />
					</StyledLink>
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className="justify-content-end">
					<Navbar.Text>
						<CurrencyName className="ethos">Ethos</CurrencyName>
						<CurrencyValue>{taoCurrencyBalances.ethos.toNumber()}</CurrencyValue>
					</Navbar.Text>
					<Navbar.Text>
						<CurrencyName className="pathos">Pathos</CurrencyName>
						<CurrencyValue>{taoCurrencyBalances.pathos.toNumber()}</CurrencyValue>
					</Navbar.Text>
					<Navbar.Text>
						<CurrencyName className="logos">Logos</CurrencyName>
						<CurrencyValue>{taoCurrencyBalances.logos.toNumber()}</CurrencyValue>
					</Navbar.Text>
					<Navbar.Text>
						<StyledLink to={`/profile/${nameId}`}>
							<Avatar src={process.env.PUBLIC_URL + "/images/user_avatar.png"} alt={nameInfo.name + " Avatar"} />
							{nameInfo.name}
						</StyledLink>
					</Navbar.Text>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export { TopNavBar };
