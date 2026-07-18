// styles/blogFormStyles.js
export const formContainerStyles = {
    maxWidth: 1200,
    mx: 'auto',
    // Horizontal margin auto → centers container
    p: { xs: 2, md: 4 },
    // small screens: 2
// medium+: 4
    backgroundColor: '#000000',
    color: '#ffffff',
    minHeight: '100vh'
    // Full screen height
  };
  
  export const titleStyles = {
    mb: 3,
    textAlign: 'center',
    color: 'inherit'
    // use parent color (white from container)
  };
  
  export const textFieldStyles = {
    // Targets actual input text
// 👉 Makes typed text white
    '& .MuiInputBase-input': {
      color: '#ffffff',
    },
    // This targets the whole input box.
    '& .MuiOutlinedInput-root': {
      // Default border
      '& fieldset': {
        borderColor: '#8A12FC',
      },
      // Same color on hover
      '&:hover fieldset': {
        borderColor: '#8A12FC',
      },
      // Same color when focused
      '&.Mui-focused fieldset': {
        borderColor: '#8A12FC',
      },
    },
    // Label = purple
    '& .MuiInputLabel-root': {
      color: '#8A12FC',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#8A12FC',
    }
  };
  
  export const selectStyles = {
    // Label color
    '& .MuiInputLabel-root': {
      color: '#8A12FC',
    },
    '& .MuiOutlinedInput-root': {
      // Same structure as textField:
      '& fieldset': {
        borderColor: '#8A12FC',
      },
      '&:hover fieldset': {
        borderColor: '#8A12FC',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#8A12FC',
      },
    },
    // Arrow icon becomes purple
    '& .MuiSelect-icon': {
      color: '#8A12FC',
    }
  };
  
  export const menuItemStyles = {
    color: '#000000',
    '&:hover': {
      backgroundColor: 'rgba(138, 18, 252, 0.1)',
    },
    // Selected item background becomes lighter purple
    '&.Mui-selected': {
      backgroundColor: 'rgba(138, 18, 252, 0.2)',
    }
    // Darker purple when selected
  };
  
  export const submitButtonStyles = {
    px: 4,
    backgroundColor: '#8A12FC',
    color: '#ffffff',
    // Slightly darker purple
    '&:hover': {
      backgroundColor: '#7A0BEC',
    },
    '&:disabled': {
      backgroundColor: 'rgba(138, 18, 252, 0.5)',
    }
  };
  
  export const iconStyles = {
    mr: 1,
    mt: 1,
    color: '#8A12FC'
  };
  
  export const categoryIconStyles = {
    mr: 1,
    color: '#8A12FC'
  };
  
  export const alertStyles = {
    mb: 3,
    '& .MuiAlert-icon': {
      color: '#8A12FC'
    }
  };