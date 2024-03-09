#!/bin/sh

/usr/local/bin/geth --password /root/geth.password \
  --unlock "0" --syncmode full \
  --http --http.vhosts "*" --http.addr "0.0.0.0" --http.port "8545" --http.api web3,eth,net,personal,miner,txpool --http.corsdomain '*' \
  --ws --ws.api eth,net,web3,personal,txpool --ws.addr "0.0.0.0" --ws.port "8546" --ws.origins '*' \
  --datadir /root/.ethereum --networkid "2019" --nodiscover \
  --mine --miner.threads 1 --miner.gasprice "0" --miner.etherbase "0xa89F47C6b463f74d87572b058427dA0A13ec5425" \
  --allow-insecure-unlock --nousb \
  $@
