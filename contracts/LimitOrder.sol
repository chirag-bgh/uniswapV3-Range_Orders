// SPDX-License-Identifier: MIT

pragma solidity <0.8.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/NonfungiblePositionManager.sol";
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';


contract LimitOrder is UniswapUtils{

    using SafeMath for uint256;
    using SafeCast for uint256; 
    mapping (uint256 => LimitOrder) private limitOrders; 

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

    struct LimitOrder {
        
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;     
        uint128 tokensOwed0;
        uint128 tokensOwed1;
    } 

    function placeLimitOrder(LimitOrderParams calldata params) 
        public 
        payable 
        virtual         
        returns (uint256 _tokenId){




            (_tokenId , uint128 liquidity, uint256 amount0, uint256 amount1) = NonfungiblePositionManager.mint(
                params._token0,
                params._token1,
                params._fee,
                    ,  //ticklower
                    ,   //tickuper
                params._amount0,
                params._amount1,
                params._amount0Min,
                params._amount1Min,
                msg.sender,
                    //deadline

            );

            limitOrders[_tokenId] = LimitOrder({
                
                tickLower: _tickLower,
                tickUpper: _tickUpper,
                liquidity: liquidity,                               
                tokensOwed0: amount0.toUint128(),
                tokensOwed1: amount1.toUint128()
            });       

            require(amount0 >= params._amount0Min && amount1 >= params._amount1Min);   

        }


    function processLimitOrder(uint256 _tokenId)
        external
        returns ( uint256 _amount0, uint256 _amount1) {

            LimitOrder memory limitOrder = limitOrders[_tokenId];

            (uint256 _amount0, uint256 _amount1) = INonfungiblePositionManager.decreaseLiquidity(
                _tokenId,
                limitOrder.liquidity,
                limitOrder.tokensOwed0,
                limitOrder.tokensOwed1
            );

            INonfungiblePositionManager.collect(
                _tokenId,
                msg.sender,
                _amount0,
                _amount1
            );

            INonfungiblePositionManager.burn(_tokenId);

        }


}