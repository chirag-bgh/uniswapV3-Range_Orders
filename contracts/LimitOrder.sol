/**
 *Submitted for verification at Etherscan.io on 2022-03-26
*/
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

library Math {
    function sqrt(uint160 y) internal pure returns (uint160 z) {
        if (y > 3) {
            z = y;
            uint160 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
        // else z = 0 (default value)
    }
}

contract UniswapLimitOrder is UniswapUtils {
    using SafeMath for uint256;
    using SafeCast for uint256;
    address constant nfpm = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;
    address constant factory = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    mapping(uint256 => LimitOrder) private limitOrders;
    mapping(address => uint256) public ownerToNFT;
    mapping(uint256 => address) private NFTToowner;
    INonfungiblePositionManager internal pm = INonfungiblePositionManager(nfpm);

    address public _owner;

    constructor(address owner_) {
        _owner = owner_;
    }

    modifier onlyOwner(uint256 tokenId) {
        require(
            msg.sender == _owner || msg.sender == NFTToowner[tokenId],
            "Not an owner call"
        );
        _;
    }

    // event LimitOrderCreated(
    //     address owner,
    //     uint256 indexed tokenId,
    //     uint256 indexed amountIn1,
    //     uint256 indexed amountIn2,
    //     bool token0To1
    // );

    event LimitOrderCreated(
        address owner,
        address pool,
        uint256 indexed tokenId,
        int24[] tickOrder
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
        uint160 _price;
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

    function sqrt(uint160 _price) pure internal returns ( uint160 sqrtPriceX96) {

         sqrtPriceX96 = Math.sqrt(_price)*(2**96);
    }


    function transferAndApprove(
        uint256 amount,        
        uint160 price,
        uint24 _fee,
        address _token0,
        address _token1,
        bool token0To1
    ) internal returns (uint256 _amount0, uint256 _amount1, int24 _tickLower, int24 _tickUpper, int24 _tickCurrent, address pool) {
        if (token0To1) {
            _amount0 = amount;
            _amount1 = 0;

            TransferHelper.safeTransferFrom(
                _token0,
                msg.sender,
                address(this),
                _amount0
            );
            TransferHelper.safeApprove(_token0, nfpm, _amount0);
        } else {
            _amount1 = amount;
            _amount0 = 0;

            TransferHelper.safeTransferFrom(
                _token1,
                msg.sender,
                address(this),
                _amount1
            );
            TransferHelper.safeApprove(_token1, nfpm, _amount1);
        }

       uint160 _sqrtPriceX96 =  sqrt(price);


        IUniswapV3Pool _pool;
        PoolAddress.PoolKey memory _poolKey = PoolAddress.PoolKey({
            token0: _token0,
            token1: _token1,
            fee: _fee
        });

        address _poolAddress = PoolAddress.computeAddress(factory, _poolKey);
        _pool = IUniswapV3Pool(_poolAddress);
        pool = address(_pool);
        (,  _tickCurrent, , , , , ) = _pool.slot0();

        
        ( _tickLower,  _tickUpper) = UniswapUtils.calculateLimitTicks(
            _pool,
            _sqrtPriceX96,
            _amount0,
            _amount1
        );
    }
    

    function placeLimitOrder(LimitOrderParams calldata params)
        public
        payable
        virtual
        returns (uint256 _tokenId)
    {        
        (uint256 _amount0, uint256 _amount1, int24 _tickLower, int24 _tickUpper, int24 _tickCurrent, address pool) = transferAndApprove(
            params.amount,
            params._price,
            params._fee,
            params._token0,
            params._token1,            
            params.token0To1
        );

        require(params._token0 < params._token1, "Change the order");

        
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
        int24[] memory tickArr = new int24[](2);
        tickArr[0] = (_tickLower);
        tickArr[1] = (_tickUpper);
        tickArr[2] = (_tickCurrent);
        emit LimitOrderCreated(msg.sender, pool, _tokenId, tickArr);
    }

    function processLimitOrder(uint256 _tokenId)
        external
        onlyOwner(_tokenId)
        returns (uint256 _amount)
    {
        require(msg.sender == NFTToowner[_tokenId]);
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
