pragma solidity <0.8.0;
pragma abicoder v2;

import "./IPosition.sol";

contract Position {
    IPosition internal position = IPosition(0x686497f9E8bf13F6E89382c5249C87A6df49976d);

    function getPosition(uint256 tokenId) public view returns (PositionInfo memory) {
        return position.getPositionInfoByTokenId(tokenId);
    }
}