module github.com/hyperledger-labs/yui-docs/samples/minitoken/relayer

go 1.16

require (
	github.com/datachainlab/ibc-ethmultisig-client v0.1.0
	github.com/hyperledger-labs/yui-relayer v0.1.2-0.20220124061305-6b081dc42621
)

replace (
	github.com/go-kit/kit => github.com/go-kit/kit v0.8.0
	github.com/gogo/protobuf => github.com/regen-network/protobuf v1.3.2-alpha.regen.4
	github.com/hyperledger/fabric-sdk-go => github.com/datachainlab/fabric-sdk-go v0.0.0-20200730074927-282a61dcd92e
	github.com/keybase/go-keychain => github.com/99designs/go-keychain v0.0.0-20191008050251-8e49817e8af4
)
