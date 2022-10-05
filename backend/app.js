//.env
require('dotenv').config()

// Express imports
const express = require("express");
const app = express();
app.use(express.json());

// CORS Policy
const cors = require("cors");
app.use(cors());

// JWT Config
const jwt = require("jsonwebtoken");
const EXPIRES_TIME = "8766h"

// ==== Ethers config ====

const ethers = require("ethers");

const getContractInfo = () => {
    const fs = require('fs')
    let contract_address = '';
    let abi = '';

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
        abi = JSON.parse(contractABIData).abi
    }
    catch(e){
        console.error(e)
        return false
    }

    return [contract_address, abi]
}

const contractAddress = getContractInfo()[0];
const ABI = getContractInfo()[1];
let connection;
let contractArtifact;
let signer;

try{
    connection = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URL);
    contractArtifact = new ethers.Contract(contractAddress, ABI, connection);
    signer = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, connection);
}
catch(e){
    console.error(e);
}
    
// ==== ====

const recoverSign = (r,s,v) => {
    const concat = r + s.slice(2) + v.toString(16);
    return concat
};

const verifyToken = async (req, res) => {
    let authHeader = req.headers['authorization'];
    if(authHeader == null) return res.status(401).send("Token required") && false
    token = authHeader || authHeader.split(' ')[1];
    
    try{
        const sec_sliced = await contractArtifact.getToStoken(req.body.address);
        const sec = recoverSign(sec_sliced[0], sec_sliced[1], sec_sliced[2])
        
        const x = jwt.verify(token, sec, (err, user) => {
            if(err) {
                req.jwt = false;
                console.error(err)
                if(err.name == "TokenExpiredError"){
                    return res.status(401).send("Expired token")
                }
                return res.status(401).send("Invalid token")
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

//TODO not necessary?
// app.post("/renewUser", async (req, res) => {
//     try{
//         const address = req.body.address
//         const TOKEN_KEY = req.body.signToken
//         await prisma.user.update({
//             where : {
//                 address
//             },
//             data : {
//                 secure : TOKEN_KEY
//             }
//         })

//         const token = jwt.sign(
//             { address : req.body.address }, TOKEN_KEY, { expiresIn : EXPIRES_TIME }
//         );

//         res.json({"token" : token})
//     }
//     catch(e){
//         console.error(e)
//         res.status(500).send("" + e)
//     }
// });

app.post("/saveToS", async(req, res) => {
    const address = req.body.address;
    const r = req.body.r;
    const s = req.body.s;
    const v = req.body.v;

    const TOKEN_KEY = recoverSign(r,s,v)

    try{
        const txSigner= contractArtifact.connect(signer);
        
        const tx = await txSigner.ToSign(address, r, s, v);
        const response = await tx.wait()
        
        if(response.status){
            const token = jwt.sign(
                { address : address }, TOKEN_KEY, { expiresIn : EXPIRES_TIME }
            );
            res.status(200).json({"token" : token});
        }
    }
    catch(e){
        console.error(e)
    }

});

app.post("/incrementPoints", async (req, res) => {
    if(await verifyToken(req, res, req.body.address)){
        if(req.jwt)
            if(req.body.address.toLowerCase() === req.jwt.toLowerCase()){
                const txSigner= contractArtifact.connect(signer);

                const tx = await txSigner.incrementPoints(req.jwt)
                const r = await tx.wait()
                
                if(r.status){
                    res.status(200).send("Points incremented sucessfully")
                }
                
            }
            else{
                res.status(401).send("Error validating user")
                console.error("Error validating user")
            }
        }
})

//@sec_problem
// app.post("/getToS", async (req, res) => {
//     if(req.body.address !== null){
//         try{
//             let ToS = await contractArtifact.getToStoken(req.body.address);
//             res.status(200).json({
//                 address : req.body.address,
//                 ToS : recoverSign(ToS[0], ToS[1], ToS[2])
//             })
//         }
//         catch(e){
//             console.error(e)
//             res.status(501).send("Cannot retrieve user's points")
//         }
//     }
//     else{
//         res.status(401).send("Incorrect parameters")
//     }
// })

app.post("/getPoints", async (req, res) => {
    if(req.body.address !== null){
        if(await verifyToken(req, res, req.body.address))
            if(req.jwt)
                try{
                    let points = await contractArtifact.getPointsByUser(req.body.address);
                    res.status(200).json({
                        address : req.body.address,
                        points : JSON.parse(points)
                    })
                }
                catch(e){
                    console.error(e)
                    res.status(501).send("Cannot retrieve user's points")
                }
    }
    else{
        res.status(401).send("Incorrect parameters")
    }
})

//@deprecated
// app.post("/addUser", async (req, res) => {
//     try{
//         const TOKEN_KEY = req.body.signToken
//         await prisma.user.create({
//             data : {
//                 address : req.body.address,
//                 secure  : TOKEN_KEY
//             }
//         })

//         const token = jwt.sign(
//             { address : req.body.address }, TOKEN_KEY, { expiresIn : EXPIRES_TIME }
//         );

//         res.json({"token" : token})
//     }
//     catch(e){
//         console.error(e)
//         res.status(500).send("" + e)
//     }
// })

app.listen(3001, () => {
    console.log("Server listening in p:3001");
})