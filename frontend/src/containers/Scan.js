import { Box, Button, Paper, Grid } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from '../utils/context';
import { getCollectionByAddress } from "../utils/axios"
import HeaderBar from "../components/HeaderBar";
import storage from "../utils/storage";

const Scan = () => {
    const [data, setData] = useState('No result');

    
}

export default Scan;