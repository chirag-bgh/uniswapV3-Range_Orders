// SPDX-License-Identifier: MIT

pragma solidity <0.8.0;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/SafeCast.sol";
import "./UniswapUtils.sol";
import "@uniswap/v3-core/contracts/interfaces/pool/IUniswapV3PoolActions.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract UniswapLimitOrder is UniswapUtils {
    using TransferHelper for *;
    using SafeMath for uint256;
    using SafeCast for uint256;
    address constant nfpm = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;
    address constant factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    mapping(uint256 => LimitOrder) private limitOrders;
    mapping(address => uint256) public ownerToNFT;
    mapping(uint256 => address) private NFTToowner;
    INonfungiblePositionManager internal pm = INonfungiblePositionManager(nfpm);

    event LimitOrderCreated(
        address indexed owner,
        uint256 indexed tokenId,
        
        
        bool indexed token0To1
    );

    event LimitOrderCollected(
        address indexed owner,
        uint256 indexed tokenId,
        uint256 amount
        
    );

    struct LimitOrderParams {
        address _token0;
        address _token1;
        uint24 _fee;
        uint160 _sqrtPriceX96;
        uint256 amount;
        uint256 amountMin;
        bool token0To1;
    }

    struct LimitOrder {
        int24 tickLower;
        int24 tickUpper;
        uint128 liquidity;
        uint128 tokensOwed0;
        uint128 tokensOwed1;
        bool token0To1;
    }

    function placeLimitOrder(LimitOrderParams calldata params)
        public
        payable
        virtual
        returns (uint256 _tokenId)
    {
        
        uint256 _amount0;
        uint256 _amount1;
        

        if (params.token0To1) {
            
            _amount0 = params.amount;
            _amount1 = 0;
            
            TransferHelper.safeTransferFrom(
                params._token0,
                msg.sender,
                address(this),
                _amount0
            );
            TransferHelper.safeApprove(params._token0, nfpm, _amount0);
        } else {
            
            _amount1 = params.amount;
            _amount0 = 0;
            
            TransferHelper.safeTransferFrom(
                params._token1,
                msg.sender,
                address(this),
                _amount1
            );
            TransferHelper.safeApprove(params._token1, nfpm, _amount1);
        }

        require(params._token0 < params._token1, "Change the order");
        // user should pass order type, take tokens from his account accordingly
        // uint256 _amount0;
        // uint256 _amount1;
        int24 _tickLower;
        int24 _tickUpper;

        IUniswapV3Pool _pool;
        PoolAddress.PoolKey memory _poolKey = PoolAddress.PoolKey({
            token0: params._token0,
            token1: params._token1,
            fee: params._fee
        });
        address _poolAddress = PoolAddress.computeAddress(factory, _poolKey);
        _pool = IUniswapV3Pool(_poolAddress);

        (_tickLower, _tickUpper) = UniswapUtils.calculateLimitTicks(
            _pool,
            params._sqrtPriceX96,
            _amount0,
            _amount1
        );

        uint128 _liquidity;
        uint256 amount0;
        uint256 amount1;
        (_tokenId, _liquidity, amount0, amount1) = pm.mint(
            INonfungiblePositionManager.MintParams({
                token0: params._token0,
                token1: params._token1,
                fee: params._fee,
                tickLower: _tickLower,
                tickUpper: _tickUpper,
                amount0Desired: _amount0,
                amount1Desired: _amount1,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: uint256(-1)
            })
        );

        limitOrders[_tokenId] = LimitOrder({
            tickLower: _tickLower,
            tickUpper: _tickUpper,
            liquidity: _liquidity,
            tokensOwed0: amount0.toUint128(),
            tokensOwed1: amount1.toUint128(),
            token0To1: params.token0To1
        });

        // nft -> owner
        NFTToowner[_tokenId] = msg.sender;

        emit LimitOrderCreated(
            msg.sender,
            _tokenId,                   
           
            params.token0To1
        );
    }

    function processLimitOrder(uint256 _tokenId) external
    returns (uint256 _amount) {

        require(msg.sender == NFTToowner[_tokenId] );  
        LimitOrder memory limitOrder = limitOrders[_tokenId];

        pm.decreaseLiquidity(
            INonfungiblePositionManager.DecreaseLiquidityParams({
                tokenId: _tokenId,
                liquidity: limitOrder.liquidity,
                amount0Min: limitOrder.tokensOwed0,
                amount1Min: limitOrder.tokensOwed1,
                deadline: uint256(-1)
            })
        );

        pm.collect(
            INonfungiblePositionManager.CollectParams({
                tokenId: _tokenId,
                recipient: NFTToowner[_tokenId],
                amount0Max: type(uint128).max,
                amount1Max: type(uint128).max
            })
        );

        pm.burn(_tokenId);

        emit LimitOrderCollected(NFTToowner[_tokenId], _tokenId, _amount);
    }
}
