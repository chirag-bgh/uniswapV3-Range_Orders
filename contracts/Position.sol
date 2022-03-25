//// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity <0.8.0;
pragma abicoder v2;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol";

contract Position {
        
    struct AmountInfo {
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

    address constant factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    INonfungiblePositionManager private nftManager = INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
    

    function amountcheck (uint256 tokenId) internal view returns (AmountInfo memory aInfo) {
        uint256 liquidity;
        (   
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            liquidity,
            ,
            ,
            ,

        ) = nftManager.positions(tokenId);
        
        {
            (aInfo.amount0, aInfo.amount1) = withdrawAmount(tokenId, liquidity, 0);
        }
    }
    
    function withdrawAmount(
        uint256 tokenId,
        uint256 _liquidity,
        uint256 slippage
    )
        internal
        view
        returns (
            uint256 amount0,
            uint256 amount1
        )
    {

        AmountInfo memory amountInfo;
        
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;
        (
            ,
            ,
            token0,
            token1,
            fee,
            tickLower,
            tickUpper,
            liquidity,
            ,
            ,
            ,

        ) = nftManager.positions(tokenId);

        IUniswapV3Pool pool;
        PoolAddress.PoolKey memory _poolKey = PoolAddress.PoolKey({
            token0: token0,
            token1: token1,
            fee: fee
        });
        address _poolAddress = PoolAddress.computeAddress(factory, _poolKey);
        pool = IUniswapV3Pool(_poolAddress);

        {
            (uint160 sqrtPriceX96, , , , , , ) = pool.slot0();
            (amount0, amount1) = LiquidityAmounts.getAmountsForLiquidity(
                sqrtPriceX96,
                TickMath.getSqrtRatioAtTick(tickLower),
                TickMath.getSqrtRatioAtTick(tickUpper),
                uint128(amountInfo.liquidity <= _liquidity ? amountInfo.liquidity : _liquidity)
            );
        }
    }

}