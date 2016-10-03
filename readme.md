# about

modules:
- `visualizations.components`: react components for different visualizations:
	- attack (defense) trees (`AttacktreeVisualization`)
	- analysis results:
		- attack tree analyzer (`ATAnalyzerResults`)
		- attack tree evaluator (`ATEvaluatorResults`)
- `visualizations.color`
	- color scales


# installation

```
npm install trespass-visualizations
```


# setup

```
npm install
```


# development

when using the package `npm link`ed, don't forget to run `make build-watch`.


# documentation

to generate the documentation, run:

```
make docs && open ./docs/index.html
```
