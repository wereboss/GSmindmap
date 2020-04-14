# GSmindmap
MindMap using Google Sheets

## Build
- Uses the Google App Script to Web App model to serve MindMap JSON or HTML
- Uses GoJS to display (mindmap model extended from IVR tree example)

## Setup
- Create a new Google Spreadsheet
- Using the Tools -> Script Editor, copy the .GS code into Code.gs (default script)
- Within the spreadsheet, Assign a Name the Sheet and create the below columns
    - Key - numerical incremental values
    - Title - the idea title
    - sDec - the idea short description to display
    - Desc - the idea detailed description