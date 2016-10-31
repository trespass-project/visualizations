const React = require('react');

const noop = () => {};


const AttacktreeOptions = React.createClass({
	propTypes: {
		selectedLayout: React.PropTypes.string,
		selectLayout: React.PropTypes.func,
		selectedPreset: React.PropTypes.string,
		selectPreset: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			selectLayout: noop,
			selectLayout: 'regular',
			selectPreset: noop,
			selectPreset: 'normal',
		};
	},

	render() {
		const { props } = this;
		const style = {
			float: 'left',
			marginRight: '2em',
		};

		return <div>
			<div style={style}>
				<span className='grey'>Layout: </span>
				<select
					value={props.selectedLayout}
					onChange={(event) => {
						props.selectLayout(event.target.value)
					}}
				>
					<option value='regular'>Normal</option>
					<option value='radial'>Radial</option>
				</select>
			</div>

			<div style={style}>
				<span className='grey'>Mode: </span>
				<select
					value={props.selectedPreset}
					onChange={(event) => {
						props.selectPreset(event.target.value)
					}}
				>
					<option value='normal'>Normal</option>
					<option value='similarity'>Similarity</option>
					{/*<option value='frequency'>Label frequency</option>*/}
				</select>
			</div>
		</div>;
	},
});

module.exports = AttacktreeOptions;
