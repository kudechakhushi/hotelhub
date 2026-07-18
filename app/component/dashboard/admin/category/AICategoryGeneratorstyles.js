export const styles = {
    container: {
      mt: 3,
      p: 3,
      border: '2px solid #6C5CE7',
      borderRadius: 3,
      backgroundColor: '#000',
      boxShadow: '0px 4px 20px rgba(108, 92, 231, 0.2)',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0px 6px 24px rgba(108, 92, 231, 0.3)'
      }
    },
    header: {
      color: '#6C5CE7',
      fontWeight: 700,
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
    },
    generateButton: {
      mb: 2,
      backgroundColor: '#6C5CE7',
      color: '#FFFFFF',
      fontWeight: 600,
      letterSpacing: '0.5px',
      '&:hover': {
        backgroundColor: '#00A884',
        transform: 'translateY(-1px)'
      },
    //   On hover:On hover:

    //   color changes (purple → green)
    //   button moves up slightlycolor changes (purple → green)button moves up slightly
      '&:active': {
        transform: 'translateY(0)'
      },
    //   When clicked → resets position
      py: 1.5,
      boxShadow: '0 4px 6px rgba(0, 184, 148, 0.25)',
      transition: 'all 0.2s ease'
    //   Adds smooth click/hover animation
    },
    errorBox: {
      backgroundColor: 'rgba(214, 48, 49, 0.125)',
      borderLeft: '4px solid #D63031',
      p: 1.5,
      mb: 2,
      borderRadius: '0 4px 4px 0'
    },
    errorText: {
      color: '#D63031',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    },
    divider: {
      my: 2,
      borderColor: 'rgba(108, 92, 231, 0.2)',
      borderWidth: '1px',
      borderStyle: 'dashed'
    //   Custom dashed divider/
    },
    suggestionsTitle: {
      color: '#fff',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: 1
    },
    chipsContainer: {
      flexWrap: 'wrap',
      gap: 1,
      mb: 3,
      '& > *': {
        // & > * → targets all child elements
        flex: '1 1 calc(50% - 8px)',
        minWidth: '120px',
        '@media (min-width: 600px)': {
          flex: '1 1 calc(33% - 8px)'
        //   Mobile → 2 per row
// Desktop → 3 per row
        }
      }
    },
    chip: (color, selected) => ({
      cursor: 'pointer',
      borderColor: color,
      color: selected ? '#FFFFFF' : color,
    //   If selected:
// text becomes white
// else → uses chip color
      backgroundColor: selected ? color : 'transparent',
      '&:hover': {
        backgroundColor: `${color}${selected ? 'CC' : '20'}`,
        transform: 'scale(1.02)'
      },
      fontSize: '0.875rem',
      py: 1,
      fontWeight: 500,
      transition: 'all 0.2s ease',
      boxShadow: selected ? `0 2px 8px ${color}80` : 'none'
    //   Selected chip gets glow
    }),
    addButton: {
      backgroundColor: '#FD79A8',
      color: '#FFFFFF',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: '#FC62A5',
        transform: 'translateY(-1px)'
      },
      '&:active': {
        transform: 'translateY(0)'
      },
      '&:disabled': {
        backgroundColor: 'rgba(253, 121, 168, 0.25)',
        color: 'rgba(255, 255, 255, 0.5)'
      },
    //   Disabled state styling
      px: 3,
      boxShadow: '0 4px 8px rgba(253, 121, 168, 0.25)',
      transition: 'all 0.2s ease'
    },
    closeButton: {
      color: '#D63031',
    //   Red close icon
      '&:hover': {
        backgroundColor: 'rgba(214, 48, 49, 0.125)'
      }
    //   Subtle hover highlight
    }
  };
  
  export const chipColors = [
    '#6C5CE7', // purple
    '#00B894', // teal
    '#FD79A8', // pink
    '#0984E3', // blue
    '#FDCB6E'  // yellow
  ];
  
  export const animations = {
    spin: {
        // Full rotation animation
      '@keyframes spin': {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' }
      }
    }
  };