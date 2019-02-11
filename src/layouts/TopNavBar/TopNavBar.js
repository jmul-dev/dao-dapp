import * as React from "react";
import { Navbar } from "react-bootstrap";
import { TAOLogo, Avatar, StyledLink } from "./styledComponents";
import "./style.css";

const promisify = require("tiny-promisify");

class TopNavBar extends React.Component {
	async componentDidMount() {
		await this.getNameInfo();
	}

	async componentDidUpdate(prevProps) {
		if (this.props.nameTAOLookup !== prevProps.nameTAOLookup || this.props.nameId !== prevProps.nameId) {
			await this.getNameInfo();
		}
	}

	async getNameInfo() {
		const { nameTAOLookup, nameId, setNameInfo } = this.props;
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

	render() {
		const { nameId, nameInfo } = this.props;
		if (!nameId || !nameInfo) return null;
		return (
			<Navbar bg="dark" variant="dark">
				<Navbar.Brand href="/">
					<TAOLogo src={process.env.PUBLIC_URL + "/images/img_0.png"} alt={"AO Logo"} />
				</Navbar.Brand>
				<Navbar.Toggle />
				<Navbar.Collapse className="justify-content-end">
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
