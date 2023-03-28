#!/usr/bin/env bash
set -e

if [ -z "$SOLPB_DIR" ]; then
    echo "variable SOLPB_DIR must be set"
    exit 1
fi

for file in $(find ./proto -name '*.proto')
do
  echo "Generating "$file
  protoc -I$(pwd)/proto -I${SOLPB_DIR}/protobuf-solidity/src/protoc/include --plugin=protoc-gen-sol=${SOLPB_DIR}/protobuf-solidity/src/protoc/plugin/gen_sol.py --"sol_out=use_runtime=@hyperledger-labs/yui-ibc-solidity/contracts/core/types/ProtoBufRuntime.sol&solc_version=0.8.9:$(pwd)/contracts" $(pwd)/$file
done
