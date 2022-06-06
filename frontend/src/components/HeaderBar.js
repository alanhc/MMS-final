import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import { useContext } from 'react';
import useWallet from '../hooks/useWallet'
import { AuthContext } from '../utils/context';

const HeaderBar = () => {
  const { connectWallet } = useWallet();
  const onClickConnect = () => {
    connectWallet();
  }
  const { authState, authDispatcher } = useContext(AuthContext);

	return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" enableColorOnDark>
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            *
          </Typography>
          { authState?.isLoggedIn ? (
            <>
              <Button variant="outlined" color="inherit">Synced</Button>
            </>
    
          ) : (
            <Button variant="outlined" color="inherit" onClick={ onClickConnect }>Sync</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  )
};

export default HeaderBar;