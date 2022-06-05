import {
  AppBar, Box, Toolbar, Typography, Button, IconButton
} from '@mui/material'
import useWallet from '../hooks/useWallet'

const HeaderBar = () => {
  const { connectWallet } = useWallet();
  const onClickConnect = () => {
    connectWallet();
  }

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
          <Button color="inherit" onClick={ onClickConnect }>Connect</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
};

export default HeaderBar;