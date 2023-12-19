// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3001;

app.use(express.json());


// https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09?apiKey=_WAAy6NMsHKr5pJfTpJ3D9KUBf8csFNM
// Endpoint to fetch live stock data from Polygon API







app.get('/stocks/fetch',async(req,res)=>{
    const data =[{
        name: "AppleLinc",
        id:"AAPL",
    }]
    return res.json({data:data})
})

// range/{multiplier}/{timespan}/{from}/{to}


stocksTicker="AAPL"
from="2023-01-09"
to="2023-01-09"
multiplier=5

adjusted ="true"
Sort ="asc"
limit=120

app.get('/stocks/fetchData', async (req, res) => {

    const stocksTicker="AAPL"
    const from="2023-01-09"
    const to="2023-01-09"
    const multiplier=5
    const adjusted ="true"
    const sort ="asc"
    const limit=60
    const timespan = "minute"
  try {
    console.log("starting req");
    const apiKey = '_WAAy6NMsHKr5pJfTpJ3D9KUBf8csFNM';
    stockId= 'AAPL'
    
       const url = `https://api.polygon.io/v2/aggs/ticker/${stocksTicker}/range/${multiplier}/${timespan}/${from}/${to}`
        // const url1=`https://api.polygon.io/v2/aggs/ticker/AAPL/range/5/second/2023-01-09/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=_WAAy6NMsHKr5pJfTpJ3D9KUBf8csFNM`
    const response = await axios.get(url, {
      params: {
        apiKey,
        adjusted,
        limit,
        sort
      },
    });
    // const response = await axios.get(url1)

    res.json(response.data);
  } catch (error) {
    console.error(`error in fetching from polygon ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected');

  // Emit live stock data every 10 seconds (adjust as needed)
  setInterval(async () => {
    try {
      const apiKey = '_WAAy6NMsHKr5pJfTpJ3D9KUBf8csFNM';
      const response = await axios.get(url, {
        params: {
          apiKey,
        },
      });

      const liveData = response.data.tickers.map((ticker) => ({
        symbol: ticker.ticker,
        lastPrice: ticker.lastTrade ? ticker.lastTrade.price : 0,
      }));

      socket.emit('liveStockData', liveData);
    } catch (error) {
      console.error(error);
    }
  }, 5000);
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
