import { connect } from "react-redux";
import { App } from "./App";
import { detectMobileBrowser, setNameId } from "./actions";

const mapStateToProps = (state) => {
	return {
		web3: state.web3Reducer.web3,
		networkId: state.web3Reducer.networkId,
		accounts: state.web3Reducer.accounts,
		nameFactory: state.contractReducer.nameFactory,
		nameId: state.taoReducer.nameId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		detectMobileBrowser: (isMobileBrowser) => dispatch(detectMobileBrowser(isMobileBrowser)),
		setNameId: (nameId) => dispatch(setNameId(nameId))
	};
};

export const AppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(App);
