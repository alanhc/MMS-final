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
    const [imgData, setImgData] = useState({});
    // const [buttonType, setButtonType] = useState("Activate Ticket");

    
    const onClickActivate = async () => {
        console.log("Fetching image");
        const res = await activateTicket(ticket.contract, ticket.tokenId);

        // setImgData(res);

        console.log(res);
        console.log(typeof(res));

        var enc = new TextEncoder();
        console.log(enc.encode(res));

        // console.log(typeof(tmp));
        // console.log(res[0].arrayBuffer());

        // setImgData(res[0]);
        // var arrayBuffer;
        // var fileReader = new FileReader();
        // fileReader.onload = await function(event) {
        //     arrayBuffer = event.target.result;
        // };
        // fileReader.readAsArrayBuffer(res[0]);

        // const arrayBuffer = await new Response(res[0]).arrayBuffer(); 

        // console.log("arraybuffer: ", arrayBuffer);

        // localStorage.setItem("imgData", arrayBuffer);
        localStorage.setItem("imgData", enc.encode(res));

        // var dataImage = localStorage.getItem("imgData");
        let resImg = document.getElementById("test");
        resImg.src = res;    

        let activateBtn = document.getElementById("activateBtn");
        let useBtn = document.getElementById("useBtn");

        activateBtn.style.display = "none";
        useBtn.style.display = "block";
    }    

    const onClickUse = async () => {
        const imgData = localStorage.getItem("imgData");
        console.log(imgData)

        console.log("Fetching QR");
        console.log(imgData);
        const res = await getQRcode(ticket.contract, ticket.tokenId, imgData);
        console.log("Got QR");

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

            // console.log(ticket);
            // console.log(storage.authToken);
            

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
                        <img id="test" style={{ display: "block", marginLeft: "auto", marginRight: "auto" }} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Ticket;