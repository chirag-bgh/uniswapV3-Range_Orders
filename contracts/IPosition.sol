pragma solidity <0.8.0;
pragma abicoder v2;

struct PositionInfo {
        address token0;
        address token1;
        address pool;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        int24 currentTick;
        uint128 liquidity;
        uint128 tokenOwed0;
        uint128 tokenOwed1;
        uint256 amount0;
        uint256 amount1;
        uint256 collectAmount0;
        uint256 collectAmount1;
    }

interface IPosition {
    function getPositionInfoByTokenId(uint256 tokenId) external view returns (PositionInfo memory pInfo);
}