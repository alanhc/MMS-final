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

    const onClickUse = async () => {
        console.log("VERIFY");
        console.log(typeof data);

        const toBytes = (string) => {
            const buffer = Buffer.from(string, 'utf8');
            const result = Array(buffer.length);
            for (var i = 0; i < buffer.length; i++) {
                result[i] = buffer[i];
            }
            return result;
        };

        const bytes = toBytes(data);
        console.log(typeof bytes);
        console.log(bytes);


        console.log("verifying")
        const res = await verifyQRcode(ticket.contract, ticket.tokenId, data);
        console.log(res);
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
                    // verifyData();
                }
    
                if (!!error) {
                    // console.info(error);
                }
            }}
            style={{ height:'10px' }}
            />
            <p>{data}</p>
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={8} justifyContent="center">
                    <Button id="activateBtn" variant="outlined" color="inherit" onClick={ onClickUse }
                        style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                            Verify
                    </Button>
                </Grid>
            </Grid>
            
        {/* <QRScan></QRScan> */}
      </Box>
    );
}

export default Scan;