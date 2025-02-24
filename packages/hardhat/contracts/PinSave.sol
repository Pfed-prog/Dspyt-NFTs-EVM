// SPDX-License-Identifier: MIT

pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract PinSave is ERC721 {
  bool internal locked;
  bool public isPostingBlocked;
  address public owner;
  uint public mintingFee;
  string public baseURI;

  modifier noReentrant() {
    require(!locked, "No re-entrancy");
    locked = true;
    _;
    locked = false;
  }

  struct Post {
    string cid;
    address author;
    bool excluded;
  }

  Post latestPost;
  uint256 public totalSupply;
  mapping(uint256 => Post) public postByTokenId;

  constructor(
    string memory _name,
    string memory _symbol,
    address _owner
  ) ERC721(_name, _symbol) {
    owner = _owner;
    baseURI = "https://gateway.pinata.cloud/ipfs/";
  }

  function tokenURI(
    uint tokenId
  ) public view virtual override returns (string memory) {
    string memory cid = getPostCid(tokenId);
    return string(abi.encodePacked(baseURI, cid));
  }

  function setBaseURI(string memory _baseURI) external {
    require(msg.sender == owner, "Not Owner");
    baseURI = _baseURI;
  }

  function setOwner(address _owner) external {
    require(msg.sender == owner, "Not Owner");
    owner = _owner;
  }

  function changeFee(uint newFee) external {
    require(msg.sender == owner, "Not Owner");
    mintingFee = newFee;
  }

  function withdrawFees() external {
    require(msg.sender == owner, "Only admin can withdraw fees");
    uint amount = address(this).balance;
    (bool success, ) = payable(owner).call{value: amount}("");
    require(success, "Failed to send fees");
  }

  function createPost(
    address receiver,
    string memory _cid
  ) public payable noReentrant {
    require(msg.value >= mintingFee, "Insufficient fee");

    latestPost.cid = _cid;
    latestPost.author = msg.sender;
    latestPost.excluded = isPostingBlocked;
    postByTokenId[totalSupply] = latestPost;

    _mint(receiver, ++totalSupply);
  }

  function blockPost(uint id) public {
    require(msg.sender == owner, "FORBIDDEN");
    postByTokenId[id - 1].excluded = true;
  }

  function createBatchPosts(address to, string[] memory _cid) public {
    uint256 len = _cid.length;
    for (uint256 i; i != len; ) {
      createPost(to, _cid[i]);
      unchecked {
        ++i;
      }
    }
  }

  function getPostOwner(uint id) public view returns (address) {
    return ownerOf(id);
  }

  function getPostCid(uint id) public view returns (string memory) {
    require(
      msg.sender == owner || !postByTokenId[id - 1].excluded,
      "Not Allowed"
    );
    return postByTokenId[id - 1].cid;
  }

  function getPostAuthor(uint id) public view returns (address) {
    require(
      msg.sender == owner || !postByTokenId[id - 1].excluded,
      "Not Allowed"
    );
    return postByTokenId[id - 1].author;
  }

  function isBlockedPost(uint id) public view returns (bool) {
    require(
      msg.sender == owner || !postByTokenId[id - 1].excluded,
      "Not Allowed"
    );
    return postByTokenId[id - 1].excluded;
  }

  function getPostData(
    uint id
  ) external view returns (address, address, string memory) {
    return (getPostOwner(id), getPostAuthor(id), getPostCid(id));
  }

  function getContractBalance() public view returns (uint) {
    return address(this).balance;
  }
}
