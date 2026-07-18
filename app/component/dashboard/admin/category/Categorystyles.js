export const styles = {
    container: {
      p: 3,
      maxWidth: "900px",
    //   Limits container width to 900px
      mx: "auto"
      // Centers container horizontally
    },
    searchInput: {
        // Targets the input text inside TextField
      input: { color: 'white' },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#8A12FC',
        //   Changes default border color of input
        },
        '&:hover fieldset': {
          borderColor: '#8A12FC',
        //   When user hovers → border stays same color
        },
        '&.Mui-focused fieldset': {
          borderColor: '#8A12FC',
        //   When input is focused (clicked)
        },
      },
    },
    inputLabel: {
      style: { color: '#8A12FC' }
    },
    addButton: {
      backgroundColor: "#8A12FC",
      '&:hover': {
        backgroundColor: "#6a0bc9",
        // On hover → darker purple
      }
    },
    listItem: {
      borderColor: '#8A12FC',
      '&:hover': {
        backgroundColor: "rgba(138, 18, 252, 0.1)",
        // On hover → light purple transparent background
      }
    },
    searchIcon: {
      color: '#8A12FC'
    }
  };