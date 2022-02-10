"use strict";(self.webpackChunkyui_docs_yui_ibc_solidity=self.webpackChunkyui_docs_yui_ibc_solidity||[]).push([[295],{1900:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return r},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return d},default:function(){return p}});var a=t(7462),o=t(3366),i=(t(7294),t(3905)),l=["components"],r={sidebar_position:3},c="Create a contract",s={unversionedId:"minitoken/contract",id:"minitoken/contract",isDocsHomePage:!1,title:"Create a contract",description:"We will implement a token that can be transferred between two ledgers using IBC.",source:"@site/docs/minitoken/contract.md",sourceDirName:"minitoken",slug:"/minitoken/contract",permalink:"/yui-docs/yui-ibc-solidity/minitoken/contract",tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Required preparations in advance",permalink:"/yui-docs/yui-ibc-solidity/minitoken/prerequisites"},next:{title:"Deploy contracts",permalink:"/yui-docs/yui-ibc-solidity/minitoken/deploy"}},d=[{value:"Basic Functions",id:"basic-functions",children:[{value:"constructor",id:"constructor",children:[],level:3},{value:"mint",id:"mint",children:[],level:3},{value:"burn",id:"burn",children:[],level:3},{value:"transfer",id:"transfer",children:[],level:3},{value:"balanceOf",id:"balanceof",children:[],level:3}],level:2},{value:"IBC-related",id:"ibc-related",children:[{value:"Packet",id:"packet",children:[],level:3},{value:"Modify constructor",id:"modify-constructor",children:[],level:3},{value:"sendTransfer",id:"sendtransfer",children:[],level:3},{value:"IModuleCallbacks",id:"imodulecallbacks",children:[{value:"onRecvPacket",id:"onrecvpacket",children:[],level:4},{value:"onAcknowledgementPacket",id:"onacknowledgementpacket",children:[],level:4}],level:3}],level:2},{value:"Topics that were not dealt with here",id:"topics-that-were-not-dealt-with-here",children:[{value:"Distinction between currency units",id:"distinction-between-currency-units",children:[],level:3}],level:2}],u={toc:d};function p(e){var n=e.components,t=(0,o.Z)(e,l);return(0,i.kt)("wrapper",(0,a.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"create-a-contract"},"Create a contract"),(0,i.kt)("p",null,"We will implement a token that can be transferred between two ledgers using IBC."),(0,i.kt)("p",null,"There is a token standard called ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/cosmos/ibc/tree/master/spec/app/ics-020-fungible-token-transfer"},"ICS-20"),",\nbut we will use a simple one here."),(0,i.kt)("p",null,"While ICS-20 uses denomination to distinguish the source ledger,\nthe MiniToken implemented here handles the issuer's ledger without distinction."),(0,i.kt)("h2",{id:"basic-functions"},"Basic Functions"),(0,i.kt)("p",null,"It has the following basic operational functions:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"mint: issue a new token for a given account"),(0,i.kt)("li",{parentName:"ul"},"burn: burn your own token"),(0,i.kt)("li",{parentName:"ul"},"transfer: Transfer your token to another account.")),(0,i.kt)("p",null,"It also has a state reference function:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"balanceOf: to get the token balance of an account.")),(0,i.kt)("p",null,"The following states are also available:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"balance: the balance of each account"),(0,i.kt)("li",{parentName:"ul"},"owner: An account that is allowed to perform privileged operations such as mint.")),(0,i.kt)("h3",{id:"constructor"},"constructor"),(0,i.kt)("p",null,"In this example, we simply use the account that generated the contract as the owner."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity",metastring:'title="contracts/app/MiniToken.sol"',title:'"contracts/app/MiniToken.sol"'},"address private owner;\n\nconstructor() public {\n    owner = msg.sender;\n}\n")),(0,i.kt)("h3",{id:"mint"},"mint"),(0,i.kt)("p",null,"Increments the token by the specified amount for the specified account.\nThe ",(0,i.kt)("inlineCode",{parentName:"p"},"_mint")," is defined because we want to call the logic later from other internal processes."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},'mapping(address => uint256) private _balances;\n\nfunction mint(address account, uint256 amount) onlyOwner external {\n    require(_mint(account, amount), "invalid address");\n}\n\nfunction _mint(address account, uint256 amount) internal returns (bool) {\n    if (account == address(0)) {\n        return false;\n    }\n    _balances[account] += amount;\n    return true;\n}\n')),(0,i.kt)("p",null,"We won't cover the description of modifier implementations such as ",(0,i.kt)("inlineCode",{parentName:"p"},"onlyOwner"),",\nso please refer to the source code if you are interested."),(0,i.kt)("h3",{id:"burn"},"burn"),(0,i.kt)("p",null,"Reduces tokens by the specified amount for the specified account."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},"function burn(address account, uint256 amount) onlyOwner external {\n    _burn(account, amount);\n}\n\nfunction _burn(address account, uint256 amount) internal returns (bool) {\n    uint256 accountBalance = _balances[account];\n    if (accountBalance < amount) {\n        return false;\n    }\n    _balances[account] = accountBalance - amount;\n    return true;\n}\n")),(0,i.kt)("h3",{id:"transfer"},"transfer"),(0,i.kt)("p",null,"Sends some tokens to another account."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},'function transfer(address to, uint256 amount) external {\n    require(to != address(0), "Token: invalid address");\n    uint256 balance = _balances[msg.sender];\n    require(_balances[msg.sender] >= amount, "Token: amount shortage");\n    _balances[msg.sender] -= amount;\n    _balances[to] += amount;\n}\n')),(0,i.kt)("h3",{id:"balanceof"},"balanceOf"),(0,i.kt)("p",null,"Returns the balance of an account."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},'function balanceOf(address account) external view returns (uint256) {\n    require(account != address(0), "Token: invalid address");\n    return _balances[account];\n}\n')),(0,i.kt)("h2",{id:"ibc-related"},"IBC-related"),(0,i.kt)("p",null,"Based on the above functions, we will implement the necessary processes for IBC."),(0,i.kt)("h3",{id:"packet"},"Packet"),(0,i.kt)("p",null,"Define an IBC Packet to be used for communication between ledgers."),(0,i.kt)("p",null,"If you want to know more about Packet, please refer to ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/cosmos/ibc/tree/master/spec/core/ics-004-channel-and-packet-semantics"},"ICS 004"),"\nfor more information."),(0,i.kt)("p",null,"MiniTokenPacketData holds the information necessary to transfer a MiniToken from the source ledger to the destination ledger."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-proto",metastring:'title="/proto/lib/Packet.proto"',title:'"/proto/lib/Packet.proto"'},"message MiniTokenPacketData {\n    // the token amount to be transferred\n    uint64 amount = 1;\n    // the sender address\n    bytes sender = 2;\n    // the recipient address on the destination chain\n    bytes receiver = 3;\n}\n")),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"amount: amount of tokens to send"),(0,i.kt)("li",{parentName:"ul"},"sender: the source account in the source ledger"),(0,i.kt)("li",{parentName:"ul"},"receiver: the destination account in the destination ledger")),(0,i.kt)("p",null,"Once you have defined the Packet\nUse ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/datachainlab/solidity-protobuf"},"solidity-protobuf")," to generate the sol file."),(0,i.kt)("p",null,"First, get solidity-protobuf and install the necessary modules."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"git clone https://github.com/datachainlab/solidity-protobuf.git\ncd solidity-protobuf\npip install -r requirements.txt\n")),(0,i.kt)("p",null,"Set this folder to the SOLPB_DIR environment variable."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"export SOLPB_DIR=<solidity-protobuf dir>\n")),(0,i.kt)("p",null,"Then, on the working directory of the tutorial, generate the sol file."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-sh"},"cd <tutorial dir>\nmake proto\n")),(0,i.kt)("h3",{id:"modify-constructor"},"Modify constructor"),(0,i.kt)("p",null,'As a contract of the IBC/TAO layer defined by yui-ibc-solidity, the following can be specified in MiniToken.\nThe TAO layer represents "transport, authentication, & ordering" and handles core IBC functions independent of the application logic.'),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"IBCHandler"),(0,i.kt)("li",{parentName:"ul"},"IBCHost")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},"IBCHandler ibcHandler;\nIBCHost ibcHost;\n\nconstructor(IBCHost host_, IBCHandler ibcHandler_) public {\n    owner = msg.sender;\n\n    ibcHost = host_;\n    ibcHandler = ibcHandler_;\n}\n")),(0,i.kt)("h3",{id:"sendtransfer"},"sendTransfer"),(0,i.kt)("p",null,"Adds a new manipulation function for Token.\nWe will add a new manipulation function for Token.\n",(0,i.kt)("inlineCode",{parentName:"p"},"sendTransfer")," is a method to send a token to the other party's ledger using the MiniTokenPacketData that we defined earlier."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},"function sendTransfer(\n    string calldata denom,\n    uint64 amount,\n    address receiver,\n    string calldata sourcePort,\n    string calldata sourceChannel,\n    uint64 timeoutHeight\n) external {\n    require(_burn(msg.sender, amount));\n\n    _sendPacket(\n        MiniTokenPacketData.Data({\n            amount: amount,\n            sender: abi.encodePacked(msg.sender),\n            receiver: abi.encodePacked(receiver)\n        }),\n        sourcePort,\n        sourceChannel,\n        timeoutHeight\n    );\n}\n")),(0,i.kt)("p",null,"The next step is to implement the Packet registration process ",(0,i.kt)("inlineCode",{parentName:"p"},"_sendPacket"),".\nBy calling ",(0,i.kt)("inlineCode",{parentName:"p"},"IBCHandler.sendPacket"),", the packet to be sent will be registered."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},'// These two variables can be passed when initializing Token contract.\n//IBCHandler ibcHandler;\n//IBCHost ibcHost;\n\nfunction _sendPacket(MiniTokenPacketData.Data memory data, string memory sourcePort, string memory sourceChannel, uint64 timeoutHeight) virtual internal {\n    (Channel.Data memory channel, bool found) = ibcHost.getChannel(sourcePort, sourceChannel);\n    require(found, "channel not found");\n    ibcHandler.sendPacket(Packet.Data({\n        sequence: ibcHost.getNextSequenceSend(sourcePort, sourceChannel),\n        source_port: sourcePort,\n        source_channel: sourceChannel,\n        destination_port: channel.counterparty.port_id,\n        destination_channel: channel.counterparty.channel_id,\n        data: MiniTokenPacketData.encode(data),\n        timeout_height: Height.Data({revision_number: 0, revision_height: timeoutHeight}),\n        timeout_timestamp: 0\n    }));\n}\n')),(0,i.kt)("h3",{id:"imodulecallbacks"},"IModuleCallbacks"),(0,i.kt)("p",null,"When the IBC Module receives a Channel handshake or a Packet, it needs to be called back to MiniToken.\nThe following interfaces are defined in yui-ibc-solidity."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},"interface IModuleCallbacks {\n    function onChanOpenInit(Channel.Order, string[] calldata connectionHops, string calldata portId, string calldata channelId, ChannelCounterparty.Data calldata counterparty, string calldata version) external;\n    function onChanOpenTry(Channel.Order, string[] calldata connectionHops, string calldata portId, string calldata channelId, ChannelCounterparty.Data calldata counterparty, string calldata version, string calldata counterpartyVersion) external;\n    function onChanOpenAck(string calldata portId, string calldata channelId, string calldata counterpartyVersion) external;\n    function onChanOpenConfirm(string calldata portId, string calldata channelId) external;\n    function onChanCloseInit(string calldata portId, string calldata channelId) external;\n    function onChanCloseConfirm(string calldata portId, string calldata channelId) external;\n\n    function onRecvPacket(Packet.Data calldata) external returns(bytes memory);\n    function onAcknowledgementPacket(Packet.Data calldata, bytes calldata acknowledgement) external;\n}\n")),(0,i.kt)("p",null,"Of the above, token-related processing is mainly handled in the following:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"onRecvPacket"),(0,i.kt)("li",{parentName:"ul"},"onAcknowledgementPacket")),(0,i.kt)("p",null,"If there is any processing that you want to perform when establishing a channel between ledgers, you will need to implement the following processing:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"onChanOpenInit"),(0,i.kt)("li",{parentName:"ul"},"onChanOpenTry"),(0,i.kt)("li",{parentName:"ul"},"onChanOpenAck"),(0,i.kt)("li",{parentName:"ul"},"onChanOpenConfirm"),(0,i.kt)("li",{parentName:"ul"},"onChanCloseInit"),(0,i.kt)("li",{parentName:"ul"},"onChanCloseConfirm")),(0,i.kt)("p",null,"In this case, we will not handle them specifically."),(0,i.kt)("p",null,"If you want to know more about Channel life cycle in IBC, please refer to the following:"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/cosmos/ibc/blob/ad99cb444ece8becae59f995b3371dc1ffc3ec5b/spec/core/ics-004-channel-and-packet-semantics/README.md#channel-lifecycle-management"},"https://github.com/cosmos/ibc/blob/ad99cb444ece8becae59f995b3371dc1ffc3ec5b/spec/core/ics-004-channel-and-packet-semantics/README.md#channel-lifecycle-management")),(0,i.kt)("h4",{id:"onrecvpacket"},"onRecvPacket"),(0,i.kt)("p",null,"Creates a new token for the specified payee account according to the contents of the Packet."),(0,i.kt)("p",null,"This function is called when a MiniTokenPacketData is received in the token transfer destination ledger."),(0,i.kt)("p",null,"It returns the success or failure of the process as an Acknowledgement."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},"function onRecvPacket(Packet.Data calldata packet) onlyIBC external virtual override returns (bytes memory acknowledgement) {\n    MiniTokenPacketData.Data memory data = MiniTokenPacketData.decode(packet.data);\n    return _newAcknowledgement(\n        _mint(data.receiver.toAddress(), data.amount)\n    );\n}\n")),(0,i.kt)("h4",{id:"onacknowledgementpacket"},"onAcknowledgementPacket"),(0,i.kt)("p",null,"Redeems the token against the originating account if the transaction fails at the destination."),(0,i.kt)("p",null,"This function is called when an Acknowledgement is received in the token transfer source ledger."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-solidity"},"function onAcknowledgementPacket(Packet.Data calldata packet, bytes calldata acknowledgement) onlyIBC external virtual override {\n    if (!_isSuccessAcknowledgement(acknowledgement)) {\n        _refundTokens(MiniTokenPacketData.decode(packet.data));\n    }\n}\n")),(0,i.kt)("h2",{id:"topics-that-were-not-dealt-with-here"},"Topics that were not dealt with here"),(0,i.kt)("p",null,"The token implemented here is different from ICS-20."),(0,i.kt)("p",null,"For an example of ICS-20 implementation, please refer to the following:"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/hyperledger-labs/yui-ibc-solidity/tree/main/contracts/app"},"https://github.com/hyperledger-labs/yui-ibc-solidity/tree/main/contracts/app")),(0,i.kt)("h3",{id:"distinction-between-currency-units"},"Distinction between currency units"),(0,i.kt)("p",null,"In ICS-20, the denomination or denom is represented as\n",(0,i.kt)("inlineCode",{parentName:"p"},"{ics20Port}/{ics20Channel}/{denom}"),"."),(0,i.kt)("p",null,"Using denom, it is possible to trace an ICS-20 token back to its origin Chain. For more information, please refer to the following:"),(0,i.kt)("p",null,(0,i.kt)("a",{parentName:"p",href:"https://github.com/cosmos/ibc-go/blob/main/modules/apps/transfer/spec/01_concepts.md#denomination-trace"},"https://github.com/cosmos/ibc-go/blob/main/modules/apps/transfer/spec/01_concepts.md#denomination-trace")))}p.isMDXComponent=!0}}]);