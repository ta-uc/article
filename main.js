const fs = require("fs");
const xml_parser = require('fast-xml-parser');
const fetch = require('node-fetch');
const Parser = require('rss-parser');
const { Readability } = require('@mozilla/readability');
const JSDOM = require('jsdom').JSDOM;
const rss_parser = new Parser();
const ui = require('./ui.js');

const selectedItem = {category:0, feed:0, itemList:[]};

const uiObjects = ui.createUi();

const readArticle = (url, area) => {
 fetch(url)
  .then(res => res.text())
  .then(body => {
    const doc = new JSDOM(body);
    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    area.setText(article.textContent);
    area.focus();
    uiObjects.screen.render();
  }) 
}

const parsed_xml = xml_parser.parse(
    fs.readFileSync(process.argv[2], "utf-8"), 
    { ignoreAttributes : false }
).opml.body.outline;


const rss_list = parsed_xml.map(categoryData => {
  if (Array.isArray(categoryData.outline)) {
    const feeds = categoryData.outline.map(feed => {
      return {
        title : feed['@_text'],
        url   : feed['@_xmlUrl']
      }
    });
    return {
      category : categoryData['@_text'],
      feeds    : feeds
    }  
  } else {
    return {
      category : categoryData['@_text'],
      feeds    : [{
        title : categoryData.outline['@_text'],
        url   : categoryData.outline['@_xmlUrl'] 
      }]
    }
  }
});


const loadFeedList = url => {
  selectedItem["itemList"] = []
  rss_parser.parseURL(url)
  .then(data => data.items)
  .then(items => {
          items.forEach(item => {
            selectedItem["itemList"].push({"title":item.title, "url":item.link})
            uiObjects.itemList.add(item.title);
          });
          uiObjects.screen.render();
        }
  )
}

rss_list.forEach(categoryItem => {
  uiObjects.categoryList.add(categoryItem.category);
  uiObjects.categoryList.focus();
  uiObjects.screen.render();
 });

uiObjects.categoryList.on("select", (ch, key) => {
  selectedItem["category"] = key;
  uiObjects.feedList.clearItems();
  rss_list[key].feeds.forEach(feed => {
    uiObjects.feedList.add(feed.title);
  })
  uiObjects.feedList.focus();
  uiObjects.screen.render();
});

uiObjects.feedList.on("select", (ch, key) => {
  selectedItem["feed"] = key;
  uiObjects.itemList.clearItems();
  loadFeedList(rss_list[selectedItem["category"]].feeds[key].url)
  uiObjects.itemList.focus();
  uiObjects.screen.render();
});

uiObjects.itemList.on("select", (ch, key) => {
  uiObjects.articleTextField.resetScroll();
  readArticle(selectedItem["itemList"][key]["url"], uiObjects.articleTextField);
});
