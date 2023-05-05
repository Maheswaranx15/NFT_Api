// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Indigg1155 is ERC1155, Ownable, ERC1155Burnable, ERC1155Supply, ERC2981 {

    mapping(uint256 => string) public tokenURI;

    constructor(address _receiver, uint96 _feeNumerator, string memory _baseURI) ERC1155(_baseURI) {
        _setDefaultRoyalty(_receiver, _feeNumerator);
    }

    function setURI(uint256 _id, string memory _uri) external onlyOwner {
        tokenURI[_id] = _uri;
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function batchMintToAddresses(address[] calldata accounts, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        uint256 length = accounts.length;
        for (uint256 i; i<length;) {
            _mint(accounts[i], id, amount, data);
            unchecked {
                ++i;
            }
        }
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function setDefaultRoyalty(address receiver, uint96 feeNumerator) public onlyOwner {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
    
    function uri(uint256 _id) public view override returns (string memory) {
        return tokenURI[_id];
    }
}