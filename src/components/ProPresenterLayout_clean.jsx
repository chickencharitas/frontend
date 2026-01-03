// Clean version of the top menu section
// Replace the problematic section in ProPresenterLayout.jsx with this

            <Typography
              onClick={(e) => setLibraryMenuAnchor(e.currentTarget)}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Library ▾
            </Typography>
            <Menu
              anchorEl={libraryMenuAnchor}
              open={Boolean(libraryMenuAnchor)}
              onClose={() => setLibraryMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/songs'); setLibraryMenuAnchor(null); }}>Songs</MenuItem>
              <MenuItem onClick={() => { navigate('/scripture'); setLibraryMenuAnchor(null); }}>Scripture</MenuItem>
              <MenuItem onClick={() => { navigate('/media'); setLibraryMenuAnchor(null); }}>Media</MenuItem>
              <MenuItem onClick={() => { navigate('/templates'); setLibraryMenuAnchor(null); }}>Templates</MenuItem>
            </Menu>

            <Typography
              onClick={(e) setLiveMenuAnchor(e.currentTarget)}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Live ▾
            </Typography>
            <Menu
              anchorEl={liveMenuAnchor}
              open={Boolean(liveMenuAnchor)}
              onClose={() => setLiveMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/live'); setLiveMenuAnchor(null); }}>Live Control</MenuItem>
              <MenuItem onClick={() => { navigate('/presenter'); setLiveMenuAnchor(null); }}>Presenter View</MenuItem>
              <MenuItem onClick={() => { navigate('/planner'); setLiveMenuAnchor(null); }}>Service Planner</MenuItem>
              <MenuItem onClick={() => { navigate('/timer'); setLiveMenuAnchor(null); }}>Timer</MenuItem>
            </Menu>

            <Typography
              onClick={(e) setToolsMenuAnchor(e.currentTarget)}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Tools ▾
            </Typography>
            <Menu
              anchorEl={toolsMenuAnchor}
              open={Boolean(toolsMenuAnchor)}
              onClose={() => setToolsMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/devices'); setToolsMenuAnchor(null); }}>Devices</MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); setToolsMenuAnchor(null); }}>Settings</MenuItem>
            </Menu>
