const main = async () => {
  //step 1: getCOntract
  //step 2: deploy and then deployed
  //step 3: get address
  //step 4: call function wait for it be mined
  const nftContractFactory = await hre.ethers.getContractFactory("MyEpicNFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to :", nftContract.address);

  let txn = await nftContract.makeAnEpicNFT();

  await txn.wait();

  // txn = await nftContract.makeAnEpicNFT();
  // await txn.wait();

  // const num = await nftContract.randomImage();
  // console.log(num);
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
