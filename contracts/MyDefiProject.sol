pragma solidty ^0.7.0;

interface IUniswap {
    
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
        
    function WETH() external pure returns (address);
}

interface IERC20 {
    
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);

}

contract MyDefiProject {
    
    IUniswap uniswap;
    
    constructor(address _uniswap) public {
        
        uniswap = IUniswap(_uniswap);
    }
    
    function swapTokensForEth (
        address _token,
        uint _amountIn,
        uint _amountOutMin,
        uint _deadline)
        external {
            
        IERC20(token).transferFrom(msg.sender, address(this), _amountIn);
        address[] memory path = new address[](2);
        path[0] = token;
        path[1] = uniswap.WETH();
        IERC20(token).approve(address(uniswap), _amountIn);
        uniswap.swapExactTokensForETH(_amountIn, _amountOutMin, _path, msg.sender, _deadline)
            
    }
    
    
    
    
    
    
    
    
}














































































