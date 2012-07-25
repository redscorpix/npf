BASE_FOLDER := $(dir $(realpath $(lastword $(MAKEFILE_LIST))))
BIN_FOLDER := $(BASE_FOLDER)/bin
BUILD_CONFIGS_FOLDER := $(BASE_FOLDER)/build_configs
JS_SRC_FOLDER := $(BASE_FOLDER)/js_src
JS_NS_FOLDER := $(JS_SRC_FOLDER)/ota
PLOVR := $(BIN_FOLDER)/plovr.jar

plovr-build:
	find $(BUILD_CONFIGS_FOLDER) -type f -name "*.json" | (IFS=""; while read f; do \
	    echo "" && \
	    echo Compile $$f && \
	    java -jar $(PLOVR) build $$f; \
	done;)
