import { Box, Button, Paper, Grid } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../utils/context';
import { getCollectionByAddress } from "../utils/axios"
import HeaderBar from "../components/HeaderBar";
import storage from "../utils/storage";
import { activateTicket, getQRcode } from "../utils/axios";

const Ticket = () => {
    const { id } = useParams();
    const { authState, authDispatcher } = useContext(AuthContext);
    const [collections, setCollections] = useState({});
    const [ticket, setTicket] = useState({});
    const [blob, setBlob] = useState({});

    
    const onClickActivate = async () => {
        console.log("Fetching image");
        const res = await activateTicket(ticket.contract, ticket.tokenId);

        localStorage.setItem("imgData", URL.createObjectURL(res));
        console.log(localStorage.getItem("imgData"))
        await setBlob(res);

        let resImg = document.getElementById("img");
        resImg.src = URL.createObjectURL(res);    

        let activateBtn = document.getElementById("activateBtn");
        let useBtn = document.getElementById("useBtn");

        activateBtn.style.display = "none";
        useBtn.style.display = "block";
    }    

    const onClickUse = async () => {
        console.log("Fetching QR");
        const res = await getQRcode(ticket.contract, ticket.tokenId, blob);
        console.log("Got QR");

        let resImg = document.getElementById("qrcode");
        resImg.src = URL.createObjectURL(res);    
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
            <Box sx={{ width: "100%" }} mt={5} display="flex" align_items="center" justify="center">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={8}>
                        <img id="img" src={ticket.thumbnailUri} style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} />
                    </Grid>
                    <Grid item xs={8} justifyContent="center">
                        <Button id="activateBtn" variant="outlined" color="inherit" onClick={ onClickActivate }
                            style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}>
                                Activate Ticket
                        </Button>
                        <Button id="useBtn" variant="outlined" color="inherit" onClick={ onClickUse }
                            style={{ display: "none", marginLeft: "auto", marginRight: "auto" }}>
                                Use Ticket
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <img id="qrcode" style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Ticket;