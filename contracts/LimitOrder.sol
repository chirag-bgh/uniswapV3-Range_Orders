// SPDX-License-Identifier: MIT

pragma solidity <0.8.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";
import "./UniswapUtils.sol";
import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolActions.sol";




contract UniswapLimitOrder is UniswapUtils {

    using SafeMath for uint256;
    using SafeCast for uint256;
    address constant factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;    
    mapping (uint256 => LimitOrder) private limitOrders; 
    INonfungiblePositionManager internal pm = INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);

    event LimitOrderCreated(
        address indexed owner, 
        uint256 indexed tokenId,
        uint160 sqrtPriceX96, 
        uint256 amount0, 
        uint256 amount1
    );

    event LimitOrderCollected(
        address indexed owner,
        uint256 indexed tokenId, 
        uint256 amount0, 
        uint256 amount1
    );

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

            require(params._token0 < params._token1,"Change the order");

            uint128 _liquidity;
            uint256 amount0;
            uint256 amount1;
            int24 _tickLower;
            int24 _tickUpper;

            IUniswapV3Pool _pool;

            PoolAddress.PoolKey memory _poolKey = PoolAddress.PoolKey({
            token0: params._token0,
            token1: params._token1,
            fee: params._fee
            });

            address _poolAddress = PoolAddress.computeAddress(factory,_poolKey);

            _pool = IUniswapV3Pool(_poolAddress);

            ( _tickLower , _tickUpper) = UniswapUtils.calculateLimitTicks(
                _pool,
                params._sqrtPriceX96,
                params._amount0, 
                params._amount1
            );

            (_tokenId, _liquidity,  amount0,  amount1) = pm.mint(INonfungiblePositionManager.MintParams({
                token0 : params._token0,
                token1: params._token1,
                fee: params._fee,
                tickLower: _tickLower,
                tickUpper: _tickUpper,
                amount0Desired : params._amount0,
                amount1Desired : params._amount1,
                amount0Min: params._amount0Min,
                amount1Min: params._amount1Min,
                recipient: msg.sender,
                deadline: uint256(-1)
            })

            );

            limitOrders[_tokenId] = LimitOrder({
                
                tickLower: _tickLower,
                tickUpper: _tickUpper,
                liquidity: _liquidity,                               
                tokensOwed0: amount0.toUint128(),
                tokensOwed1: amount1.toUint128()
            });       

            require(amount0 >= params._amount0Min && amount1 >= params._amount1Min);   

            emit LimitOrderCreated(
                msg.sender,
                _tokenId,
                params._sqrtPriceX96,
                params._amount0,
                params._amount1
            );

        }


    function processLimitOrder(uint256 _tokenId)
        external
        {

            LimitOrder memory limitOrder = limitOrders[_tokenId];

            pm.decreaseLiquidity(INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: _tokenId,
                liquidity: limitOrder.liquidity,
                amount0Min: limitOrder.tokensOwed0,
                amount1Min: limitOrder.tokensOwed1,
                deadline: uint256(-1)
            }));

            pm.collect(INonfungiblePositionManager.CollectParams({
                tokenId: _tokenId,
                recipient: msg.sender,
                amount0Max: type(uint128).max,
                amount1Max:type(uint128).max
            }));

            pm.burn(_tokenId);

            

        }


}