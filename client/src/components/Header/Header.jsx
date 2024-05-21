import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../util/AuthContext";

const useStyles = {
  appBar: {
    backgroundColor: "#4F6F52",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    color: "#F5EFE6",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#E8DFCA",
    color: "#1A4D2E",
    "&:hover": {
      backgroundColor: "#4F6F52",
      color: "#F5EFE6",
    },
  },
  greeting: {
    padding: "10px 20px",
    fontWeight: "bold",
  },
};

export default function Header() {
  const { isLoggedIn, userData, setLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleClose();
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setLoggedIn(false);
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout", error);
    } finally {
      handleClose();
    }
  };

  return (
    <AppBar position="static" style={useStyles.appBar}>
      <Toolbar style={useStyles.toolbar}>
        <Typography
          variant="h6"
          style={useStyles.title}
          onClick={() => {
            navigate("/");
          }}
        >
          PathPal
        </Typography>
        {isLoggedIn ? (
          <div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Typography variant="body1" style={useStyles.greeting}>
                Hi {userData.firstName}
              </Typography>
              <MenuItem onClick={handleProfile}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <Button
            variant="contained"
            style={useStyles.button}
            onClick={handleLoginClick}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
