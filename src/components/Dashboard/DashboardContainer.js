import { connect } from "react-redux";
import { Dashboard } from "./Dashboard";

const mapStateToProps = (state) => {
	return {
		nameId: state.nameReducer.nameId,
		names: state.globalReducer.names,
		taos: state.globalReducer.taos
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const DashboardContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Dashboard);
