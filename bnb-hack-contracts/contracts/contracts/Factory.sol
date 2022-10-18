pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ScoreToken.sol";
import "./NFT.sol";

contract Factory is Ownable {
    struct Collection {
        //   NFT itemsContract;
        address owner;
        ScoreToken token;
    }

    /* struct ItemInfo {
        uint free;
        uint total;
    }*/

    bytes32 public constant MINER_ROLE = keccak256("MINER_ROLE");

    mapping(NFT => Collection) public collections;
    //  mapping(NFT => ItemInfo) public items;

    event CreateCollection(NFT collection, ScoreToken token, address owner);

    modifier onlyCollectionOwner(NFT collection) {
        require(
            collections[collection].owner == msg.sender,
            "Only collection owner"
        );
        _;
    }

    function createCollection() external {
        NFT collection = new NFT("");
        //     NFT itemsContract = new NFT(_itemUri);
        ScoreToken token = new ScoreToken("ScoreToken");

        collections[collection] = Collection({
            // itemsContract: itemsContract,
            owner: msg.sender,
            token: token
        });
        emit CreateCollection(collection, token, msg.sender);
    }

    function creatAchievement(
        NFT collection,
        string calldata newUri,
        uint value
    ) public onlyCollectionOwner(collection) {
        collection.createItem(value, newUri);
    }

    /*function creatItem(
        NFT collection,
        string calldata newUri,
        uint value,
        uint total
    ) public onlyCollectionOwner(collection) {
        NFT itemsContract = collections[collection].itemsContract;
        itemsContract.createItem(value, newUri);

        items[itemsContract] = ItemInfo({free: total, total: total});
    }*/

    function mint(
        NFT collection,
        address receiver,
        uint id
    ) public onlyOwner {
        collection.mint(receiver, id);

        uint256 value = collection.values(id);
        collections[collection].token.mint(receiver, value);
    }

    /* function buy(NFT collection, uint id) public {
        Collection memory c = collections[collection];

        uint256 value = c.itemsContract.values(id);

        require(items[c.itemsContract].free > 0, "No more items");
        require(c.token.balanceOf(msg.sender) >= value, "Not enough tokens");

        c.itemsContract.mint(msg.sender, id);
        c.token.burn(msg.sender, value);

        items[c.itemsContract].free--;
    }*/
}
