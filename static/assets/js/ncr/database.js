var TABLE_SIZE = 10;
var Buffer;

var xmlHttp = GetXmlHttpObject();

function GetXmlHttpObject()
{
    //xmlHttp created to store XMLHttpRequest object
    var xmlHttp;
    try
    {
        // Firefox, Opera 8.0+, Safari
        xmlHttp=new XMLHttpRequest();
    }
    catch (e)
    {// Internet Explorer
        try
        {
            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch (e)
        {
            try
            {
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e)
            {
                alert("Your browser does not support AJAX!");
                return false;
            }
        }
    }
    return xmlHttp;
}

//Gathers the variables from the web application and posts the data and waits for a repsonse
function eventLoadModels()
{
    var scope = document.getElementById("SearchScope");
    var izh = document.getElementById("SearchIzhikevichBox");
    var lif = document.getElementById("SearchLIFBox");
    var contains = document.getElementById("SearchContains");
    
    if(!xmlHttp)
    {//Already midprocessing. Override attempt.
        alert("Your browser is not ajax compatible.");
        return;
    }
    xmlHttp.open("GET", "/loadmodels",true);
    xmlHttp.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
    xmlHttp.setRequestHeader("Cache-Control", "no-cache"); 
    xmlHttp.onreadystatechange=function()
    {
        if(xmlHttp.readyState==4)
        {
            //Buffer = JSON.parse(xmlHttp.responseText);
            if(!xmlHttp.responseText)
                alert("An error has occured!");
            else
            {
                alert(xmlHttp.responseText);//for now, just see if we're getting anything back
                /*
                 for(var i = 0; i < TABLE_SIZE; i++)
                 {
                 if(i < Buffer.length)
                 {
                 document.getElementById("TableEntry"+i).innerHTML = "<td>"+Buffer[i][2]+"."+Buffer[i][0]+"</td><td>"+Buffer[i][1][0]+"</td><td>"+Buffer[i][1][1]+"</td><td>"
                 +Buffer[i][1][2]+"</td><td>"+Buffer[i][1][3]+"</td><td>"+Buffer[i][1][4]+"</td><td>"+Buffer[i][1][5]+"</td><td>";
                 }
                 else
                 document.getElementById("TableEntry"+i).innerHTML = "<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>";
                 }
                 */
            }
        }
    }
    xmlHttp.send(null); 
}
/*
 function SelectTableEntry(entry)
 {//used to load model details
 for(var i = 0; i < TABLE_SIZE; i++)
 {
 if((i < Buffer.length) && (entry == i))
 {
 document.getElementById("TableEntry"+i).className = "success";
 document.getElementById("AuthorDetails").innerHTML = "Author: "+capitalize(Buffer[i][2]);
 document.getElementById("ModelDetails").innerHTML = "Model: "+capitalize(Buffer[i][0]);
 }
 else
 document.getElementById("TableEntry"+i).className = "";
 } 
 }
 */