import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Avatar,
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Button,
} from "@mui/material";
import { Edit, Delete, Add, Preview } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
// Popup messages (success/error)
import {
  StyledPaper,
  StyledTableHeader,
  StyledHeaderCell,
  AnimatedTableRow,
  PositionChip,
  colors,
  textFieldStyles,
} from "./styles";

import AddManageRoomCategoriesModal from "./AddManageRoomCategoriesModal";
import EditManageRoomCategoriesModal from "./EditManageRoomCategoriesModal";
 import DeleteManageCategoriesModal from "./DeleteManageCategoriesModal";
export default function ManageRoomCategoriesTable() {
 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [roomtype, setRoomType] = useState([]);
  // Stores all room types from backend
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [roomMember, setroomMember] = useState(null);

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  // This is separate from roomtypeSo you are managing 2 collections
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // Detect mobile screen
  useEffect(() => {
    fetchroomtype();
    fetchRooms();
  }, []);

  const fetchroomtype = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/roomtype`);
      // API call
      const data = await response.json();
// convert json to javascript object
      setRoomType(data);
      // Save in state
    } catch (error) {
      toast.error("failed to fetch rom tpye");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/admin/room`);
      const data = await response.json();
      // convert json to javascript object
      setRooms(data);
      // Save in state
    } catch (error) {
      toast.error("Failed to  fetch rooms");
    }
  };

  const getRoomForRoomType = (roomtypeId) => {
    return rooms.find((room) => room.roomtype_id?._id === roomtypeId);
  };
  // room = each item in the rooms array
  // Compares:
// room’s category ID
// with the given roomtypeId

  // const handleAddSuccess = (newroomtype) => {
  //   setRoomType((prev) => [...prev, newroomtype]);
  //   setOpenAddModal(false);
  // };
  const handleAddSuccess = (data) => {
    setRoomType((prev) => [...prev, data.roomtype]);
//     ...prev = copy old data
// data.roomtype = new item from backend

// 👉 You are adding the new room type to existing list
    setOpenAddModal(false);
  };

  const handleEditClick = (rooms) => {
     const roomData = getRoomForRoomType(rooms._id);
    //  Find the room that belongs to this room type”
    setroomMember(roomData);
    // Saves the found room into state
    setOpenEditModal(true);
  };

  const handleEditSuccess = (updatedrooms) => {
    setRoomType((prev) =>
      // Updates state using previous value
      prev.map((emp) =>
        // Loop through every item in roomtype  
         (emp._id === updatedrooms._id ? updatedrooms : emp))
        //  If IDs match → replace with updated one
// If not → keep original
    );

    setOpenEditModal(false);
  };

  const handleDeleteClick = (roomtype) => {
    // Function triggered when user clicks Delete icon
  //  const roomData = getRoomForRoomType(rooms._id);
    setroomMember(roomtype);
    // Stores selected room data in state.
    setOpenDeleteModal(true);
  };

  const handleDeleteSuccess = () => {
    fetchroomtype();
    setOpenDeleteModal(false);
  };

 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // event → click event (you’re not using it)
  // newPage → page number user clicked
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    // event.target.valueComes as string, not number
    // 10 To avoid weird parsing bugs
    setPage(0);
    // Reset page   
  };

  return (
    <>
      <StyledPaper sx={{ width: "100%", p: isSmallScreen ? 1 : 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddModal(true)}
            sx={{
              backgroundColor: "#8A12FC",
              "&:hover": { backgroundColor: "#7a0eeb" },
            }}
            disabled={loading}
          >
            Add Room Category
          </Button>
        </Box>

         <TableContainer sx={{ maxHeight: "70vh", borderRadius: "12px" }}>
          <Table stickyHeader size={isSmallScreen ? "small" : "medium"}>
            <StyledTableHeader>
              <TableRow>
                {!isSmallScreen && <StyledHeaderCell>Image</StyledHeaderCell>}
                <StyledHeaderCell>Name</StyledHeaderCell>

                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </StyledTableHeader>
            <TableBody>
              {roomtype &&
                roomtype
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  // Pagination logicslice(start, end)
                  .map((rooms, index) => { 

                     const  room=getRoomForRoomType(rooms?._id)
                     return (

                    <AnimatedTableRow
                      key={rooms?._id || `rooms-${index}`}
                      hover
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {!isSmallScreen && (
                        <TableCell>
                          <Avatar
                            src={room?.image}
                            alt="room"
                            sx={{
                              width: 56,
                              height: 56,
                              border: "3px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: "700", color: "#2d3748" }}>
                        {/* {rooms?.name || "N/A"} */}
                        {room?.roomtype_id?.name || "N/A"}
                      </TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: isSmallScreen ? "4px" : "8px",
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditClick(rooms)}
                              sx={{ color: colors.edit }}
                              size={isSmallScreen ? "small" : "medium"}
                              disabled={loading}
                            >
                              <Edit
                                fontSize={isSmallScreen ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteClick(rooms)}
                              sx={{ color: colors.delete }}
                              size={isSmallScreen ? "small" : "medium"}
                              disabled={loading}
                            >
                              <Delete
                                fontSize={isSmallScreen ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </AnimatedTableRow>


                     )


                  })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={isSmallScreen ? [5, 10] : [5, 10, 25]}
          component="div"
          count={roomtype.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> 
      </StyledPaper>

      {/* Modals - Make sure they can handle the roomData prop */}
      <AddManageRoomCategoriesModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
        loading={loading}
        setLoading={setLoading}
      />

      <EditManageRoomCategoriesModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        member={roomMember}
        onSuccess={handleEditSuccess}
        loading={loading}
        setLoading={setLoading}
  fetchRooms={fetchRooms}
      />

      <DeleteManageCategoriesModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        member={roomMember}
        // Passing selected room data.
        onSuccess={handleDeleteSuccess}
        loading={loading}
        setLoading={setLoading}
      /> 
    </>
  );
};
