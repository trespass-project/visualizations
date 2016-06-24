nodeModulesDir = ./node_modules
npmBinDir = $(nodeModulesDir)/.bin
appDir = ./app
imgDirName = images
buildDir = ./build


.PHONY: start
start:
	$(npmBinDir)/webpack-dev-server


.PHONY: webpack
webpack:
	NODE_ENV=production $(npmBinDir)/webpack -p -d


.PHONY: test
test:
	$(npmBinDir)/ava -v ./tests


.PHONY: test-watch
test-watch:
	$(npmBinDir)/ava -v --watch ./tests


.PHONY: lint
lint:
	$(npmBinDir)/eslint $(appDir)/scripts


.PHONY: optimize-images
optimize-images:
	imagemin $(buildDir)/$(imgDirName) $(buildDir)/$(imgDirName)


.PHONY: copy
copy:
	mkdir -p $(buildDir)/$(imgDirName)
	cp -r $(appDir)/$(imgDirName) $(buildDir)/


.PHONY: clean
clean:
	rm -rf $(buildDir)


.PHONY: build
build: webpack copy
	#


.PHONY: post-build
post-build: optimize-images
	#


.DEFAULT_GOAL = default
.PHONY: default
default: test lint clean # once these are done, run the rest in parallel
	# will stop here if tests don't pass, or if there are linting errors
	mkdir -p $(buildDir)
	$(MAKE) -j 4 build
	$(MAKE) -j 4 post-build
