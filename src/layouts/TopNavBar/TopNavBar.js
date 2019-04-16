import * as React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Ahref as Link, Icon } from "components/";
import { TAOLogo, CurrencyName, CurrencyValue, Avatar, Ahref, BackgroundImage } from "./styledComponents";
import { get, encodeParams } from "utils/";
import "./style.css";

const promisify = require("tiny-promisify");

class TopNavBar extends React.Component {
	async componentDidMount() {
		const { nameId } = this.props;
		await this.getNameInfo(nameId);
		await this.getProfileImage(nameId);
		await this.getTAOCurrencyBalances(nameId);
	}

	async componentDidUpdate(prevProps) {
		if (this.props.nameId !== prevProps.nameId) {
			await this.getNameInfo(this.props.nameId);
			await this.getProfileImage(this.props.nameId);
			await this.getTAOCurrencyBalances(this.props.nameId);
		} else if (this.props.stakedTAOs !== prevProps.stakedTAOs && this.props.nameId) {
			await this.getTAOCurrencyBalances(this.props.nameId);
		} else if (this.props.namesPositionLogos !== prevProps.namesPositionLogos && this.props.nameId) {
			if (this.props.namesPositionLogos.find((name) => name.nameId === this.props.nameId)) {
				await this.getTAOCurrencyBalances(this.props.nameId);
			}
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

	async getProfileImage(nameId) {
		const { setProfileImage } = this.props;
		if (!nameId) {
			return;
		}
		try {
			const response = await get(`https://localhost/api/get-profile-image?${encodeParams({ nameId })}`);
			if (response.profileImage) {
				setProfileImage(response.profileImage);
			}
		} catch (e) {}
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
		const { nameId, nameInfo, taoCurrencyBalances, profileImage, compromised } = this.props;
		if (!nameId || !nameInfo || !taoCurrencyBalances) return null;
		return (
			<Navbar bg="dark" variant="dark" sticky="top">
				<Navbar.Brand>
					<Link to="/">
						<TAOLogo src={process.env.PUBLIC_URL + "/images/img_0.png"} alt={"AO Logo"} />
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle />
				{compromised === false && (
					<Nav className="mr-auto">
						<Ahref to="/">
							<Icon className="animated bounceIn navbar">
								<img src={process.env.PUBLIC_URL + "/images/view_taos_plot.png"} alt={"TAO Map"} />
								<div>TAO Map</div>
							</Icon>
						</Ahref>
						<Ahref to="/view-own-taos">
							<Icon className="animated bounceIn navbar">
								<img src={process.env.PUBLIC_URL + "/images/view_own_taos.png"} alt={"Own TAOs"} />
								<div>Own TAOs</div>
							</Icon>
						</Ahref>
						<Ahref to="/names">
							<Icon className="animated bounceIn navbar">
								<img src={process.env.PUBLIC_URL + "/images/view_names.png"} alt={"View Names"} />
								<div>View Names</div>
							</Icon>
						</Ahref>
						<Ahref to="/create-tao">
							<Icon className="animated bounceIn navbar">
								<img src={process.env.PUBLIC_URL + "/images/create_tao.png"} alt={"Create TAO"} />
								<div>Create TAO</div>
							</Icon>
						</Ahref>
					</Nav>
				)}
				<Navbar.Collapse className="justify-content-end">
					{compromised === false && (
						<div>
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
						</div>
					)}
					<Navbar.Text>
						<Ahref to={compromised === false ? `/profile/${nameId}` : "/"}>
							{profileImage ? (
								<div>
									<BackgroundImage style={{ backgroundImage: `url(${profileImage})` }} />
									{nameInfo.name}
								</div>
							) : (
								<div>
									<Avatar src={process.env.PUBLIC_URL + "/images/user_avatar.png"} alt={nameInfo.name + " Avatar"} />
									{nameInfo.name}
								</div>
							)}
						</Ahref>
					</Navbar.Text>
				</Navbar.Collapse>
			</Navbar>
		);
	}
}

export { TopNavBar };
