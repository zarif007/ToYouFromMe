const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const payloadContractFactory = await hre.ethers.getContractFactory("PayloadPortal");
    const payloadContract = await payloadContractFactory.deploy();
    await payloadContract.deployed();

    console.log("Contract deployed to:", payloadContract.address);
    console.log("Contract deployed by:", owner.address);

    let payloadCount;
    payloadCount = await payloadContract.getTotalPayloads();

    // From me to myself
    let payloadTxn = await payloadContract.payload();

    await payloadTxn.wait();

    payloadCount = await payloadContract.getTotalPayloads();

    // From a random person 
    payloadTxn = await payloadContract.connect(randomPerson).payload();
    await payloadTxn.wait();

    payloadCount = await payloadContract.getTotalPayloads();
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
    // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
  };
  
  runMain();