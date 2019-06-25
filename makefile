.PHONY: clean

clean:
	rm -rf dist

node_modules:
	npm i

dist: dist/lk-contract.esm.js dist/lk-contract.cjs.js

dist/lk-contract.esm.js dist/lk-contract.cjs.js: node_modules $(wildcard src/*.js) rollup.config.js
	node_modules/.bin/rollup -c
