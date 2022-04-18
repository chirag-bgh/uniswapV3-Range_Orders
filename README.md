# Welcome to UniOrders



## Features
The problem UniOrders solves:
Currently to set a limit order on UniswapV3 , user must provide one token that he want to swap for and must keep an eye on the spot price to reach his desired price. Once the spot price reach his desired price, he must remove the liquidity before the spot price moves back in the range. The entire process is too tedious and inefficient for the user.

Our app solves the problem by automating the complete process right from placing the limit order and removing the liquidity after processing it. 

Working of the app: 
User first places his limit order by providing the inputs. Once the dApp confirms the metamask transaction. The inputs are passed to smart contracts which then places the limit order. The sequencer running in the background fetches the event emitted after the order is placed and stores the indexed event params. Once the order is eligible to be executed, the sequencer calls another function which processes the limit order by removing user's liquidity and sends back to user.

![Screenshot from 2022-04-03 15-31-51](https://user-images.githubusercontent.com/76250660/161442747-cfaa90e0-292d-4617-b3fd-6683049cb3a0.png)

