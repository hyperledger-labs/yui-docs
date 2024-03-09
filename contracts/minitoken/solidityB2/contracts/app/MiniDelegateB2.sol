// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@hyperledger-labs/yui-ibc-solidity/contracts/core/OwnableIBCHandler.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";
import "../lib/PacketMssg.sol";
//noivern
contract MiniDelegateB2 is IIBCModule {
    IBCHandler ibcHandler;

    using BytesLib for *;

    address private owner;

    mapping (bytes => mapping(address => bool)) public access;

    mapping (string => string) public certificate;

    constructor(IBCHandler ibcHandler_) public {
        owner = msg.sender;

        ibcHandler = ibcHandler_;

        //para pruebas ahora, predeterminado el usuario puede acceder al registro 0x0541...712
        certificate["kadabra"] = "alakazam";
        certificate["machoke"] = "machamp";
        certificate["haunter"] = "gengar";
        certificate["graveler"] = "golem";

    }

    event Mint(address indexed to, string message);

    event Cacneacall(address indexed to, string message);

    event Burn(address indexed from, string message);

    event Transfer(address indexed from, address indexed to, string message);

    event SendTransfer(
        address indexed from,
        address indexed to,
        string sourcePort,
        string sourceChannel,
        uint64 timeoutHeight,
        string message
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "MiniMessage: caller is not the owner");
        _;
    }

    modifier onlyIBC() {
        require(
            msg.sender == address(ibcHandler),
            "MiniMessage: caller is not the ibcHandler"
        );
        _;
    }


    //La funcion aparece 2 veces (sendTransfer y sendTransfer2), 
    //una interna y otra externa, copiada para facilitar la visualizacion ahora mismo.

    //Lo suyo seria que la blockchain A que siempre va a enviar tenga la funcion externa y
    //la blockchain B que recibe datos, la interna. 
    //Esto es porque la A envia y es invocada desde fuera la funcion por un user 
    //o contrato, y en B es un "ejecutable" que se activan el momento en el que B recibe
    //un codigo valido asociado a un valor, que seria el solicitado desde A
    
    //sendTransfer contiene:
    // el mensaje: un string desde la version anterior
    // una address, del receptor. Aqui la address es la del usuario que recibe el mensaje. 
    //     En este caso es todo el rato la misma cuenta, "alice" en los tests.
    //     Esto es porque es el sender y el receiver, envia la solicitud con el codigo y ha de
    //     de recibir luego el dato solicitado
    //
    function sendTransfer(
        string memory message,
        address receiver,
        string calldata sourcePort,
        string calldata sourceChannel,
        uint64 timeoutHeight
    ) external {
        //require(_burn(msg.sender, message), "MiniMessage: failed to burn");

        _sendPacket(
            MiniMessagePacketData.Data({
                message: message, 
                sender: abi.encodePacked(msg.sender),
                receiver: abi.encodePacked(receiver)
            }),
            sourcePort,
            sourceChannel,
            timeoutHeight
        );
        emit SendTransfer(
            msg.sender,
            receiver,
            sourcePort,
            sourceChannel,
            timeoutHeight,
            message
        );
    }

    function sendTransfer2(
        string memory message,
        address receiver,
        string memory sourcePort,
        string memory sourceChannel,
        uint64 timeoutHeight
    ) internal {
       // require(_burn(msg.sender, message), "MiniMessage: failed to burn");

        _sendPacket(
            MiniMessagePacketData.Data({
                message: message, 
                sender: abi.encodePacked(receiver),
                receiver: abi.encodePacked(receiver)
            }),
            sourcePort,
            sourceChannel,
            timeoutHeight
        );
        emit SendTransfer(
            msg.sender,
            receiver,
            sourcePort,
            sourceChannel,
            timeoutHeight,
            message
        );
    }


    mapping(address => string) private _mensajin;

    function mint(address account, string memory message) external onlyOwner {
        require(_mint(account, message));
    }

    
    //no te preocupes por las funciones de burn, balanceof, mint, no aplican aqui, las conservamos
    //de cuando se usaba un int, en YUI original minitoken
    function burn(string memory message) external {
        require(_burn(msg.sender, message), "MiniMessage: failed to burn");
    }

    function transfer(address to, string memory message) external {
        bool res;
        string memory mssg;
        (res, mssg) = _transfer(msg.sender, to, message);
        require(res, mssg);
    }

    function balanceOf(address account) public view returns (string memory) {
        return _mensajin[account];
    }

    function _mint(address account, string memory message) internal returns (bool) {
        _mensajin[account] = message; //cacnea
        emit Mint(account, message);
        return true;
    }


    function _cacneacall(bytes memory _mssg) internal returns (string memory) {
        (address account, string memory message_s) = abi.decode(_mssg, (address, string));
        string memory data_s = string(message_s);
        //ignorar esta linea
        //string memory xana = string(abi.encodePacked(account));

        _mensajin[account] = "evolucion completada";
            
        sendTransfer2(certificate[message_s], account, "transfer", "channel-0", 0);
      
        emit Burn(account, "hola");
        
        emit Cacneacall(account, message_s);
        
        return "cacturne"; //este return esta para comprobaciones, podria devolver un true y ya o nada
    
    }

    function _burn(address account, string memory message) internal returns (bool) {        
       // _mensajin[account] = "";
        emit Burn(account, message);
        return true;
    }

    function _transfer( //cacnea
        address from,
        address to,
        string memory message
    ) internal returns (bool, string memory) {
        if (keccak256(abi.encodePacked(_mensajin[from] )) != keccak256(abi.encodePacked(message))) {
            return (false, "MiniMessage: Ese mensajin no esta");
        }
        _mensajin[from] = "";
        _mensajin[to] = message;
        emit Transfer(from, to, message);
        return (true, "");
    }

    /// Module callbacks ///

    function onRecvPacket(Packet.Data calldata packet, address relayer)
        external
        virtual
        override
        onlyIBC
        returns (bytes memory acknowledgement)
    {
        MiniMessagePacketData.Data memory data = MiniMessagePacketData.decode(
            packet.data
        );
        //(address sendercontrato, string memory mensajillo) = abi.decode(data.message, (address, string));
        bytes memory message_s = abi.encode(data.receiver.toAddress(0), data.message); //aqui mandaria mensajillo en vez de data.message 
        
        //en el momento en el que la Blockchain 2 recibe un string, se invoca a cacneacall,
        //funcion provisional que simplifica el proceso de volver a invocar
        //la funcion de envio en caso de que haya recibido un codigo correcto
        //aqui hard-coded como "cacnea"

        string memory respuesta = _cacneacall(message_s);
        
        bool buleano = false;

        if(keccak256(abi.encodePacked((respuesta))) == keccak256(abi.encodePacked(("cacturne")))){
            buleano = true;
        }else{
            buleano = true;
        }
        return(_newAcknowledgement(buleano));
            //_newAcknowledgement(_cacneacall(data.receiver.toAddress(0), data.message));
    }

    function onAcknowledgementPacket(
        Packet.Data calldata packet,
        bytes calldata acknowledgement,
        address relayer
    ) external virtual override onlyIBC {
        if (!_isSuccessAcknowledgement(acknowledgement)) {
            _refundTokens(MiniMessagePacketData.decode(packet.data));
        }
    }

    function onChanOpenInit(
        Channel.Order,
        string[] calldata connectionHops,
        string calldata portId,
        string calldata channelId,
        ChannelCounterparty.Data calldata counterparty,
        string calldata version
    ) external virtual override {}

    function onChanOpenTry(
        Channel.Order,
        string[] calldata connectionHops,
        string calldata portId,
        string calldata channelId,
        ChannelCounterparty.Data calldata counterparty,
        string calldata version,
        string calldata counterpartyVersion
    ) external virtual override {}

    function onChanOpenAck(
        string calldata portId,
        string calldata channelId,
        string calldata counterpartyVersion
    ) external virtual override {}

    function onChanOpenConfirm(
        string calldata portId,
        string calldata channelId
    ) external virtual override {}

    function onChanCloseConfirm(
        string calldata portId,
        string calldata channelId
    ) external virtual override {}

    function onChanCloseInit(
        string calldata portId,
        string calldata channelId
    ) external virtual override {}

    // Internal Functions //

    //Envia un paquete de datos (creado con la libreria PacketMssg)
    //por el canal especificado hasta la Blockchain B.
    //El enpaquetado se hace en bytes, la libreria ya la modificamos en el 
    //"paso anterior" de int a string para que cuente los saltos a dar para 
    //desenpaquetar correctamente. Es Packetmssg.sol, en ../lib

    //No tienes que preocuparte por canales ni puertos, usamos los 
    //de serie de YUI original, son muchas librerias y mejor no tocarlo
    function _sendPacket(
        MiniMessagePacketData.Data memory data, 
        string memory sourcePort,
        string memory sourceChannel,
        uint64 timeoutHeight
    ) internal virtual {
        (Channel.Data memory channel, bool found) = ibcHandler.getChannel(
            sourcePort,
            sourceChannel
        );
        require(found, "MiniMessage: channel not found");
        ibcHandler.sendPacket(
            Packet.Data({
                sequence: ibcHandler.getNextSequenceSend(
                    sourcePort,
                    sourceChannel
                ),
                source_port: sourcePort,
                source_channel: sourceChannel,
                destination_port: channel.counterparty.port_id,
                destination_channel: channel.counterparty.channel_id,
                data: MiniMessagePacketData.encode(data),
                timeout_height: Height.Data({
                    revision_number: 0,
                    revision_height: timeoutHeight
                }),
                timeout_timestamp: 0
            })
        );
    }

    function _newAcknowledgement(bool success)
        internal
        pure
        virtual
        returns (bytes memory)
    {
        bytes memory acknowledgement = new bytes(1);
        if (success) {
            acknowledgement[0] = 0x01;
        } else {
            acknowledgement[0] = 0x00;
        }
        return acknowledgement;
    }

    function _isSuccessAcknowledgement(bytes memory acknowledgement)
        internal
        pure
        virtual
        returns (bool)
    {
        require(acknowledgement.length == 1);
        return acknowledgement[0] == 0x01;
    }

//no aplica
    function _refundTokens(MiniMessagePacketData.Data memory data)
        internal
        virtual
    {
        require(_mint(data.sender.toAddress(0), data.message));
    }
}


        //Nota Fun Fact:
        //Cacnea es un Pokemon que evoluciona a Cacturne. Empece a usarlo como mi "to do" en
        //el TFG para no confundirlo con la palabra todo (all) en espanol.
        //Evoluciono a meme interno y ahora ya lo meto en todas partes.

        //Aqui seria mas fitting poner un Pokemon que evoluciona por intercambio
        //por eso de que pasa de una blockchain a otra, como Haunter a Gengar,
        //pero es lo que hay. Cacnea.