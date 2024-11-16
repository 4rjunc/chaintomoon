// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract ChainPortalNFT is ERC721, ERC721Enumerable, ERC721Burnable {
	using EnumerableSet for EnumerableSet.UintSet;
	using SafeERC20 for IERC20;

	uint8 public constant USDC_OXYGEN_RATE = 10;

	struct Metadata {
		uint256 tokenId;
		address owner;
		uint256 score;
		uint256 oxygen;
	}

	IERC20 public immutable usdcToken;

	uint256 public nextTokenId;
	EnumerableSet.UintSet private tokenIds;
	mapping(uint256 => Metadata) tokenMetadatas;

	event ScoreUpdated(
		uint256 indexed tokenId,
		address indexed owner,
		uint256 indexed score
	);
	event OxygenUpdated(
		uint256 indexed tokenId,
		address indexed owner,
		uint256 indexed oxygen
	);

	error NotOwner();

	constructor(address _usdcToken) ERC721("ChainPortal", "CPT") {
		usdcToken = IERC20(_usdcToken);
	}

	function safeMint() public {
		uint256 tokenId = nextTokenId++;
		tokenIds.add(tokenId);

		Metadata storage metadata = tokenMetadatas[tokenId];
		metadata.tokenId = tokenId;
		metadata.owner = _msgSender();

		_safeMint(_msgSender(), tokenId);
	}

	function updateScore(uint256 _tokenId, uint256 _score) public {
		address owner = _requireOwned(_tokenId);

		if (owner != _msgSender()) {
			revert NotOwner();
		}

		tokenMetadatas[_tokenId].score = _score;

		emit ScoreUpdated(_tokenId, _msgSender(), _score);
	}

	function buyOxygen(uint256 _usdcAmount, uint256 _tokenId) public {
		address owner = _requireOwned(_tokenId);

		if (owner != _msgSender()) {
			revert NotOwner();
		}

		uint256 oxygen = (_usdcAmount * 10) / 1e6;
		tokenMetadatas[_tokenId].oxygen = oxygen;

		usdcToken.safeTransferFrom(msg.sender, address(this), _usdcAmount);

		emit OxygenUpdated(_tokenId, _msgSender(), oxygen);
	}

	function getAllTokenIds() public view returns (uint256[] memory) {
		uint256[] memory allTokenIds = new uint256[](tokenIds.length());

		for (uint256 i = 0; i < tokenIds.length(); i++) {
			allTokenIds[i] = tokenIds.at(i);
		}
		return allTokenIds;
	}

	function getAllTokenMetadatas() public view returns (Metadata[] memory) {
		Metadata[] memory allTokenMetadatas = new Metadata[](tokenIds.length());

		for (uint256 i = 0; i < tokenIds.length(); i++) {
			allTokenMetadatas[i] = tokenMetadatas[tokenIds.at(i)];
		}
		return allTokenMetadatas;
	}

	function burn(uint256 _tokenId) public override {
		tokenIds.remove(_tokenId);
		delete tokenMetadatas[_tokenId];

		_update(address(0), _tokenId, _msgSender());
	}

	// The following functions are overrides required by Solidity.

	function _update(
		address to,
		uint256 tokenId,
		address auth
	) internal override(ERC721, ERC721Enumerable) returns (address) {
		if (to != address(0)) {
			tokenMetadatas[tokenId].owner = to;
			delete tokenMetadatas[tokenId].score;
		}

		return super._update(to, tokenId, auth);
	}

	function _increaseBalance(
		address account,
		uint128 value
	) internal override(ERC721, ERC721Enumerable) {
		super._increaseBalance(account, value);
	}

	function supportsInterface(
		bytes4 interfaceId
	) public view override(ERC721, ERC721Enumerable) returns (bool) {
		return super.supportsInterface(interfaceId);
	}
}
