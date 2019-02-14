import * as React from "react";
import { Wrapper } from "components/";
import { Content } from "./styledComponents";
import { TopNavBarContainer } from "../TopNavBar/";
import { ToastContainer } from "widgets/Toast/";

class PageLayout extends React.Component {
	render() {
		return (
			<Wrapper>
				<TopNavBarContainer />
				<Content>{this.props.children}</Content>
				<ToastContainer />
			</Wrapper>
		);
	}
}

export { PageLayout };
