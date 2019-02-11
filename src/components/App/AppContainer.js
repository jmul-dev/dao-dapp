import { connect } from "react-redux";
import { App } from "./App";
import { detectMobileBrowser } from "./actions";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		accounts: state.web3Reducer.accounts
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		detectMobileBrowser: (isMobileBrowser) => dispatch(detectMobileBrowser(isMobileBrowser))
	};
};

export const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
