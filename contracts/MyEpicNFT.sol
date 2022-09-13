// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.1;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract MyEpicNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("RaghavNFT", "RJ") {
        console.log("This is my NFT contract. Whoa!");
    }


    uint256 nonce = 50;
    uint256 nonce2 = 50;

    string[] imageUrls = [
        "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif",
        "https://giphy.com/clips/hamlet-meme-emotional-damage-d9P5HfhXRNRj9JDPe9",
        "https://media.giphy.com/media/d3mlE7uhX8KFgEmY/giphy.gif",
        "https://media.giphy.com/media/H5C8CevNMbpBqNqFjl/giphy.gif",
        "https://media.giphy.com/media/AAsj7jdrHjtp6/giphy.gif",
        "https://media.giphy.com/media/AAsj7jdrHjtp6/giphy.gif",
        "https://media.giphy.com/media/cF7QqO5DYdft6/giphy.gif",
        "https://media.giphy.com/media/bcrOR2stk6tKIxqPOZ/giphy.gif",
        "https://media.giphy.com/media/JRE3AvLsSRXg360F6l/giphy.gif",
        "https://media.giphy.com/media/3Owa0TWYqHi5RZYGql/giphy.gif",
        "https://media.giphy.com/media/kd9BlRovbPOykLBMqX/giphy.gif",
        "https://media.giphy.com/media/l22ysLe54hZP0wubek/giphy.gif",
        "https://media.giphy.com/media/BmmfETghGOPrW/giphy.gif",
        "https://media.giphy.com/media/QMHbvQvD5ApYjv797Z/giphy.gif"
    ];
    string[] randomWords = [
        "iron",
        "coal",
        "straw",
        "hunter",
        "song",
        "flower",
        "chance",
        "grain",
        "may",
        "ice",
        "main",
        "garden",
        "season",
        "pitch",
        "series",
        "ride",
        "came",
        "active",
        "hollow",
        "block"
    ];

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    function randomImage() public returns (string memory) {
        nonce++;
        uint256 num = (uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))
        ) % imageUrls.length) - 1;
        return imageUrls[num];
    }

    function randomWord() public returns (string memory) {
        nonce2++;
        uint256 word = uint256(
            keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce2))
        ) % randomWords.length;
        return randomWords[word];
    }


    function makeAnEpicNFT() public {
        uint256 newItemId = _tokenIds.current();
        string memory imageUrl = randomImage();
        string memory _randomWord = randomWord();
        string memory json = Base64.encode(
            bytes(
                
                string(
                    abi.encodePacked(
                        '{"name": "',
                        // We set the title of our NFT as the generated word.
                        _randomWord,
                        '", "description": "A highly acclaimed collection of weird gifs.", "image": "',
                        imageUrl,
                        '"}'
                    )
                )
            )
        );
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        console.log(
            "An NFT w/ ID %s has been minted to %s",
            newItemId,
            msg.sender
        );
        _tokenIds.increment();
        emit NewEpicNFTMinted(msg.sender, newItemId);
    }
}
