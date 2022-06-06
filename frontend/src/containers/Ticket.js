import { Box, Paper, Grid } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../utils/context';
import { getCollectionByAddress } from "../utils/axios"
import storage from "../utils/storage";

const Ticket = () => {
    const { id } = useParams();
    const { authState, authDispatcher } = useContext(AuthContext);
    const [collections, setCollections] = useState({});
    const [ticket, setTicket] = useState({});

    useEffect(() => {
        const fetchCollections = async () => {
            let contentList = [];
            // console.log(storage.walletAddress)

            if (storage.walletAddress) {
                console.log(storage.walletAddress, id)

                const collectionList = await getCollectionByAddress(storage.walletAddress)
                // console.log(collectionList[0].tokenId);
                setCollections(collectionList);
                // console.log(collectionList[0]);

                for (let key in collections) {
                    console.log(collections[key].tokenId, id);

                    if (collections[key].tokenId == id) {
                        setTicket(collections[key]);
                        console.log(collections[key]);
                    }
                }
            }
        }

        fetchCollections();
    })
    
    return (
        <Box sx={{ flexGrow: 1 }} mt={5}>
            { authState?.isLoggedIn ? (
            <Grid container spacing={2} justifyContent="center">
                <img src={ticket.thumbnailUri}></img>
            </Grid>
            ) : (
                <>
                </>
            )}
        </Box>
    )
}

export default Ticket;