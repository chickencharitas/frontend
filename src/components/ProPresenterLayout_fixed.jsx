// This is just to show the fixed structure - don't use this file

// The issue is that the JSX structure got corrupted. The fix is to ensure proper closing tags
// Here's the correct structure for the top bar menus:

<Typography onClick={handleFileMenuClick}>File</Typography>
<Menu anchorEl={fileMenuAnchor}>...</Menu>

<Typography onClick={handleEditMenuClick}>Edit</Typography>
<Menu anchorEl={editMenuAnchor}>...</Menu>

<Typography onClick={handlePresentationMenuClick}>Presentation</Typography>
<Menu anchorEl={presentationMenuAnchor}>...</Menu>

<Typography onClick={handleScreensMenuClick}>Screens</Typography>
<Menu anchorEl={screensMenuAnchor}>...</Menu>

<Typography onClick={handleViewMenuClick}>View</Typography>
<Menu anchorEl={viewMenuAnchor}>...</Menu>

<Typography onClick={handleWindowMenuClick}>Window</Typography>
<Menu anchorEl={windowMenuAnchor}>...</Menu>

<Typography onClick={handleHelpMenuClick}>Help</Typography>
<Menu anchorEl={helpMenuAnchor}>...</Menu>

<Typography onClick={(e) => setLibraryMenuAnchor(e.currentTarget)}>Library ▾</Typography>
<Menu anchorEl={libraryMenuAnchor}>...</Menu>

<Typography onClick={(e) setLiveMenuAnchor(e.currentTarget)}>Live ▾</Typography>
<Menu anchorEl={liveMenuAnchor}>...</Menu>

<Typography onClick={(e) setToolsMenuAnchor(e.currentTarget)}>Tools ▾</Typography>
<Menu anchorEl={toolsMenuAnchor}>...</Menu>
