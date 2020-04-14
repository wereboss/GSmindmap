const ROW_KEY = 0;
const ROW_TITLE = 1;
const ROW_SDESC = 2;
const ROW_DESC = 3;
const ROW_ACTIONS = 4;
const ROW_LINKS = 5;
const ROW_ACTIONSFORMULA = 6;

function genJSONfromSheet(sheetName) {
  var nodeJSON;
  var nodeJSON = {
    "nodearray": [],
    "linkarray": []
  }
  var sApp = SpreadsheetApp.getActive();
  var shtNode = sApp.getSheetByName(sheetName);
  var nodeObj = {};
  var actionsArr = [];
  var actionItem = {};
  var linkObj = {};
  var linkList = [];
  var linkStr = ""; var urlStr = "";
  var URLlist = [];
  
 
  var dataRange = shtNode.getDataRange().getValues();
  for(let cRow of dataRange){
    //console.log(JSON.stringify(cRow));
    //ignore first row
    if(cRow[0] != "key") {
      nodeObj = {};
      nodeObj.key = cRow[ROW_KEY];
      nodeObj.title = cRow[ROW_TITLE];
      nodeObj.sdesc = cRow[ROW_SDESC];
      actionItem = {};
      actionsArr = [];
      if(cRow[3] && cRow[3].trim().length > 0){
        actionItem.figure = "Pointer";
        actionItem.fill = "white";
        actionItem.text = cRow[ROW_DESC];
        actionsArr.push(actionItem);
      }
      if(cRow[ROW_ACTIONSFORMULA] && cRow[ROW_ACTIONSFORMULA].length>0) {
        urlStr = "" + cRow[ROW_ACTIONSFORMULA];
      }
      else {
        urlStr = "" + cRow[ROW_ACTIONS];
      }
      URLlist = urlStr.split(";");
      
      for (let url of URLlist) {
        if(url && url.trim().length > 0){
          actionItem = {};
          actionItem.figure = "Arrow";
          actionItem.fill = "cyan";
          actionItem.alttext = "@";
          if (url.indexOf("|~|") > 0) {
            var urlP = url.split("|~|");
            actionItem.text = urlP[0];
            actionItem.url = urlP[1];
          }
          else {
            actionItem.text = "Click Here :-";
            actionItem.url = url;
          }
          actionsArr.push(actionItem);
        }
      }
      nodeObj.actions = [];
      nodeObj.actions = Array.from(actionsArr);
      nodeJSON.nodearray.push(nodeObj);
      
      linkStr = "" + cRow[ROW_LINKS];
      linkList = linkStr.split(";");
      
      for (let link of linkList) {
        if(parseInt(link)){
          linkObj = {};
          linkObj.from = cRow[ROW_KEY];
          linkObj.to = parseInt(link);
          linkObj.answer = parseInt(link);
          nodeJSON.linkarray.push(linkObj);
        }
      }
      
    }
    
  }
  //console.log(JSON.stringify(nodeJSON));
  return nodeJSON;
}


function getElementsByTagName(element, tagName) {  
  var data = [];
  var descendants = element.getDescendants();  
  for(i in descendants) {
    var elt = descendants[i].asElement();     
    if( elt !=null && elt.getName()== tagName) data.push(elt);      
  }
  return data;
}

function getTitleforURL(url){
  var html = UrlFetchApp.fetch(url).getContentText();
  var doc = XmlService.parse(html);
  var htmlRoot = doc.getRootElement();
  var titleEle = getElementsByTagName(htmlRoot, 'title')[0];
  return titleEle.getValue();
}

function processURLCell(cell){
  var urlStr = "" + cell;
  var URLlist = urlStr.split(";");
  var outList = [];
  for (url of URLlist){
    if(url && url.length > 0){
    outList.push(getTitleforURL(url) + "|~|" + url);
  }
  };
  return outList.join(";");
}

function testFlow(){
     // console.log(JSON.stringify(genJSONfromSheet("Nodes")));
  //console.log(IMPORTXML("www.google.com","//title"))
  var htmlData = UrlFetchApp.fetch("https://www.google.com").getContentText();
  var xmldoc = XmlService.parse(htmlData);
  var rootEle = xmldoc.getRootElement();
  var data = [];
  var descendants = rootEle.getDescendants();  
  for(i in descendants) {
    var elt = descendants[i].asElement();     
    if( elt !=null && elt.getName()== "title") data.push(elt);      
  }
  
  console.log(JSON.stringify(data));
  //var elements = xmldoc.getRootElement().getChildren();
  //var title = xmldoc.html.head.getElements("title")[0].getText();
  
}
    

function doGet(e) {
  //var params = retJSON();
  var sheetName = "";
  var params;
  //console.log("e:" + JSON.stringify(e,null,4));
  if(e && e.parameter){
    if(e.parameter.MMName && e.parameter.MMName.length > 0) {
      sheetName = e.parameter.MMName;
      //console.log("Sheetname:" + sheetName);
      params = genJSONfromSheet(sheetName);
      if(e.parameter.form && e.parameter.form.length > 0) {
        //return HtmlService.createHtmlOutputFromFile('MindMap');
        var htmlTmp = HtmlService.createTemplateFromFile('MindMap');
        htmlTmp.sheetName = sheetName
        return htmlTmp.evaluate();
      }
      else { 
        var outTXT = ContentService.createTextOutput();
        outTXT.setContent(JSON.stringify(params,null,4));
        outTXT.setMimeType(ContentService.MimeType.JSON);
        return outTXT;      
      }
    }
  }

}