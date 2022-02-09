package main

import (
	"log"

	ethereum "github.com/hyperledger-labs/yui-relayer/chains/ethereum/module"
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
