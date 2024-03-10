import React, { useEffect, useState } from "react";
import DI from "../../utility/DI";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { toTitleCase } from "../../utility/tools";
const Friends = (props) => {
  const {
    di: { POST, GET, success, error, urls },
  } = props;
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchLoading, setSearchloading] = useState(false);
  const [list, setList] = useState([]);
  const [friends, setFriends] = useState([]);

  const fetchUsers = () => {
    setSearchloading(true);
    POST(urls.get.users, {
      search: searchInput,
    }).then((res) => {
      if (res?.success) {
        setList(res.data);
      } else {
        // error(res?.message ?? "error");
      }
      setSearchloading(false);
    });
  };

  const addFriend = (id) => {
    setLoading(true);
    GET(urls.get.add_friend, {
      friend_id: id,
    }).then((res) => {
      if (res?.success) {
        success(res?.message ?? "success");
        fetchFriends();
      } else {
        error(res?.message ?? "error");
      }
      setLoading(false);
    });
  };

  const removeFriend = (id) => {
    setLoading(true);
    GET(urls.get.remove_friend, {
      friend_id: id,
    }).then((res) => {
      if (res?.success) {
        success(res?.message ?? "success");
        fetchFriends();
      } else {
        error(res?.message ?? "error");
      }
    });
  };
  const fetchFriends = () => {
    POST(urls.get.get_friends).then((res) => {
      if (res?.success) {
        setFriends(res.data);
      } else {
        error(res?.message ?? "error");
      }
    });
  };

  useEffect(() => {
    fetchFriends();
  }, []);
  React.useEffect(() => {
    setTimeout(fetchUsers, 400);
  }, [searchInput]);
  return (
    <>
      <Autocomplete
        key={"autocomplete"}
        freeSolo
        id="free-solo-2-demo"
        loading={searchLoading}
        loadingText="Searching..."
        disableClearable
        sx={{
          margin: "10px",
          marginBottom: "0px",
        }}
        options={list.map((option) => option.id + "#  " + option.firstname)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search new friend by id or name..."
            onChange={(el) => setSearchInput(el.target.value)}
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
        renderOption={(props, option, state, ownerState) => {
          return (
            <Box
              {...props}
              sx={{
                borderRadius: "8px",
                margin: "5px",
              }}
              component="li"
              onClick={() => {
                addFriend(option.split("#")[0]);
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div> {ownerState.getOptionLabel(option)}</div>
                {!friends.find((el) => el.id == option.split("#")[0]) && (
                  <Button>
                    <PersonAddIcon />
                  </Button>
                )}
              </div>
            </Box>
          );
        }}
      />
      {list.length == 0 && searchInput !== "" && !searchLoading && (
        <small style={{ margin: "2px 12px", color: "grey" }}>
          No Search found!
        </small>
      )}
      <br />
      <br />
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        subheader={
          <ListSubheader>
            <p style={{ margin: "0px", fontSize: "20px", fontWeight: 600 }}>
              Friends ({friends.length})
            </p>
          </ListSubheader>
        }
      >
        {friends.length == 0 && (
          <ListItem alignItems="flex-start">
            <ListItemText primary={"No Friends Exist"} />
          </ListItem>
        )}
        {friends.map((fr) => (
          <>
            <ListItem
              key={fr.id + "friends"}
              alignItems="flex-start"
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => removeFriend(fr.id)}
                >
                  <PersonRemoveIcon color="error" />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar
                  style={{ background: "orange" }}
                  alt={toTitleCase(fr.firstname)}
                  src="/static/images/avatar/1.jpg"
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  toTitleCase(fr.firstname) + " " + toTitleCase(fr.lastname)
                }
                secondary={
                  <>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {"#" + fr.id + " "} {fr.email}
                    </Typography>
                  </>
                }
              />
            </ListItem>

            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </>
  );
};

export default DI(Friends);
