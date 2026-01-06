import { NavLink } from "react-router-dom";
import { Button, Box } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { StyledAppBar, StyledToolbar, NavTitle } from "../styled/StyledComponents";

const Navigation = () => {
  return (
    <StyledAppBar position="sticky">
      <StyledToolbar>
        <NavTitle>JobFinder</NavTitle>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={NavLink}
            to="/"
            end
            sx={{
              color: 'white',
              position: 'relative',
              '&.active::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'white',
              },
            }}
          >
            New Jobs
          </Button>
          <Button
            component={NavLink}
            to="/applied"
            end
            sx={{
              color: 'white',
              position: 'relative',
              '&.active::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'white',
              },
            }}
          >
            Applied
          </Button>
          <Button
            component={NavLink}
            to="/settings"
            end
            sx={{
              color: 'white',
              minWidth: 'auto',
              padding: '6px 8px',
              position: 'relative',
              '&.active::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                backgroundColor: 'white',
              },
            }}
          >
            <SettingsIcon />
          </Button>
        </Box>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navigation;
