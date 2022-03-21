//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolActions.sol";

contract Limit_order {

    struct LimitOrderParams {
        address _token0; 
        address _token1; 
        uint24 _fee;
        uint160 _sqrtPriceX96;
        uint128 _amount0;
        uint128 _amount1;
        uint256 _amount0Min;
        uint256 _amount1Min;
    }
    
    function placeLimitOrder(LimitOrderParams calldata params)
        public payable override virtual returns (
            uint256 _tokenId
        ) {

        require(params._token0 < params._token1, "LOM_TE");

        int24 _tickLower;
        int24 _tickUpper;
        uint128 _liquidity;
        uint128 _orderType;
        IUniswapV3Pool _pool;

        PoolAddress.PoolKey memory _poolKey =
        PoolAddress.PoolKey({
            token0: params._token0,
            token1: params._token1,
            fee: params._fee
        });

        }       


    function processLimitOrder() public {
        //executes the swap
    } 





    
    
}
