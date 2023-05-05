const express = require('express');
const ethers = require('ethers');

const app = express();
app.use(express.json());

const port = 3000;
const nft = require('./config/indigg1155.json');

// Initialize the provider and contract objects
const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/23f6df0cf29e4939a55ac56bacfbb3a9');

const contract = new ethers.Contract(nft.address, nft.abi, provider);

app.get('/', (req, res) => {
  res.json({ message :"Hello World"  });
  const inBytes = ethers.utils.formatBytes32String("test");
  console.log(inBytes);
})

// Define the API endpoints
app.get('/exists/:id', async (req, res) => {
    const id = req.params.id;
  
    try {
      const exists = await contract.exists(id);
      res.json({
        id,
        exists,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error checking if ID exists');
    }
});

app.get('/balanceOf/:account/:id', async (req, res) => {
    const account = req.params.account;
    const id = req.params.id;
  
    try {
      const balance = await contract.balanceOf(account, id);
      res.json({
        account,
        id,
        balance: balance.toString(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting balance');
    }
});


app.get('/balanceOf/:owner', async (req, res) => {
  const owner = req.params.owner;
  console.log(`owner :`, owner);
  try {
    const balance = await contract.balanceOf(owner);
    res.json({
      owner,
      balance: balance.toString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving Balance');
  }
});

app.post('/mint', async (req, res) => {
    console.log(req.body);
    const { account, id, amount, data } = req.body;
    console.log(account, id, amount, data);
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, process.env.PROVIDER_URL);
    const contractWithSigner = contract.connect(signer);
    try {
      const transaction = await contractWithSigner.mint(account, id, amount, data);
      console.log(transaction);
      const receipt = await transaction.wait();
      console.log(receipt);
      res.json({
        message: 'NFT minted successfully',
        transactionHash: receipt.transactionHash,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error minting NFT');
    }
  });
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
