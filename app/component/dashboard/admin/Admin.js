
import * as React from "react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

import Hotel from "@/app/component/dashboard/admin/hotel/Hotel";
import DashBoard from "@/app/component/dashboard/admin/dashboard/Dashboard";
import HotelHubLogo from "@/app/component/nav/HotelHubLogo";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import Sale from "@/app/component/dashboard/admin/sale/Sale";
import { signOut } from "next-auth/react";
import Profile from "@/app/component/dashboard/admin/profile/Profile";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Toolbar,
  AppBar,
  IconButton,
  Grid,
  Collapse,
  alpha,
} from "@mui/material";

import Team from "@/app/component/dashboard/admin/team/Team";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import QuickreplyIcon from "@mui/icons-material/Quickreply";

import SnapBooking from "@/app/component/dashboard/admin/snapbooking/snapbooking";
import ManageRoomCategories from "@/app/component/dashboard/admin/manageroomcategories/ManageRoomCategoriesTable";

import TeamList from "@/app/component/dashboard/admin/teamlist/Team";
import Booking from "@/app/component/dashboard/admin/booking/Booking";

import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import Category from "@/app/component/dashboard/admin/category/Category";
import BookIcon from "@mui/icons-material/Book";
import Blog from "@/app/component/dashboard/admin/blog/BlogForm";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import BlogList from "@/app/component/dashboard/admin/bloglist/BlogList";

const NAVIGATION = [
  {
    //     kind: "header" → This is NOT clickable.
    // It's just a label (like a section title in sidebar).
    // UI will render it as plain text.

    // 👉 Without this, your menu looks like a messy list.
    kind: "header",
    title: "Main items",
  },
  {
    //     segment → route or identifier (like /dashboard)
    // title → text shown in UI
    // icon → React component (Material UI icon)
    // color → custom color for styling

    // 👉 This is a clickable menu item
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
    color: "#6366F1", // Indigo
  },
  {
    segment: "orders",
    title: "Booking List",
    icon: <ShoppingCartIcon />,
    color: "#EC4899", // Pink
  },
  {
    segment: "profile",
    title: "Profile",
    icon: <PersonIcon />,
    color: "#10B981", // Gray
  },

  {
    segment: "team",
    title: "Team",
    icon: <GroupAddIcon />,
    color: "#32a8a8", // Gray
  },

  {
    segment: "teamlist",
    title: "TeamList",
    icon: <MarkunreadMailboxIcon />,
    color: "#360be3", // Gray
  },

  {
    segment: "snapbooking",
    title: "Snapbooking",
    icon: <QuickreplyIcon />,
    color: "#32a8a8", // Gray
  },

  {
    segment: "manageroomcategories",
    title: "Manage Room Categories",
    icon: <ManageHistoryIcon />,
    color: "#10B981", // Gray
  },

  {
    kind: "divider",
  },

  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
    color: "#10B981", // Emerald
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
        color: "#3B82F6", // Blue
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
        color: "#F59E0B", // Amber
      },
    ],
  },

  {
    segment: "category",
    title: "Category",
    icon: <LayersIcon />,
    color: "#8B5CF6", // Violet
  },

  {
    segment: "blog",
    title: "Blog",
    icon: <BookIcon />,
    color: "#F59E0B", // Violet
  },

  {
    segment: "bloglist",
    title: "BlogList",
    icon: <FormatListBulletedIcon />,
    color: "#f54287", // Violet
  },
];

const demoTheme = createTheme({
  palette: {
    mode: "light",
    //     sed for:
    // buttons
    // highlights
    primary: {
      main: "#6366F1",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#10B981",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#000",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  shape: {
    borderRadius: 12,
  },
  // This is where you override default styles of MUI components
  // Instead of styling each <AppBar /> or <Drawer /> manually everywhere, you define it once here.
  components: {
    //     What this actually does:

    // It modifies every <AppBar /> in your app

    // 🔍 root

    // 👉 root = the main DOM element of that component
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#111827",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDrawer: {
      //       paper Drawer is built using a Paper component internally
      // So you're targeting:
      // “the actual visible panel of the drawer”
      // What you're changing:
      // borderRight: "none" → removes default border line
      // boxShadow → adds soft side shadow
      styleOverrides: {
        paper: {
          borderRight: "none",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        },
      },
    },
  },
  //   This defines your responsive design rules

  // 👉 When screen width hits these values, layout changes
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});
// custom React hook
// Must start with use (React rule)
// Used inside React components
// 👉 initialPath = starting route (like /dashboard)
function useDemoRouter(initialPath) {
  //   What it does:
  // Creates state variable pathname
  // Initializes it with initialPath
  //  Example:useDemoRouter("/dashboard")
  // Then:pathname === "/dashboard"
  // setPathname
  //  Function to update the route setPathname("/orders")
  // Now:pathname === "/orders"
  const [pathname, setPathname] = React.useState(initialPath);
  //   What this does:
  // Creates query params object Equivalent to:?name=ajay&age=25
  // Handled by: new URLSearchParams()
  // instead of reat routing it just navigate using state hook
  const [searchParams] = React.useState(new URLSearchParams());

  return {
    pathname,
    searchParams,
    navigate: (path) => setPathname(String(path)),
  };
}
// This is a React component It receives a prop:
const PageContent = ({ path }) => {
  switch (path) {
    //     <Box>
    // MUI wrapper (like a div)
    // sx = styling So:
    // background = black
    case "/dashboard":
      return (
        <Box
          sx={{
            backgroundColor: "#000",
          }}
        >

          {/* <Typography paragraph>Welcome to your dashboard. Here you can see an overview of your application.</Typography> */}

          <DashBoard />
        </Box>
      );
    case "/orders":
      return (
        <Box>
        <Typography sx={{ mb: 2 }}>View and manage your Booking here.</Typography>
          <Booking />
        </Box>
      );
    case "/reports":
      return (
        <Box>
          <Typography variant="h4" gutterBottom>
            Reports
          </Typography>
          <Typography sx={{ mb: 2 }}>View your reports and analytics.</Typography>
        </Box>
      );
    case "/sales":
      return (
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Sales Report
          </Typography>
          <Sale />
        </Box>
      );
    case "/traffic":
      return (
        <Box>
          <Typography variant="h4"  sx={{ mb: 2 }}>
            Hotel Report
          </Typography>
          <Hotel />
        </Box>
      );
    case "/category":
      return (
        <Box>
          <Typography  sx={{ mb: 2 }}>
            Manage your third-party integrations.
          </Typography>
          <Category />
        </Box>
      );

    case "/profile":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <Profile />
        </Box>
      );

    case "/team":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <Team />
        </Box>
      );

    case "/teamlist":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <TeamList />
        </Box>
      );

    case "/snapbooking":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <SnapBooking />
        </Box>
      );

    case "/manageroomcategories":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <ManageRoomCategories />
        </Box>
      );

    case "/blog":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <Blog />
        </Box>
      );

    case "/bloglist":
      return (
        <Box sx={{ backgroundColor: "#000" }}>
          <BlogList />
        </Box>
      );

    default:
      return (
        <Box>
          <Typography variant="h4"  sx={{ mb: 2 }}>
            Page Not Found
          </Typography>
          <Typography>The requested page could not be found.</Typography>
        </Box>
      );
  }
};

const drawerWidth = 280;
// Controls sidebar width
// This is a recursive component (important)
// Props:
// item → one object from NAVIGATION
// router → your fake router
// drawerOpen → sidebar open/closed
// level → nesting depth (for indentation)
function NavigationItem({ item, router, drawerOpen, level = 0 }) {
  const [open, setOpen] = React.useState(false);
  // Controls:is dropdown expanded or collapsed
  const hasChildren = item.children && item.children.length > 0;
  // is a boolean check. It decides whether an object (item) has a valid, non-empty children array.
  //   tem.children
  // This tries to access the children property.
  // It could be:
  // undefined → no children property
  // [] → empty array
  // [ ... ] → actual child elements
  const theme = useTheme();
  // Gives access to:colors spacing palette

  const isActive =
    // “Is this menu item (or any of its children) currently selected?”
    //   Example:
    // item.segment = "dashboard"
    // router.pathname = "/dashboard"
    //  Result → true
    // So:If you're on /dashboard
    // And this item is dashboard
    // → it's active
    router.pathname === `/${item.segment}` ||
    //     Break it:

    // a) hasChildren
    // If no children → skip everything → false
    // b) .some(...)
    // .some() checks:

    // “Does at least ONE child match?”
    (hasChildren &&
      item.children.some((child) => router.pathname === `/${child.segment}`));

  const handleClick = () => {
    //     It does NOT navigate
    // It just toggles dropdown
    // Example:Click "Reports"
    // → expands/collapses child items
    if (hasChildren) {
      setOpen(!open);
    } else {
      //       Direct navigation
      // Example:Click "Dashboard"
      // // → goes to /dashboard
      router.navigate(`/${item.segment}`);
    }
  };

  if (item.kind === "header") {
    if (!drawerOpen) return null;
    // If sidebar is collapsed
    // → don’t show header at all
    return (
      <Typography
        variant="subtitle2"
        sx={{
          px: 2,
          py: 1.5,
          mt: level > 0 ? 1 : 0,
          color: "text.secondary",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}
      >
        {item.title}
      </Typography>
    );
  }

  if (item.kind === "divider") {
    //     Divider = horizontal line
    // my: 1 = margin top & bottom
    // borderColor: "divider" = theme color
    return <Divider sx={{ my: 1, borderColor: "divider" }} />;
  }

  return (
    <React.Fragment>
      {/* ust a wrapper so you can return multiple elements. */}
      <ListItem
        // This is the outer container of one menu item
        disablePadding
        sx={{
          pl: level * 2,
          // Indentation based on depth
          "& .MuiListItemButton-root": {
            // You're styling the button inside the item
            pl: 2 + level * 2,
            py: 0.75,
            minHeight: 44,
            borderRadius: 1,
            mx: 1,
            justifyContent: drawerOpen ? "initial" : "center",
            //             Sidebar open → normal layout (icon + text)
            // Sidebar closed → center only icon
            "&.Mui-selected": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              //               If item is active:

              // background becomes highlighted
              // icon color changes
              "& .MuiListItemIcon-root": {
                color: theme.palette.primary.main,
              },
            },
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.05),
              // Light highlight on hover
            },
          },
        }}
      >
        <ListItemButton
          selected={isActive}
          onClick={handleClick}
          sx={{
            "& .MuiListItemIcon-root": {
              //               If active → primary color
              // If not → default item color
              // Margin changes when sidebar closes
              minWidth: 0,
              mr: drawerOpen ? 2 : "auto",
              justifyContent: "center",
              color: isActive ? theme.palette.primary.main : item.color,
            },
            "& .MuiListItemText-root": {
              //               This is how sidebar "collapses"Open → text visible
              // Closed → text hidden (opacity 0)
              opacity: drawerOpen ? 1 : 0,
              transition: "opacity 0.2s ease",
              "& span": {
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.875rem",
                color: isActive ? theme.palette.primary.main : "inherit",
              },
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.title} />
          {/* ONLY if:item has children */}
          {/* sidebar is open */}
          {drawerOpen &&
            hasChildren &&
            (open ? (
              <ExpandLessIcon fontSize="small" />
            ) : (
              <ExpandMoreIcon fontSize="small" />
            ))}
        </ListItemButton>
      </ListItem>
      {hasChildren && drawerOpen && (
        // hasChildren → item actually has sub-items
        // drawerOpen → sidebar is expanded
        <Collapse in={open} timeout="auto" unmountOnExit>
          {/* This controls animation + visibility
          unmountOnExit 
          When closed → it removes children from DOM completely
Not just hidden → destroyed
Why?Better performance
Avoid unnecessary rendering */}
          <List component="div" disablePadding>
            {/* component="div" → renders as <div> instead of <ul> */}
            {/* disablePadding → removes default spacing */}
            {item.children.map((child) => (
              <NavigationItem
                key={child.segment}
                item={child}
                router={router}
                drawerOpen={drawerOpen}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
}
// navigation → your sidebar data (menu items)
// router → your custom router (pathname + navigate)
// // window → used for responsive drawer (mobile)
function CustomDashboardLayout({ navigation, router, window }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  // desktop sidebar width
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  const handleLogout = () => {
    // This is where you would typically call the Next-Auth signOut function
    // Logs user out and redirects to /login
    // In a real app, you would do something like:
    signOut({ callbackUrl: "/login" });
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#000",
        color: "#fff",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: desktopOpen ? "space-between" : "center",
          // Open → logo left, icon right
          // Closed → everything centered
          px: desktopOpen ? 2 : 0.5,
          minHeight: "72px !important",
          borderBottom: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        {/* Logo area — fixed height so it doesn't jump */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: desktopOpen ? "flex-start" : "center",
            flex: desktopOpen ? 1 : 0,
            overflow: "hidden",
            height: 40,
            transition: theme.transitions.create(["width", "opacity"], {
              duration: theme.transitions.duration.shortest,
            }),
          }}
        >
          {desktopOpen ? (
            <Box
              sx={{
                transform: "scale(0.75)",
                transformOrigin: "left center",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <HotelHubLogo />
            </Box>
          ) : (
            <Typography
              sx={{
                color: "red",
                fontWeight: "bold",
                fontSize: "1.4rem",
                fontStyle: "italic",
              }}
            >
              H
            </Typography>
          )}
        </Box>

        <IconButton
          onClick={handleDesktopDrawerToggle}
          size="small"
          sx={{
            color: "text.secondary",
            flexShrink: 0,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ChevronLeftIcon
            sx={{
              transform: desktopOpen ? "rotate(0deg)" : "rotate(180deg)",
              // Arrow rotates when sidebar collapses
              transition: theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
              }),
            }}
          />
        </IconButton>
      </Toolbar>

      <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
        <List sx={{ width: "100%" }}>
          {/* Each item rendered using NavigationItem component */}
          {/* This is where your recursion happens (nested menus) */}
          {navigation.map((item, index) => (
            <NavigationItem
              key={item.segment || `${item.kind}-${index}`}
              item={item}
              router={router}
              drawerOpen={desktopOpen}
            />
          ))}
        </List>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            px: 2,
            py: 1.5,
            "&:hover": {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: desktopOpen ? 2 : "auto",
              justifyContent: "center",
              color: theme.palette.error.main,
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              // ext hidden when sidebar collapsed
              opacity: desktopOpen ? 1 : 0,
              transition: "opacity 0.2s ease",
              "& span": {
                color: theme.palette.error.main,
                fontWeight: 500,
                fontSize: "0.875rem",
              },
            }}
          />
        </ListItemButton>
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid",
          borderColor: "divider",
          display: desktopOpen ? "block" : "none",
        }}
      >
        <Box
          sx={{
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 2,
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
            Upgrade to Pro
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Unlock all features
          </Typography>
        </Box>
      </Box>
    </Box>
  );
  // Used for: Fixing mobile drawer mounting issue
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 72}px)` },
          ml: { sm: `${desktopOpen ? drawerWidth : 72}px` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: 600 }}
          >
            {/* If condition is TRUE → show "Dashboard"
If FALSE → show nothing
This is called short-circuit rendering */}
            {router.pathname === "/dashboard" && "Dashboard"}
            {router.pathname === "/orders" && "Booking List"}
            {router.pathname === "/profile" && "Admin Profile"}

            {router.pathname === "/team" && "Team Members"}

            {router.pathname === "/teamlist" && "Team Members List"}

            {router.pathname === "/snapbooking" && "Snap Booking"}

            {router.pathname === "/manageroomcategories" &&
              "manage room categories"}

            {router.pathname === "/reports" && "Reports"}
            {router.pathname === "/sales" && "Sales Report"}
            {router.pathname === "/traffic" && "Traffic Report"}
            {router.pathname === "/category" && "Category"}
            {router.pathname === "/blog" && "Blog"}
            {router.pathname === "/bloglist" && "BlogList"}
            {/* Checks if current route exists in the list */}
            {![
              "/dashboard",
              "/orders",
              "/profile",
              "/reports",
              "/sales",
              "/traffic",
              "/integrations",
              "/team",
              "/teamlist",
              "/snapbooking",
              "/manageroomcategories",
              "/category",
              "/blog",
              "/bloglist"
            ].includes(router.pathname) && "Page Not Found"}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: theme.palette.grey[200],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ fontWeight: 500 }}>JD</Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          backgroundColor: "#000",
          color: "#fff",

          width: { sm: desktopOpen ? drawerWidth : 72 },
          flexShrink: { sm: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: desktopOpen ? drawerWidth : 72,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          backgroundColor: "#000",
          color: "#fff",
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${desktopOpen ? drawerWidth : 72}px)` },
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 72 }} />
        <Box
          sx={{
            backgroundColor: theme.palette.background.default,
            minHeight: "calc(100vh - 72px)",
            borderRadius: 3,
            p: 3,
          }}
        >
          <PageContent path={router.pathname} />
        </Box>
      </Box>
    </Box>
  );
}

export default function DashboardLayoutBasic(props) {
  const { window } = props;
  const router = useDemoRouter("/dashboard");
// //    This is important.Calls your custom hook
// Initializes route as /dashboard Now your app behaves like it has routing, even without Next.js router.
  const demoWindow = window ? window() : undefined;

  return (
//     his wraps your entire layout with a theme.
// demoTheme → contains colors, typography, spacing
// Makes theme available everywhere
    <ThemeProvider theme={demoTheme}>
      <CustomDashboardLayout
        navigation={NAVIGATION}
        // NAVIGATION → array of menu items  Used to build sidebar
//         Passing your custom router
// Used for:
// router.pathname
// router.navigate()

        router={router}
        window={demoWindow}
        // Passing processed window object
// Used for Drawer responsiveness
      />
    </ThemeProvider>
  );
}