# GSmindmap #
MindMap using Google Sheets

## Build ##
- Uses the Google App Script to Web App model to serve MindMap JSON or HTML
    - Spreadsheet as Data storage
    - Web App as JSON source & HTML serving
    - Google App Script HTML templating for modularising HTML
- Uses GoJS to display (mindmap model extended from IVR tree example)
    - [GoJS](https://gojs.net/latest/index.html)
    - [GoJS Example: IVR Tree](https://gojs.net/latest/samples/IVRtree.html)


## Getting it to work ##
### Setting up Google App Script ###
1. Create a **new Google Spreadsheet**
2. Using the **Tools -> Script Editor**, copy the .GS code into Code.gs (default script)
3. Add the HTML file also inside the App script project (if HTML filename needs to change, update the doGet script)


### Setting up Web App ###

1. On Script Editor click **Publish -> Deploy as Web App**
2. On the Web App dialog:
    1. Ensure to always choose a new version after any code changes in GS file (somehow it only works this way). Luckily changes in HTML reflect instantly
    2. Keep "**Execute Task as**:" = "**Me**" - So that the script is able to read the data from your Spreadsheet
    3. Keep "**Who has access to the app**" = "**Anyone, even anonymous**" - So that your HTML page & JSON data points work from any location, even non-Google logged in sessions
3. Once deployed, it would provide the "**/exec**" version of the URL. Copy and update this inside the HTML (look for below snippet)

```javascript

var request = new XMLHttpRequest();
        request.open(
          "GET",
          "https://##UPDATE_YOUR_EXEC_URL##?MMName=<?= sheetName?>",
          true
        );
```

### Setting up the Spreadsheet ###
- Within the spreadsheet, Name the Sheet and create the below columns
    - **Key** - numerical incremental values
    - **Title** - the idea title
    - **sDec** - the idea short description to display
    - **Desc** - the idea detailed description
    - **Actions** - additional reading URLs (;) seperated. 
    - **Links** - mention the "key" values of child nodes
    - **Action Formula** - a column carrying formula for "processURLCell" function processing "Actions" column

(The constants defined in MindMap.gs align the column numbers for these columns, change them if different)

Sample Spreadsheet:
| Key (A: Col 0) 	| Title (B: Col 1) 	| Short Desc (C: Col 2)  	| Long Desc (D: Col 3)                                  	| Actions (E: Col 4)                                                                         	| Links (F: Col 5) 	| Actions Formula (G: Col 6) 	|
|----------------	|------------------	|------------------------	|-------------------------------------------------------	|--------------------------------------------------------------------------------------------	|------------------	|----------------------------	|
| 1              	| Brick House      	| sint tempor pariatur   	| Dolor occaecat occaecat labore ullamco exercitation.  	| https://tinyurl.com/vmsva6u;https://tinyurl.com/s7kz9dv 	| 2;3              	| =processURLCell(E2)        	|
| 2              	| Living Room      	| aliqua aute nostrud    	| Amet velit ea pariatur occaecat pariatur ut occaecat  	| https://en.wikipedia.org/wiki/Fumiyo_Ikeda                                     	| 4                	| =processURLCell(E3)        	|
| 3              	| Kitchen          	| irure cupidatat dolore 	| Consectetur mollit laborum laboris quis qui           	|                                                                                            	| 5                	| =processURLCell(E4)        	|
| 4              	| Bedroom          	| Proident voluptate sit 	| cillum irure est duis laborum deserunt id elit elit . 	|                                                                                            	|                  	| =processURLCell(E5)        	|
| 5              	| Backyard         	| Magna laborum aliqua   	| Proident voluptate sit eiusmod pariatur               	|                                                                                            	|                  	| =processURLCell(E6)        	|

### Testing the Setup ###
1. Once you have your data ready, try the below URL
`https://your Web App Exec URL?MMName=Your_Sheet_Name&form=html`
2. Potential Errors:
    - _Google Error HTML page_ : doGet() and its internal functional flows have failed somehow. Check View->Logs inside the Google App Script project. 
    - _Page loads but no mindmap is show_ : Potentially the JSON serving has failed. check using the below URL to test the JSON
`https://your Web App Exec URL?MMName=Your_Sheet_Name`
    - _The node collapse/expand feature on description/URL etc are not working_: Potentially JSON is not built correctly possibly due to incorrect delimitters or data setup. Check the spreadsheet

## ToDo ##
- [x] Simplified Tree MindMap, driven by Google Sheets, Editable & Accessible everywhere 
- [ ] Enable Rich Text Description, with bullets and headings
- [ ] Enable tagging, tag filtering, re-treeing based on tags