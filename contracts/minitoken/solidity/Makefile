.PHONY: build
build:
	npm run compile

.PHONY: install
install:
	npm install

.PHONY: proto
proto:
ifndef SOLPB_DIR
	$(error SOLPB_DIR is not specified)
else
	. ./scripts/solpb.sh
endif
