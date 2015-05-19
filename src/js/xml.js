function getRSS()
{
    /*A*/
    if (window.ActiveXObject) //IE
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    else if (window.XMLHttpRequest) //other
        xhr = new XMLHttpRequest();
    else
        alert("your browser does not support AJAX");

    /*B*/
    xhr.open("GET","http://netponents.github.io/NETponentsWebsite/feed.xml",true);

    /*C*/
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.setRequestHeader("Pragma", "no-cache");

    /*D*/
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4)
        {
            if (xhr.status == 200)
            {
                /*F*/
                if (xhr.responseText != null)
                    processRSS(xhr.responseXML);
                else
                {
                    alert("Failed to receive RSS file from the server - file not found.");
                    return false;
                }
            }
            else
                alert("Error code " + xhr.status + " received: " + xhr.statusText);
        }
    }

    /*E*/
    xhr.send(null);
}
function processRSS(rssxml)
{
    RSS = new RSS2Channel(rssxml);
    showRSS(RSS);
}
function RSS2Channel(rssxml)
{
    /*A*/
    /*required string properties*/
    this.title;
    this.link;
    this.description;

    /*optional string properties*/
    this.language;
    this.copyright;
    this.managingEditor;
    this.webMaster;
    this.pubDate;
    this.lastBuildDate;
    this.generator;
    this.docs;
    this.ttl;
    this.rating;

    /*optional object properties*/
    this.category;
    this.image;

    /*array of RSS2Item objects*/
    this.items = new Array();

    /*B*/
    var chanElement = rssxml.getElementsByTagName("channel")[0];
    var itemElements = rssxml.getElementsByTagName("item");

    /*C*/
    for (var i=0; i<itemElements.length; i++)
    {
        Item = new RSS2Item(itemElements[i]);
        this.items.push(Item);
    }

    /*D*/
    var properties = new Array("title", "link", "description", "language", "copyright", "managingEditor", "webMaster", "pubDate", "lastBuildDate", "generator", "docs", "ttl", "rating");
    var tmpElement = null;
    for (var i=0; i<properties.length; i++)
    {
        tmpElement = chanElement.getElementsByTagName(properties[i])[0];
        if (tmpElement!= null)
            eval("this."+properties[i]+"=tmpElement.childNodes[0].nodeValue");
    }

    /*E*/
    this.category = new RSS2Category(chanElement.getElementsByTagName("category")[0]);
    this.image = new RSS2Image(chanElement.getElementsByTagName("image")[0]);
}
function RSS2Category(catElement)
{
    if (catElement == null) {
        this.domain = null;
        this.value = null;
    } else {
        this.domain = catElement.getAttribute("domain");
        this.value = catElement.childNodes[0].nodeValue;
    }
}
function RSS2Image(imgElement)
{
    if (imgElement == null) {
    this.url = null;
    this.link = null;
    this.width = null;
    this.height = null;
    this.description = null;
    } else {
        imgAttribs = new Array("url","title","link","width","height","description");
        for (var i=0; i<imgAttribs.length; i++)
            if (imgElement.getAttribute(imgAttribs[i]) != null)
                eval("this."+imgAttribs[i]+"=imgElement.getAttribute("+imgAttribs[i]+")");
    }
}
function RSS2Item(itemxml)
{
    /*A*/
    /*required properties (strings)*/
    this.title;
    this.link;
    this.description;

    /*optional properties (strings)*/
    this.author;
    this.comments;
    this.pubDate;

    /*optional properties (objects)*/
    this.category;
    this.enclosure;
    this.guid;
    this.source;

    /*B*/
    var properties = new Array("title", "link", "description", "author", "comments", "pubDate");
    var tmpElement = null;
    for (var i=0; i<properties.length; i++)
    {
        tmpElement = itemxml.getElementsByTagName(properties[i])[0];
        if (tmpElement != null)
            eval("this."+properties[i]+"=tmpElement.childNodes[0].nodeValue");
    }

    /*C*/
    this.category = new RSS2Category(itemxml.getElementsByTagName("category")[0]);
    this.enclosure = new RSS2Enclosure(itemxml.getElementsByTagName("enclosure")[0]);
    this.guid = new RSS2Guid(itemxml.getElementsByTagName("guid")[0]);
    this.source = new RSS2Source(itemxml.getElementsByTagName("source")[0]);
}
function RSS2Enclosure(encElement)
{
    if (encElement == null) {
        this.url = null;
        this.length = null;
        this.type = null;
    } else {
        this.url = encElement.getAttribute("url");
        this.length = encElement.getAttribute("length");
        this.type = encElement.getAttribute("type");
    }
}

function RSS2Guid(guidElement)
{
    if (guidElement == null) {
        this.isPermaLink = null;
        this.value = null;
    } else {
        this.isPermaLink = guidElement.getAttribute("isPermaLink");
        this.value = guidElement.childNodes[0].nodeValue;
    }
}

function RSS2Source(souElement)
{
    if (souElement == null) {
        this.url = null;
        this.value = null;
    } else {
        this.url = souElement.getAttribute("url");
        this.value = souElement.childNodes[0].nodeValue;
    }
}
function showRSS(RSS)
{
    /*A*/
    var imageTag = "<img id='chan_image'";
    var startItemTag = "<div id='item'>";
    var startTitle = "<div id='item_title'>";
    var startLink = "<div id='item_link'>";
    var startDescription = "<div id='item_description'>";
    var endTag = "</div>";

    /*B*/
    var properties = new Array("title","link","description","pubDate","copyright");
    for (var i=0; i<properties.length; i++)
    {
        eval("document.getElementById('chan_"+properties[i]+"').innerHTML = ''"); /*B1*/
        curProp = eval("RSS."+properties[i]);
        if (curProp != null)
            eval("document.getElementById('chan_"+properties[i]+"').innerHTML = curProp"); /*B2*/
    }

    /*C*/
    /*show the image*/
    document.getElementById("chan_image_link").innerHTML = "";
    if (RSS.image.src != null)
    {
        document.getElementById("chan_image_link").href = RSS.image.link; /*C1*/
        document.getElementById("chan_image_link").innerHTML = imageTag
            +" alt='"+RSS.image.description
            +"' width='"+RSS.image.width
            +"' height='"+RSS.image.height
            +"' src='"+RSS.image.url
            +"' "+"/>"; /*C2*/
    }


    /*D*/
    document.getElementById("chan_items").innerHTML = "";
    for (var i=0; i<RSS.items.length; i++)
    {
        item_html = startItemTag;
        item_html += (RSS.items[i].title == null) ? "" : startTitle + RSS.items[i].title + endTag;
        item_html += (RSS.items[i].link == null) ? "" : startLink + RSS.items[i].link + endTag;
        item_html += (RSS.items[i].description == null) ? "" : startDescription + RSS.items[i].description + endTag;
        item_html += endTag;
        document.getElementById("chan_items").innerHTML += item_html; /*D1*/
    }

    return true;
}
