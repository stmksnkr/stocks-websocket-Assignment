// src/App.js
import React, { useState, useEffect } from 'react';
// import io from 'socket.io-client';

// const socket = io(process.env.REACT_APP_BACKEND_URL);
const App = () => {
  const [numStocks, setNumStocks] = useState(0);
  const [stocks, setStocks] = useState([]);

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    setNumStocks(value <= 20 ? value : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // alert("one subitted")
    fetchStocks();
    console.log("i am here");
  };


  const fetchStocks = async () => {
    try {
      // const requestData = {
      //   // Your POST data goes here
      //   stockTickerSymbol: stockSymbol,
      //   date: date,
      // };
      // const response = await axios.post(url, requestData);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL} ?limit=${numStocks}`);
      console.log(response);
      console.log("i am here");
      const result = await response.json();
      // console.log(result.tickers);
      // setStocks(result.tickers);

      // Subscribe to WebSocket updates for the selected stocks
      const stockIds = result.tickers.map((stock) => stock.ticker);
      console.log(stockIds) 
      // socket.emit('subscribeToStocks', stockIds);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const handleLiveStockData = (liveData) => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          liveData.find((liveStock) => liveStock.symbol === stock.ticker)
            ? { ...stock, lastTrade: { price: liveData.find((liveStock) => liveStock.symbol === stock.ticker).lastPrice } }
            : stock
        )
      );
    };

    // socket.on('liveStockData', handleLiveStockData);

    // return () => {
    //   socket.off('liveStockData', handleLiveStockData);
    // };
  }, []);

  return (
    <div>
      <h1>Stocks List</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Number of Stocks (Not more than 20):
          <input type="number" value={numStocks} onChange={handleInputChange} />
        </label>
        <button type="submit">Fetch Stocks</button>
      </form>
      <ul>
        {stocks.map((stock) => (
          <li key={stock.ticker}>
            <strong>{stock.ticker}</strong>: {stock.lastTrade ? stock.lastTrade.price : 'N/A'}
          </li>
        ))}
      </ul>
      <p onSubmit={handleSubmit}> Rendered Value: {numStocks}</p>

    </div>
  );
};

export default App;
