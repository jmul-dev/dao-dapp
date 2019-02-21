import { connect } from "react-redux";
import { TAOPlot } from "./TAOPlot";

const mapStateToProps = (state) => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export const TAOPlotContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TAOPlot);
