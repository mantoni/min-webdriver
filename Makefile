SHELL := /bin/bash
PATH  := node_modules/.bin:${PATH}

version = $(shell node -p "require('./package.json').version")

.PHONY: test
test:
	@jslint --color lib/*.js

release: test
ifeq (v${version},$(shell git tag -l v${version}))
	@echo "Version ${version} already released!"
	@exit 1
endif
	@echo "Creating tag v${version}"
	@git tag -a -m "Release ${version}" v${version}
	@git push --tags
	@echo "Publishing to npm"
	@npm publish
