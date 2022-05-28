const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const payloadContractFactory = await hre.ethers.getContractFactory("PayloadPortal");
    const payloadContract = await payloadContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.1"),
    });
    await payloadContract.deployed();

    console.log("Contract deployed to:", payloadContract.address);
    console.log("Contract deployed by:", owner.address);

    // Getting contract balance
    let contractBalance = await hre.ethers.provider.getBalance(payloadContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));

    // Getting total number of payloads
    // let payloadCount;
    // payloadCount = await payloadContract.getTotalPayloads();
    // console.log(payloadCount.toNumber());

    // From me to myself
    // let payloadTxn = await payloadContract.payload("dsadsa", "erer", "ewrwrw");
    // await payloadTxn.wait();

    // payloadCount = await payloadContract.getTotalPayloads();
    
    // From a random person 
    payloadTxn = await payloadContract.connect(randomPerson).payload("0xE3166AB0DBc258da2F99F589D4a8467A0fF08e5E", "uyuyu", "ytyty");
    await payloadTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(payloadContract.address);
    console.log("Contract balance:", hre.ethers.utils.formatEther(contractBalance));


    let allPayload = await payloadContract.getAllPayloads();
    console.log(allPayload);
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