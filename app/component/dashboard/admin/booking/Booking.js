// Fetching data (backend communication)
// Managing UI state (React logic)
// Rendering responsive UI (mobile + desktop)
"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// 3-dot menu icon
import {
  ModernTableContainer,
  ModernTableHeaderCell,
  ModernTableBodyCell,
  StatusBadge,
  ActionButton,
  DatePill,
  SectionTitle,
  ResponsiveWrapper,
  MobileBookingCard,
  ModernPagination,
  MobileActionContainer,
} from "./bookingTableStyles";
import EditBookingModal from "./EditBookingModal";
import { toast } from "react-toastify";

const formatDate = (dateString) => {
  if (!dateString) return " ";

  const date = new Date(dateString);
  // Converts string → JavaScript Date object
  return date.toLocaleDateString("en-GB");
//   Formats date as:
// dd/mm/yyyy
// "en-GB" = British format
};

const getPaymentStatus = (paymentStatus) => {
  // Takes payment status value from DB
  return paymentStatus === "1" ? "Paid" : "Pending";
  // f paymentStatus === "1" → "Paid"
// Else → "Pending"/
};

const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return "Confirmed";

    case "inactive":
      return "Pending";
    case "cancelled":
      return "Cancelled";

    default:
      return status;
  }
};

const BookingTable = () => {
  const theme = useTheme();
  // Pulls Material UI theme
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // Checks if screen is medium or smaller
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEI] = useState(null);

  const [page, setPage] = useState(0);
  const [currentBooking, setCurrentBooking] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditBooking, setCurrentEditBooking] = useState(null);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [bookings, setBookings] = useState([]);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  // Static array for table column titles.
  const headers = [
    "SI",
    "Booking Code ",
    "Booking Date",
    "Customer",
    "Check IN/Out",
    "Total Rooms ",
    "Guests",
    "Payment",
    "Status",
    "Action",
  ];

  const paginatedBookings = bookings.slice(
    // .slice(start, end)
// slice() extracts a portion of the array.
    page * rowsPerPage,
    // This calculates where to start.
    page * rowsPerPage + rowsPerPage
    // This calculates where to stop.
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/admin/booking`);
        // Calls backend API.
        if (!response.ok) {
          throw new Error("failed to fetch bookingd");
        }

        const data = await response.json();
        // Parses response and stores data.
        // Stores bookings in state
        setBookings(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleChangePage = (event, newPage) => {
    // event → comes from the UI (like clicking next page button)
// newPage → the page number user wants to go to
    setPage(newPage);
    // This updates your React state page
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    // event.target.value
// Comes from a dropdown
// parseInt(..., 10)
// Converts string → number
    setPage(0);
    // This resets page to 0 (first page)
  };

  const handleMenuOpen = (event, booking) => {
    // event → click event (React synthetic event)
// booking → the specific booking row/item user clicked on
    setAnchorEI(event.currentTarget);
    // event.currentTarget → the DOM element user clicked on
//     to know:
// where to open
// which element to align with
//  Without this → menu floats randomly
    setCurrentBooking(booking);
    // Stores the clicked booking in state edit/delete 
  };

  const handleMobileMenuOpen = (event, booking) => {
    setMobileMenuAnchorEl(event.currentTarget);
    setCurrentBooking(booking);
  };

  const handleMenuClose = () => {
    // user clicks outsideuser selects menu item
// menu should disappear
    setAnchorEI(null);
    // Removes anchor → menu closes
    setMobileMenuAnchorEl(null);

    setCurrentBooking(null);
  };
//   User clicks menu icon on a booking
// onClick={(e) => handleMenuOpen(e, booking)}

// 👉 This does:

// stores clicked element → for menu position
// stores booking → for actions
// Step 2: Menu opens
// MUI uses anchorEl to position menu
// Menu becomes visible
// Step 3: User clicks "Edit" / "Delete"
// You use currentBooking
// currentBooking._id
// Step 4: Menu closes
// handleMenuClose()

// 👉 This resets everything
// booking = the row the user clicked
// This is your source of truth for editing
  const handleEditClick = (booking) => {
    setCurrentEditBooking(booking);
    // Stores selected booking in state
    setEditModalOpen(true);
  };

  const handleSaveBooking = async (updatedBooking) => {
    try {
      const response = await fetch(
        `/api/admin/booking/${updatedBooking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBooking),
          // Converts JS object → JSON string
        }
      );

      const data = await response.json();
      // Converts server response → JS object
      if (!response.ok) {
        toast.error("Failed to update booking");
      }

      if (data?.success) {
        toast.success(data?.message);
        // Shows success notification
      }

      setBookings(
        // Loop through all bookings:
        bookings.map((b) => (b._id === updatedBooking._id 
          // If same booking → replace it
          // Else keep original
          ? updatedBooking : b))
      );
    } catch (error) {
      console.log("error updating booking", err);
    }
  };

  if (loading) {
    return (
      <ResponsiveWrapper>
       <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  }}
>
          <CircularProgress />
        </Box>
      </ResponsiveWrapper>
    );
  }

  if (error) {
    return (
      <ResponsiveWrapper>
       <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "200px",
  }}
>
          <p>Error: {error}</p>
        </Box>
      </ResponsiveWrapper>
    );
  }

  if (isMobile) {
    return (
      <>
        <ResponsiveWrapper>
          {paginatedBookings.length > 0 ? (
            paginatedBookings.map((booking, index) => (
              <MobileBookingCard key={booking._id}>
                <div>
                  <span>Sl</span>
                  <span>{page * rowsPerPage + index + 1}</span>
                </div>
                <div>
                  <span>Booking Code</span>
                  <span>{booking.code}</span>
                </div>
                <div>
                  <span>Booking Date</span>
                  <span>{formatDate(booking.createdAt)}</span>
                </div>
                <div>
                  <span>Customer</span>
                  <span>{booking.name}</span>
                </div>
                <div>
                  <span>Check IN/Out</span>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <DatePill type="checkIn">
                      {formatDate(booking.check_in)}
                    </DatePill>
                    <DatePill type="checkOut">
                      {formatDate(booking.check_out)}
                    </DatePill>
                  </Box>
                </div>
                <div>
                  <span>Total Rooms</span>
                  <span>{booking.number_of_rooms}</span>
                </div>
                <div>
                  <span>Guests</span>
                  <span>{booking.person}</span>
                </div>
                <div>
                  <span>Payment</span>
                  <StatusBadge
                    status={getPaymentStatus(booking.payment_status)}
                  >
                    {getPaymentStatus(booking.payment_status)}
                  </StatusBadge>
                </div>
                <div>
                  <span>Status</span>
                  <StatusBadge status={booking.status}>
                    {getStatusBadge(booking.status)}
                  </StatusBadge>
                </div>
                <MobileActionContainer>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMobileMenuOpen(e, booking)}
                    sx={{ ml: "auto" }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                  <Menu
                    anchorEl={mobileMenuAnchorEl}
                    open={
                      Boolean(mobileMenuAnchorEl) &&
                      currentBooking?._id === booking._id
                    }
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleEditClick(booking);
                        handleMenuClose();
                      }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                  </Menu>
                </MobileActionContainer>
              </MobileBookingCard>
            ))
          ) : (
            <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px"
            }}
            >
              <p>No bookings found</p>
            </Box>
          )}

          <ModernPagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={bookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ResponsiveWrapper>

        <EditBookingModal
          booking={currentEditBooking}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveBooking}
        />
      </>
    );
  }

  return (
    <>
      <ResponsiveWrapper>
        <SectionTitle variant="h6">Booking List</SectionTitle>
        <ModernTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <ModernTableHeaderCell key={index}>
                    {header}
                  </ModernTableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking, index) => (
                  <TableRow key={booking._id} hover>
                    <ModernTableBodyCell>
                      {page * rowsPerPage + index + 1}
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>{booking.code}</ModernTableBodyCell>
                    <ModernTableBodyCell>
                      {formatDate(booking.createdAt)}
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>{booking.name}</ModernTableBodyCell>
                    <ModernTableBodyCell>
                    <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
                        <DatePill type="checkIn">
                          {formatDate(booking.check_in)}
                        </DatePill>
                        <DatePill type="checkOut">
                          {formatDate(booking.check_out)}
                        </DatePill>
                      </Box>
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>
                      {booking.number_of_rooms}
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>{booking.person}</ModernTableBodyCell>
                    <ModernTableBodyCell>
                      <StatusBadge
                        status={getPaymentStatus(booking.payment_status)}
                      >
                        {getPaymentStatus(booking.payment_status)}
                      </StatusBadge>
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>
                      <StatusBadge status={booking.status}>
                        {getStatusBadge(booking.status)}
                      </StatusBadge>
                    </ModernTableBodyCell>
                    <ModernTableBodyCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, booking)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={
                          Boolean(anchorEl) &&
                          currentBooking?._id === booking._id
                        }
                        onClose={handleMenuClose}
                      >
                        <MenuItem
                          onClick={() => {
                            handleEditClick(booking);
                            handleMenuClose();
                          }}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
                      </Menu>
                    </ModernTableBodyCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <ModernTableBodyCell colSpan={headers.length} align="center">
                    No bookings found
                  </ModernTableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ModernPagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={bookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </ModernTableContainer>
      </ResponsiveWrapper>


         <EditBookingModal
           booking={currentEditBooking}
          open={editModalOpen}
         onClose={() => setEditModalOpen(false)}
          onSave={handleSaveBooking}
         /> 
    </>
  );
};

export default BookingTable;

// Step 1: Component loads
// loading = true
// useEffect triggers API call
// Step 2: API returns bookings
// setBookings(data);

// Now UI has data

// Step 3: Pagination applied
// bookings.slice(...)

// 👉 Only part of data shown

// Step 4: UI renders
// If mobile → cards
// Else → table
// Step 5: User actions
// Change page

// → updates page → re-renders slice

// Open menu

// → sets currentBooking

// Edit

// → opens modal

// Save

// → API call → update state → UI updates