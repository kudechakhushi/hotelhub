"use client";
// Display booking info
// Let user edit fields
// Recalculate totals dynamically
import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    MenuItem,
    Button,
    Divider,
    Chip,
    Stack,
    Modal,
    IconButton,
    Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
  import RoomAssignment from "./RoomAssignment"

// Styled Components
// colored left border
// hover effect
const SummaryCard = styled(Card)(({ theme, color }) => ({
    borderLeft: `4px solid ${theme.palette[color].main}`,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "transform 0.2s",
    "&:hover": {
        transform: "translateY(-2px)",
    },
}));
// left blue bar
// bold text
const SectionHeader = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    color: theme.palette.text.primary,
    display: "flex",
    alignItems: "center",
    "&:before": {
        content: '""',
        display: "block",
        width: "4px",
        height: "20px",
        backgroundColor: theme.palette.primary.main,
        marginRight: theme.spacing(1),
        borderRadius: "2px",
    },
}));

const BookingDetails = ({ booking, onFieldChange, onSave, onCancel }) => {
    // Format date for date input fields (YYYY-MM-DD) for checkin and checkout
    const formatDateForInput = (dateString) => {
        // A function that takes a date
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            // Convert input into a JavaScript Date object
            if (isNaN(date.getTime())) return "";
            // date.getTime() → returns timestamp
            // If invalid → returns NaN
            return date.toISOString().split("T")[0];
            // return date in YYYY-MM-DD format
        } catch (e) {
            console.error("Date formatting error:", e);
            // If error, return empty string
        }
    };

    // Format date for display for booking date
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "Not set";
        const date = new Date(dateString);
        // Convert to Date object
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        // like "July 20, 2026"
    };

    const calculateTotalNights = () => {
        if (!booking.check_in || !booking.check_out) return 0;
        const diffTime = new Date(booking.check_out) - new Date(booking.check_in);
        // Convert both dates to timestamps and subtract
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Calculate number of nights between check-in and check-out
    };

    const handleDateChange = (field, value) => {
        const newBooking = { ...booking, [field]: value };
        // Clone booking and update ONE field
        // Recalculate if both dates exist
        if (newBooking.check_in && newBooking.check_out) {
            // Only calculate if BOTH dates exist
            const checkIn = new Date(newBooking.check_in);
            const checkOut = new Date(newBooking.check_out);

            if (checkOut > checkIn) {
                const diffTime = checkOut - checkIn;
                const totalNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                // Calculate nights
                newBooking.total_night = totalNights;
                // Save nights into booking
                newBooking.subtotal =
                    totalNights * newBooking.actual_price * newBooking.number_of_rooms;
                newBooking.total_price =
                    newBooking.subtotal - (newBooking.discount || 0);
            }
        }

        onFieldChange(newBooking);
        // Update booking with new values
    };

    const getStatusChip = (status) => {
        const statusMap = {
            active: { label: "Confirmed", color: "success" },
            inactive: { label: "Pending", color: "warning" },
            cancelled: { label: "Cancelled", color: "error" },
        };
        const currentStatus = statusMap[status] || {
            label: status,
            color: "default",
            // Unknown status → default color
        };
        // Return a chip with the status label and color
        return (
            <Chip
                label={currentStatus.label}
                color={currentStatus.color}
                size="small"
                variant="outlined"
            />
        );
    };

    const getPaymentChip = (paymentStatus) => {
        return paymentStatus === "1" ? (
            // "1" → Paid
            <Chip label="Paid" color="success" size="small" variant="outlined" />
        ) : (
            <Chip label="Pending" color="warning" size="small" variant="outlined" />
        );
    };

    if (!booking) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={400} />
            </Box>
        );
    }

    return (


        <>
            <Box sx={{ p: 3 }}>
                {/* Summary Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <SummaryCard color="primary">
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Booking Reference
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {booking.code || "N/A"}
                                </Typography>
                            </CardContent>
                        </SummaryCard>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <SummaryCard color="secondary">
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Booking Date
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                    {formatDateForDisplay(booking.createdAt)}
                                </Typography>
                            </CardContent>
                        </SummaryCard>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <SummaryCard color="info">
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Payment Method
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    {booking.payment_method}
                                </Typography>
                            </CardContent>
                        </SummaryCard>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <SummaryCard
                            color={booking.payment_status === "1" ? "success" : "warning"}
                        >
                            <CardContent>
                                <Stack
                                    direction="row"
                                    sx={{ justifyContent: "space-between", alignItems: "center" }}
                                >
                                    <div>
                                        <Typography variant="caption" color="text.secondary">
                                            Payment Status
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            {getPaymentChip(booking.payment_status)}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="caption" color="text.secondary">
                                            Booking Status
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                            {getStatusChip(booking.status)}
                                        </Typography>
                                    </div>
                                </Stack>
                            </CardContent>
                        </SummaryCard>
                    </Grid>
                </Grid>

                {/* Booking Details Section */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <SectionHeader variant="h6">Booking Details</SectionHeader>

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box
                                    sx={{ p: 2, backgroundColor: "action.hover", borderRadius: 1 }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                                                Room Information
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Room Type
                                            </Typography>
                                            <Typography>
                                                {booking.rooms_id?.roomtype_id?.name || "Not specified"}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Rooms
                                            </Typography>
                                            <Typography>{booking.number_of_rooms}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Price/Night
                                            </Typography>
                                            <Typography>${booking.actual_price}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Total Nights
                                            </Typography>
                                            <Typography>{calculateTotalNights()}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 6, sm: 4 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Guests
                                            </Typography>
                                            <Typography>{booking.person}</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box
                                    sx={{ p: 2, backgroundColor: "action.hover", borderRadius: 1 }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                                                Stay Duration
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="Check-In"
                                                type="date"
                                                value={formatDateForInput(booking.check_in)}
                                                onChange={(e) =>
                                                    handleDateChange("check_in", e.target.value)
                                                }
                                                fullWidth
                                                slotProps={{
                                                    inputLabel: { shrink: true },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="Check-Out"
                                                type="date"
                                                value={formatDateForInput(booking.check_out)}
                                                onChange={(e) =>
                                                    handleDateChange("check_out", e.target.value)
                                                }
                                                fullWidth
                                                slotProps={{
                                                    inputLabel: { shrink: true },
                                                }}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                label="Number of Rooms"
                                                type="number"
                                                value={booking.number_of_rooms}
                                                onChange={(e) => {
                                                    const inputValue = parseInt(e.target.value) || 1;

                                                    // ✅ Clamp to availableRooms
                                                    const newRooms =
                                                        inputValue > booking.availableRooms
                                                            ? booking.availableRooms
                                                            : inputValue;

                                                    const newSubtotal =
                                                        calculateTotalNights() *
                                                        booking.actual_price *
                                                        newRooms;

                                                    onFieldChange({
                                                        ...booking,
                                                        number_of_rooms: newRooms,
                                                        subtotal: newSubtotal,
                                                        total_price: newSubtotal - (booking.discount || 0),
                                                    });
                                                }}
                                                fullWidth
                                                slotProps={{
                                                    input: { min: 1, max: booking.availableRooms },
                                                }}
                                            />

                                            <Typography>
                                                Available Rooms: {booking?.availableRooms}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid size={{ xs: 12, md: 8 }}></Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        backgroundColor: "background.paper",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Stack spacing={1}>
                                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                            <Typography>Subtotal:</Typography>
                                            <Typography sx={{ fontWeight: "medium" }}>
                                                ${booking.subtotal}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                            <Typography>Discount:</Typography>
                                            <Typography sx={{ fontWeight: "medium" }} color="error.main">
                                                -${booking.discount || 0}
                                            </Typography>
                                        </Stack>
                                        <Divider />
                                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                            <Typography variant="subtitle1">Total:</Typography>
                                            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                                                ${Number(booking.total_price).toFixed(2)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Status Management Section */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <SectionHeader variant="h6">Status Management</SectionHeader>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    label="Payment Status"
                                    value={booking.payment_status}
                                    onChange={(e) =>
                                        onFieldChange({ ...booking, payment_status: e.target.value })
                                    }
                                    fullWidth
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                >
                                    <MenuItem value="0">Pending</MenuItem>
                                    <MenuItem value="1">Paid</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    label="Booking Status"
                                    value={booking.status}
                                    onChange={(e) =>
                                        onFieldChange({ ...booking, status: e.target.value })
                                    }
                                    fullWidth
                                    slotProps={{
                                        inputLabel: { shrink: true },
                                    }}
                                >
                                    <MenuItem value="inactive">Pending</MenuItem>
                                    <MenuItem value="active">Confirmed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Customer Information Section */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <SectionHeader variant="h6">Customer Information</SectionHeader>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Full Name"
                                    value={booking.name}
                                    //  onChange={(e) => onFieldChange({ ...booking, name: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={booking.email}
                                    //onChange={(e) => onFieldChange({ ...booking, email: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                <TextField
                                    label="Phone"
                                    value={booking.phone}
                                    //  onChange={(e) => onFieldChange({ ...booking, phone: e.target.value })}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button variant="outlined" onClick={onCancel} sx={{ minWidth: 120 }}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={onSave} sx={{ minWidth: 120 }}>
                        Save Changes
                    </Button>
                </Box>
            </Box>

            <RoomAssignment booking={booking} /> 
        </>

    );
};

export default BookingDetails;

// Component receives booking
//  Displays all data

// 2. User edits something
// date change → recalculates price
// rooms change → recalculates price
// status change → updates state
// 3. Every change calls:
// onFieldChange(updatedBooking)

// 👉 Parent updates state

// 4. User clicks SAVE
// onSave()

// 👉 Parent handles API call