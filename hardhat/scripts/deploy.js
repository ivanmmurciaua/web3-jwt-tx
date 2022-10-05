const hre = require("hardhat");

async function main() {
  const PointsCounter = await hre.ethers.getContractFactory("PointsCounter");
  const pointsCounter = await PointsCounter.deploy();

  await pointsCounter.deployed();

  console.log("Points counter contract deployed to ", pointsCounter.address)

  saveFrontendFiles(pointsCounter)
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../../contracts/";
  const contractsDirFE = __dirname + "/../../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  if (!fs.existsSync(contractsDirFE)) {
    fs.mkdirSync(contractsDirFE);
  }

  fs.writeFileSync(
    `${contractsDir}/contract-address.json`,
    JSON.stringify({ contract : contract.address }, undefined, 2)
  );

  fs.writeFileSync(
    `${contractsDirFE}/contract-address.json`,
    JSON.stringify({ contract : contract.address }, undefined, 2)
  );
  
  const contractArtifact = artifacts.readArtifactSync("PointsCounter");

  fs.writeFileSync(
    contractsDir + "/contract.json",
    JSON.stringify(contractArtifact, null, 2)
  );

  fs.writeFileSync(
    contractsDirFE + "/contract.json",
    JSON.stringify(contractArtifact, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});