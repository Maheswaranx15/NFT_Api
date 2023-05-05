const express = require('express');
const ethers = require('ethers');

const app = express();
app.use(express.json());
const port = 3000;
const nft = require('./config/indigg721.json');

// Initialize the provider and contract objects
const provider = new ethers.providers.JsonRpcProvider('https://polygon-mumbai.infura.io/v3/23f6df0cf29e4939a55ac56bacfbb3a9');

const contract = new ethers.Contract(nft.address, nft.abi, provider);

app.get('/', (req, res) => {
  res.json({ message :"Hello World"  });
})

// Define the API endpoints
app.get('/nft/:tokenId', async (req, res) => {
  const tokenId = req.params.tokenId;
  console.log("tokenId : ", tokenId);
  try {
    const owner = await contract.ownerOf(tokenId);
    const tokenURI = await contract.tokenURI(tokenId);
    res.json({
      tokenId,
      owner,
      tokenURI,
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving NFT data');
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
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, process.env.PROVIDER_URL);
  const contractWithSigner = contract.connect(signer);
  const { tokenURI, royaltyFee } = req.body;
  // Validate input parameters
  if (!tokenURI || typeof tokenURI !== 'string' || !royaltyFee || typeof royaltyFee !== 'number') {
    return res.status(400).json({ message: 'Invalid input parameters' });
  }
  try {
    // Mint the NFT
    const transaction = await contractWithSigner.mint(tokenURI, royaltyFee);
    const receipt = await transaction.wait();
    const tokenId = receipt.events[0].args[2];

    // Return a success response
    res.json({
      message: 'NFT minted successfully',
      transactionHash: receipt.transactionHash,
      tokenId: tokenId.toString(),
    });
  } catch (error) {
    console.error(error);

    // Return an error response
    res.status(500).json({ message: 'Error minting NFT' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
