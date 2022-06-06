import { Box, Button, Paper, Grid } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../utils/context';
import { verifyQRcode, getCollectionByAddress } from "../utils/axios"
import HeaderBar from "../components/HeaderBar";
import storage from "../utils/storage";
import { QrReader } from 'react-qr-reader';


const Scan = () => {
    const { id } = useParams();
    const [data, setData] = useState('No result');
    const [collections, setCollections] = useState({});
    const [ticket, setTicket] = useState({});
    const [result, setResult] = useState("");

    const onClickUse = async () => {
        console.log("verifying")
        const res = await verifyQRcode(ticket.contract, ticket.tokenId, data);

        setResult(res.data.status);
    }

    useEffect(() => {
        const fetchCollections = async () => {
            if (storage.walletAddress) {
                const collectionList = await getCollectionByAddress(storage.walletAddress)
                setCollections(collectionList);

                for (let key in collections) {
                    if (collections[key].tokenId == id) {
                        setTicket(collections[key]);
                    }
                }
            }
        }

        fetchCollections();
    })

    return (
        <Box>
            <HeaderBar />
            <QrReader
            onResult={(result, error) => {
                if (!!result) {
                    setData(result?.text);
                    setResult("Scanned.")
                }
    
                if (!!error) {
                    // console.info(error);
                }
            }}
            style={{ height:'10px' }}
            />
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={8} justifyContent="center">
                    <p align="center"> {result} </p>
                </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={8} justifyContent="center">
                    <Button id="activateBtn" variant="outlined" color="inherit" onClick={ onClickUse }
                        style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                            Verify
                    </Button>
                </Grid>
            </Grid>
            
      </Box>
    );
}

export default Scan;