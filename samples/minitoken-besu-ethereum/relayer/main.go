package main

import (
	"log"

	"github.com/hyperledger-labs/yui-ibc-solidity/pkg/relay/ethereum"
	"github.com/hyperledger-labs/yui-relayer/cmd"
	mock "github.com/hyperledger-labs/yui-relayer/provers/mock/module"
)

func main() {
	if err := cmd.Execute(
		mock.Module{},
		ethereum.Module{},
	); err != nil {
		log.Fatal(err)
	}
}
