const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function.
  let txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  totalNFTMinted = await nftContract.getTotalNumberOfNFTs();
  console.log(totalNFTMinted.toNumber());
  // Mint another NFT for fun.
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  totalNFTMinted = await nftContract.getTotalNumberOfNFTs();
  console.log(totalNFTMinted.toNumber());
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  totalNFTMinted = await nftContract.getTotalNumberOfNFTs();
  console.log(totalNFTMinted.toNumber());
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  totalNFTMinted = await nftContract.getTotalNumberOfNFTs();
  console.log(totalNFTMinted.toNumber());
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  totalNFTMinted = await nftContract.getTotalNumberOfNFTs();
  console.log(totalNFTMinted.toNumber());
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  totalNFTMinted = await nftContract.getTotalNumberOfNFTs();
  console.log(totalNFTMinted.toNumber());
  txn = await nftContract.makeAnEpicNFT();
  // Wait for it to be mined.
  await txn.wait();
  totalNFTMinted = await nftContract.getTotalNumberOfNFTs()
    console.log(totalNFTMinted.toNumber())
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
runMain();
