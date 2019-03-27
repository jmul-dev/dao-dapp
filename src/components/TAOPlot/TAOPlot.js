import * as React from "react";
import * as d3 from "d3";
import { Wrapper, GroupButton } from "components/";
import { Neon, NeonStroke } from "css/color.json";
import { hashHistory } from "react-router";

class TAOPlot extends React.Component {
	constructor(props) {
		super(props);
		this.createTree = this.createTree.bind(this);
		this.drawClusterTree = this.drawClusterTree.bind(this);
		this.drawRadialTree = this.drawRadialTree.bind(this);
		this.drawRadialCluster = this.drawRadialCluster.bind(this);
		this.drawTree = this.drawTree.bind(this);
		this.state = {
			plotType: "forethought",
			diameter: 500,
			duration: 1500,
			widthPadding: 100,
			tree: null,
			cluster: null,
			diagonal: null,
			radialTree: null,
			radialCluster: null,
			radialDiagonal: null,
			svg: null,
			allLinks: null,
			allNodes: null
		};
		this.initialState = this.state;
	}

	componentDidMount() {
		if (this.props.taoData) {
			this.createTree();
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.taoData !== prevProps.taoData) {
			d3.select("svg")
				.selectAll("*")
				.remove();
			this.setState(this.initialState);
			this.createTree();
		}
	}

	createTree() {
		const { height, width, taoData } = this.props;
		if (!taoData) {
			return;
		}
		const { diameter, widthPadding } = this.state;
		const tree = d3.layout.tree().size([height, width - widthPadding]);
		this.setState({ tree });

		const cluster = d3.layout.cluster().size([height, width - widthPadding]);
		this.setState({ cluster });

		const diagonal = d3.svg.diagonal().projection((d) => {
			return [d.y, d.x];
		});
		this.setState({ diagonal });

		const radialTree = d3.layout
			.tree()
			.size([360, diameter / 2])
			.separation((a, b) => {
				return (a.parent === b.parent ? 1 : 2) / a.depth;
			});
		this.setState({ radialTree });

		const radialCluster = d3.layout
			.cluster()
			.size([360, diameter / 2])
			.separation((a, b) => {
				return (a.parent === b.parent ? 1 : 2) / a.depth;
			});
		this.setState({ radialCluster });

		const radialDiagonal = d3.svg.diagonal.radial().projection((d) => {
			return [d.y, (d.x / 180) * Math.PI];
		});
		this.setState({ radialDiagonal });

		const svg = d3
			.select("svg")
			.attr("width", width)
			.attr("height", height)
			.append("g")
			.attr("transform", "translate(40, 0)");
		this.setState({ svg });

		const nodes = cluster.nodes(taoData);
		const links = cluster.links(nodes);

		const allLinks = svg
			.selectAll(".link")
			.data(links)
			.enter()
			.append("path")
			.attr("class", "link")
			.style("stroke", NeonStroke[2])
			.attr("d", diagonal);
		this.setState({ allLinks });

		const allNodes = svg
			.selectAll(".node")
			.data(nodes)
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", (d) => {
				return "translate(" + d.y + "," + d.x + ")";
			});
		this.setState({ allNodes });

		allNodes
			.append("circle")
			.attr("r", 8.5)
			.attr("fill", "#191919")
			.style("stroke", Neon[2])
			.style("stroke-width", "2px")
			.style("cursor", "pointer");

		allNodes
			.append("text")
			.attr("dx", (d) => {
				return d.children ? -8 : 8;
			})
			.attr("dy", 3)
			.style("text-anchor", (d) => {
				return d.children ? "end" : "start";
			})
			.style("font-size", "0.8em")
			.style("cursor", "pointer")
			.attr("fill", "#FFFFFF")
			.text((d) => {
				return d.name;
			});

		allNodes.on("click", (d, i) => {
			hashHistory.push("/tao/" + d.id);
		});
	}

	drawClusterTree() {
		const { svg, cluster, duration, allLinks, allNodes, diagonal } = this.state;
		const nodes = cluster.nodes(this.props.taoData);
		const links = cluster.links(nodes);

		svg.transition()
			.duration(duration)
			.attr("transform", "translate(40,0)");

		allLinks
			.data(links)
			.transition()
			.duration(duration)
			.style("stroke", NeonStroke[2])
			.attr("d", diagonal); //get the new cluster path

		allNodes
			.data(nodes)
			.transition()
			.duration(duration)
			.attr("transform", (d) => {
				return "translate(" + d.y + "," + d.x + ")";
			});

		allNodes
			.select("circle")
			.transition()
			.duration(duration)
			.style("stroke", Neon[2]);
		this.setState({ plotType: "forethought" });
	}

	drawRadialTree() {
		const { height, width, taoData } = this.props;
		const { radialTree, svg, duration, radialDiagonal, allLinks, allNodes } = this.state;
		const nodes = radialTree.nodes(taoData);
		const links = radialTree.links(nodes);

		svg.transition()
			.duration(duration)
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
		// set appropriate translation (origin in middle of svg)

		allLinks
			.data(links)
			.transition()
			.duration(duration)
			.style("stroke", NeonStroke[0])
			.attr("d", radialDiagonal); //get the new radial path

		allNodes
			.data(nodes)
			.transition()
			.duration(duration)
			.attr("transform", (d) => {
				return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
			});

		allNodes
			.select("circle")
			.transition()
			.duration(duration)
			.style("stroke", Neon[0]);
		this.setState({ plotType: "tao" });
	}

	drawRadialCluster() {
		const { height, width, taoData } = this.props;
		const { radialCluster, svg, duration, allLinks, allNodes, radialDiagonal } = this.state;

		const nodes = radialCluster.nodes(taoData);
		const links = radialCluster.links(nodes);

		svg.transition()
			.duration(duration)
			.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		allLinks
			.data(links)
			.transition()
			.duration(duration)
			.style("stroke", NeonStroke[1])
			.attr("d", radialDiagonal); //get the new radial path

		allNodes
			.data(nodes)
			.transition()
			.duration(duration)
			.attr("transform", (d) => {
				return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
			});

		allNodes
			.select("circle")
			.transition()
			.duration(duration)
			.style("stroke", Neon[1]);
		this.setState({ plotType: "thought" });
	}

	drawTree() {
		const { tree, svg, allLinks, allNodes, duration, diagonal } = this.state;
		const nodes = tree.nodes(this.props.taoData);
		const links = tree.links(nodes);

		svg.transition()
			.duration(duration)
			.attr("transform", "translate(40,0)");

		allLinks
			.data(links)
			.transition()
			.duration(duration)
			.style("stroke", NeonStroke[3])
			.attr("d", diagonal); // get the new tree path

		allNodes
			.data(nodes)
			.transition()
			.duration(duration)
			.attr("transform", (d) => {
				return "translate(" + d.y + "," + d.x + ")";
			});

		allNodes
			.select("circle")
			.transition()
			.duration(duration)
			.style("stroke", Neon[3]);
		this.setState({ plotType: "order" });
	}

	render() {
		const { height, width } = this.props;
		const { plotType } = this.state;
		return (
			<Wrapper className="dark-bg padding-20 center">
				<form>
					<div className="btn-group btn-group-sm" role="group">
						<GroupButton
							type="button"
							className={`btn btn-default ${plotType === "tao" ? "selected" : ""}`}
							onClick={this.drawRadialTree}
						>
							TAO
						</GroupButton>
						<GroupButton
							type="button"
							className={`btn btn-default ${plotType === "thought" ? "selected" : ""}`}
							onClick={this.drawRadialCluster}
						>
							Thought
						</GroupButton>
						<GroupButton
							type="button"
							className={`btn btn-default ${plotType === "order" ? "selected" : ""}`}
							onClick={this.drawTree}
						>
							Order
						</GroupButton>
						<GroupButton
							type="button"
							className={`btn btn-default ${plotType === "forethought" ? "selected" : ""}`}
							onClick={this.drawClusterTree}
						>
							ForeThought
						</GroupButton>
					</div>
				</form>
				<svg ref={(node) => (this.node = node)} width={width} height={height} />
			</Wrapper>
		);
	}
}

export { TAOPlot };
