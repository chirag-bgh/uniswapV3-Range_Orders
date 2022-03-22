// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity <0.8.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";

import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "@uniswap/v3-periphery/contracts/libraries/OracleLibrary.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol";

import "./IUniswapUtils.sol";

contract UniswapUtils is IUniswapUtils {

    function calculateLimitTicks(
        IUniswapV3Pool _pool,
        uint160 _sqrtPriceX96,
        uint256 _amount0,
        uint256 _amount1
    ) external override view
    returns (
        int24 _lowerTick,
        int24 _upperTick,
        uint128 _liquidity,
        uint128 _orderType
    ) {

        int24 tickSpacing = _pool.tickSpacing();
        (uint160 sqrtRatioX96,, , , , , ) = _pool.slot0();

        int24 _targetTick = TickMath.getTickAtSqrtRatio(_sqrtPriceX96);

        int24 tickFloor = _floor(_targetTick, tickSpacing);

        return _checkLiquidityRange(
            tickFloor - tickSpacing,
            tickFloor,
            tickFloor,
            tickFloor + tickSpacing,
            _amount0,
            _amount1,
            sqrtRatioX96,
            tickSpacing
        );

    }

    function _floor(int24 tick, int24 _tickSpacing) internal pure returns (int24) {
        int24 compressed = tick / _tickSpacing;
        if (tick < 0 && tick % _tickSpacing != 0) compressed--;
        return compressed * _tickSpacing;
    }

    function _checkLiquidityRange(int24 _bidLower, int24 _bidUpper,
        int24 _askLower, int24 _askUpper,
        uint256 _amount0, uint256 _amount1,
        uint160 sqrtRatioX96, int24 _tickSpacing) internal pure
    returns (int24 _lowerTick, int24 _upperTick, uint128 _liquidity, uint128 _orderType) {

        _checkRange(_bidLower, _bidUpper, _tickSpacing);
        _checkRange(_askLower, _askUpper, _tickSpacing);

        uint128 bidLiquidity = _liquidityForAmounts(sqrtRatioX96, _bidLower, _bidUpper, _amount0, _amount1);
        uint128 askLiquidity = _liquidityForAmounts(sqrtRatioX96, _askLower, _askUpper, _amount0, _amount1);

        require(bidLiquidity > 0 || askLiquidity > 0, "UUC_BAL");

        if (bidLiquidity > askLiquidity) {
            (_lowerTick, _upperTick, _liquidity, _orderType) = (_bidLower, _bidUpper, bidLiquidity, uint128(1));
        } else {
            (_lowerTick, _upperTick, _liquidity, _orderType) = (_askLower, _askUpper, askLiquidity, uint128(2));
        }
    }

    function _liquidityForAmounts(
        uint160 sqrtRatioX96,
        int24 tickLower,
        int24 tickUpper,
        uint256 amount0,
        uint256 amount1
    ) internal pure returns (uint128) {
        return
        LiquidityAmounts.getLiquidityForAmounts(
            sqrtRatioX96,
            TickMath.getSqrtRatioAtTick(tickLower),
            TickMath.getSqrtRatioAtTick(tickUpper),
            amount0,
            amount1
        );
    }

    function _checkRange(int24 _tickLower, int24 _tickUpper, int24 _tickSpacing) internal pure {

        require(_tickLower < _tickUpper, "UUC_TLU");
        require(_tickLower >= TickMath.MIN_TICK, "UUC_TLMIN");
        require(_tickUpper <= TickMath.MAX_TICK, "UUC_TAMAX");
        require(_tickLower % _tickSpacing == 0, "UUC_TLS");
        require(_tickUpper % _tickSpacing == 0, "UUC_TUS");
    }

}