// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "hardhat/console.sol";

contract CryptoCats is ERC721URIStorage, Ownable, ERC721Burnable{
    constructor(address initialOwner) ERC721("CryptoCats", "CRT") Ownable(initialOwner){

    }
    
    function mint(address _to, uint256 _tokenId, string calldata _uri) external onlyOwner 
{
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _uri);
    }

     function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public override(ERC721, IERC721) {
        require( _msgSender() == ownerOf(tokenId), "Caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    // Manage approvals for transferring NFTs
    function approve(address to, uint256 tokenId) public override(ERC721, IERC721) {
        address owner = ownerOf(tokenId);
        require(to != owner, "Approval to current owner");

        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "Caller is not owner nor approved for all"
        );

        _approve(to, tokenId, owner);
    }

    // Set or unset an operator as approved for all of the caller's tokens
    function setApprovalForAll(address operator, bool approved) public override(ERC721, IERC721) {
        require(operator != _msgSender(), "Approve to caller");

        _setApprovalForAll(_msgSender(), operator, approved);
    }

    // Retrieve the metadata URI for a specific NFT
    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}
