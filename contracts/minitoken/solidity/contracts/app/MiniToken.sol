// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@hyperledger-labs/yui-ibc-solidity/contracts/core/OwnableIBCHandler.sol";
import "solidity-bytes-utils/contracts/BytesLib.sol";
import "../lib/Packet.sol";

contract MiniToken is IIBCModule {
    IBCHandler ibcHandler;

    using BytesLib for *;

    address private owner;

    constructor(IBCHandler ibcHandler_) public {
        owner = msg.sender;

        ibcHandler = ibcHandler_;
    }

    event Mint(address indexed to, uint256 amount);

    event Burn(address indexed from, uint256 amount);

    event Transfer(address indexed from, address indexed to, uint256 amount);

    event SendTransfer(
        address indexed from,
        address indexed to,
        string sourcePort,
        string sourceChannel,
        uint64 timeoutHeight,
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "MiniToken: caller is not the owner");
        _;
    }

    modifier onlyIBC() {
        require(
            msg.sender == address(ibcHandler),
            "MiniToken: caller is not the ibcHandler"
        );
        _;
    }

    function sendTransfer(
        uint64 amount,
        address receiver,
        string calldata sourcePort,
        string calldata sourceChannel,
        uint64 timeoutHeight
    ) external {
        require(_burn(msg.sender, amount), "MiniToken: failed to burn");

        _sendPacket(
            MiniTokenPacketData.Data({
                amount: amount,
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
            amount
        );
    }

    mapping(address => uint256) private _balances;

    function mint(address account, uint256 amount) external onlyOwner {
        require(_mint(account, amount));
    }

    function burn(uint256 amount) external {
        require(_burn(msg.sender, amount), "MiniToken: failed to burn");
    }

    function transfer(address to, uint256 amount) external {
        bool res;
        string memory message;
        (res, message) = _transfer(msg.sender, to, amount);
        require(res, message);
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    function _mint(address account, uint256 amount) internal returns (bool) {
        _balances[account] += amount;
        emit Mint(account, amount);
        return true;
    }

    function _burn(address account, uint256 amount) internal returns (bool) {
        uint256 accountBalance = _balances[account];
        if (accountBalance < amount) {
            return false;
        }
        _balances[account] = accountBalance - amount;
        emit Burn(account, amount);
        return true;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal returns (bool, string memory) {
        if (_balances[from] >= amount) {
            return (false, "MiniToken: amount shortage");
        }
        _balances[from] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
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
        MiniTokenPacketData.Data memory data = MiniTokenPacketData.decode(
            packet.data
        );
        return
            _newAcknowledgement(_mint(data.receiver.toAddress(0), data.amount));
    }

    function onAcknowledgementPacket(
        Packet.Data calldata packet,
        bytes calldata acknowledgement,
        address relayer
    ) external virtual override onlyIBC {
        if (!_isSuccessAcknowledgement(acknowledgement)) {
            _refundTokens(MiniTokenPacketData.decode(packet.data));
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

    function _sendPacket(
        MiniTokenPacketData.Data memory data,
        string memory sourcePort,
        string memory sourceChannel,
        uint64 timeoutHeight
    ) internal virtual {
        (Channel.Data memory channel, bool found) = ibcHandler.getChannel(
            sourcePort,
            sourceChannel
        );
        require(found, "MiniToken: channel not found");
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
                data: MiniTokenPacketData.encode(data),
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

    function _refundTokens(MiniTokenPacketData.Data memory data)
        internal
        virtual
    {
        require(_mint(data.sender.toAddress(0), data.amount));
    }
}
