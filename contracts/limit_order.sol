//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.6;

import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolActions.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/libraries/PoolAddress.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "./UniswapUtils.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";


contract Limit_order is UniswapUtils {

    using SafeMath for uint256;
    using SafeCast for uint256;

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
        address pool;
        uint32 monitor;
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;
        bool processed;
        uint256 feeGrowthInside0LastX128;
        uint256 feeGrowthInside1LastX128;
        uint128 tokensOwed0;
        uint128 tokensOwed1;
    }

    struct MintCallbackData {
        PoolAddress.PoolKey poolKey;
        address payer;
    }

    address constant factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;

    event LimitOrderCreated(address indexed owner, uint256 indexed tokenId,uint128 orderType, 
                             uint160 sqrtPriceX96, uint256 amount0, uint256 amount1);

    function placeLimitOrder(LimitOrderParams calldata params) public payable virtual override returns (uint256 _tokenId) {

        require(params._token0 < params._token1,"Change the order");

        int24 _tickLower;
        int24 _tickUpper;
        uint128 _liquidity;
        uint128 _orderType;
        IUniswapV3Pool _pool;

        PoolAddress.PoolKey memory _poolKey = PoolAddress.PoolKey({
            token0: params._token0,
            token1: params._token1,
            fee: params._fee
        });

        address _poolAddress = PoolAddress.computeAddress(address(factory),_poolKey);

        require(_poolAddress != address(0), "Invalid token(s)");
        _pool = IUniswapV3Pool(_poolAddress);

        (_tickLower, _tickUpper, _liquidity, _orderType) = utils
            .calculateLimitTicks(
                _pool,
                params._sqrtPriceX96,
                params._amount0,
                params._amount1
            );

        {
            (uint256 _amount0, uint256 _amount1) = _pool.mint(
                address(this),
                _tickLower,
                _tickUpper,
                _liquidity,
                abi.encode(
                    MintCallbackData({poolKey: _poolKey, payer: msg.sender})
                )
            );

            require(_amount0 >= params._amount0Min && _amount1 >= params._amount1Min);       
            _mint(msg.sender, (_tokenId = nextId));    

            (, uint256 _feeGrowthInside0LastX128, uint256 _feeGrowthInside1LastX128, , ) = _pool.positions(
                PositionKey.compute(address(this), _tickLower, _tickUpper)
            );
        
        }

        emit LimitOrderCreated(
            msg.sender,
            _tokenId,
            _orderType,
            params._sqrtPriceX96,
            params._amount0,
            params._amount1
        );
    }




    function processLimitOrder(uint256 _tokenId) external override returns (uint128 _amount0, uint128 _amount1) {

        LimitOrder storage limitOrder = limitOrders[_tokenId];
        require(!limitOrder.processed);

        // remove liqudiity
        (_amount0, _amount1) = _removeLiquidity(
            IUniswapV3Pool(limitOrder.pool),
            limitOrder.tickLower,
            limitOrder.tickUpper,
            limitOrder.liquidity,
            limitOrder.feeGrowthInside0LastX128,
            limitOrder.feeGrowthInside1LastX128
        );

        limitOrder.liquidity = 0;
        limitOrder.processed = true;
        limitOrder.tokensOwed0 = _amount0;
        limitOrder.tokensOwed1 = _amount1;

        address _owner = ownerOf(_tokenId);

        // update balance
        uint256 balance = funding[_owner];
                
        // collect the funds
        _collect(
            _tokenId,
            IUniswapV3Pool(limitOrder.pool),
            limitOrder.tickLower,
            limitOrder.tickUpper,
            limitOrder.tokensOwed0,
            limitOrder.tokensOwed1,
            _owner
        );

        emit LimitOrderProcessed(msg.sender, _tokenId, _serviceFeePaid);
    }
}
