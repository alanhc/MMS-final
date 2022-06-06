import { Box, Paper, Grid } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from '../utils/context';
import { getCollectionByAddress } from "../utils/axios"
import storage from "../utils/storage";

const Collection = () => {
    const { authState, authDispatcher } = useContext(AuthContext);
    const [collections, setCollections] = useState({});

    useEffect(() => {
        const fetchCollections = async () => {
            let contentList = [];

            if (storage.walletAddress) {
                const collectionList = await getCollectionByAddress(storage.walletAddress)
                setCollections(collectionList);
            }
        }

        fetchCollections();
    })

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      }));

    return(
        <Box sx={{ flexGrow: 1 }} mt={5}>
            { authState?.isLoggedIn ? (
            <Grid container spacing={2} justifyContent="center">
                { Object.keys(collections).map(key => (
                    <Item key={key}><Link to={`/ticket/${collections[key].tokenId}`}>NFT TICKET #{collections[key].tokenId}</Link></Item>
                ))}
            </Grid>
            ) : (
                <>
                </>
            )}
        </Box>
    )
}

export default Collection;