//.env
require('dotenv').config()

// Express imports
const express = require("express");
const app = express();
app.use(express.json());

// CORS Policy
const cors = require("cors");
app.use(cors());

// Prisma ORM Client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// JWT Config
const jwt = require("jsonwebtoken");
const EXPIRES_TIME = "8766h"

// Ethers import
const ethers = require("ethers");

const admin = () => {
    return 
}

const getContractInfo = () => {
    const fs = require('fs')
    let contract_address = '';
    let ABI = '';

    try{
        const contractAddressData = fs.readFileSync('./contracts/contract-address.json', 'utf8')
        contract_address = JSON.parse(contractAddressData).contract
    }
    catch(e){
        console.error(e)
        return false
    }

    try{
        const contractABIData = fs.readFileSync('./contracts/contract.json', 'utf8')
        ABI = JSON.parse(contractABIData).abi
    }
    catch(e){
        console.error(e)
        return false
    }

    return {
        "contract_address" : contract_address,
        "ABI" : ABI
    }
}

const verifyToken = async (req, res) => {
    let authHeader = req.headers['authorization'];
    if(authHeader == null) return res.status(401).send("Token required") && false
    token = authHeader || authHeader.split(' ')[1];
    try{
        const address = req.body.address
        const query = await prisma.user.findUnique({
            where : { address }
        })
        const sec = query.secure
        const x = jwt.verify(token, sec, (err, user) => {
            if(err) {
                req.jwt = false;
                console.error(err)
                if(err.name == "TokenExpiredError"){
                    return res.status(401).send("Token expirado")
                }
                return res.status(401).send("Token invalido")
            };
            req.jwt = user.address;
        })
        return true
    }
    catch(e){
        console.error(e)
        return res.status(501).send("" + e) && false
    }
    
}

app.get("/health", (req, res) => {
    res.status(200).send("Breathing...");
});

//TODO: Control response
app.post("/renewUser", async (req, res) => {
    try{
        const address = req.body.address
        const TOKEN_KEY = req.body.signToken
        await prisma.user.update({
            where : {
                address
            },
            data : {
                secure : TOKEN_KEY
            }
        })

        const token = jwt.sign(
            { address : req.body.address }, TOKEN_KEY, { expiresIn : EXPIRES_TIME }
        );

        res.json({"token" : token})
    }
    catch(e){
        console.error(e)
        res.status(500).send("" + e)
    }
});

app.post("/addUser", async (req, res) => {
    try{
        const TOKEN_KEY = req.body.signToken
        await prisma.user.create({
            data : {
                address : req.body.address,
                secure  : TOKEN_KEY
            }
        })

        const token = jwt.sign(
            { address : req.body.address }, TOKEN_KEY, { expiresIn : EXPIRES_TIME }
        );

        res.json({"token" : token})
    }
    catch(e){
        console.error(e)
        res.status(500).send("" + e)
    }
})

app.post("/incrementPoints", async (req, res) => {
    if(await verifyToken(req, res, req.body.address)){
        if(req.jwt)
            if(req.body.address === req.jwt){
                // Get contract info
                const contractInfo = getContractInfo()

                if(contractInfo){
                    const contract_address = contractInfo.contract_address;
                    const ABI = contractInfo.ABI;

                    //TODO Error control
                    const connection = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL)
                    const contractArtifact = new ethers.Contract(contract_address, ABI, connection);
                    
                    var signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, connection);
                    const txSigner= contractArtifact.connect(signer);

                    const tx = await txSigner.incrementPoints(req.jwt)
                    const r = await tx.wait()
                    
                    if(r.status){
                        res.status(200).send("Puntos incrementados correctamente")
                    }
                }
            }
            else{
                res.status(401).send("Error validating user")
                console.error("Error validating user")
            }
        }
})

app.listen(3001, () => {
    console.log("Server listening in p:3001");
})