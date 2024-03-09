FROM ethereum/client-go:v1.11.3

ADD geth.password /root/geth.password
ADD genesis.json  /root/genesis.json
ADD privatekey  /root/privatekey
ADD run.sh  /run.sh

RUN /usr/local/bin/geth --nousb --datadir /root/.ethereum init /root/genesis.json

RUN /usr/local/bin/geth --nousb account import --password /root/geth.password /root/privatekey

EXPOSE 8545 8546 8547 30303

ENTRYPOINT ["/run.sh"]
CMD ["--verbosity", "5", "--vmdebug"]
