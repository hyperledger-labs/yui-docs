package main

import (
	"log"

	"github.com/datachainlab/ibc-ethmultisig-client/modules/relay/ethmultisig"
	ethereum "github.com/hyperledger-labs/yui-relayer/chains/ethereum/module"
	"github.com/hyperledger-labs/yui-relayer/cmd"
)

func main() {
	if err := cmd.Execute(
		ethereum.Module{},
		ethmultisig.Module{},
	); err != nil {
		log.Fatal(err)
	}
}
