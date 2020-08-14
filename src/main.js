const searchEngineSelector = ".searchEngineList";
const searchEngineSelected = "searchEngineHighlighted";
const localStorageBookmarks = "compassMyBookmarks";

const defaultBookmarks = JSON.parse(localStorage.getItem(localStorageBookmarks)) ||
[
  {icon: 'B', url: 'https://www.behance.net/'},
  {icon: 'D', url: 'https://developer.mozilla.org/en-US/'}
];

const $searchEngineList = $(searchEngineSelector).find("li");

setSearchEngine(localStorage.getItem(searchEngineSelected) || "百度");
renderMyBookmarks();
renderBookmarks()

$searchEngineList.on("click", (e)=>{
  
  $searchEngineList.removeClass(searchEngineSelected);

  setSearchEngine(e.target.textContent);
});

$(".addIcon").on("click", (e) => {
  let newUrl = window.prompt("请输入您要添加的网址:");
  if (newUrl.indexOf('http') !== 0) {
    newUrl = 'https://' + newUrl
  }

  defaultBookmarks.push({
    icon: trimUrl(newUrl)[0].toUpperCase(),
    url: newUrl
  });
  
  localStorage.setItem(localStorageBookmarks, JSON.stringify(defaultBookmarks));

  renderMyBookmarks();
});

window.onbeforeunload = () => {
  localStorage.setItem(searchEngineSelected, $(`.${searchEngineSelected}`).text());
}

function trimUrl(url) {
  return url.replace(/^http(s)?:\/\/(www.)?/, "").replace(/\/.*/, "");
}

function renderMyBookmarks() {
  $(".myBookmarks ul").find("li:not(.addIcon)").remove();
  defaultBookmarks.forEach((item, index) => {
    const $li = $(`<li><div class="siteDiv">
        <div class="iconText">${item.icon}</div>
        <div class="siteUrl">${trimUrl(item.url)}</div>
        <div class="closeIcon"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="9.24084" y="28.8388" width="28" height="2" rx="1" transform="rotate(-45 9.24084 28.8388)" fill="#263238"/>
        <rect x="29.3933" y="30.6066" width="28" height="2" rx="1" transform="rotate(-135 29.3933 30.6066)" fill="#263238"/>
        </svg></div>
      </div></li>`).insertBefore($(".addIcon"));
    $li.on("click", ()=>{
      window.open(item.url, "_self");
    });
    $li.on("click", ".closeIcon", (e)=>{
      defaultBookmarks.splice(index, 1);
      localStorage.setItem(localStorageBookmarks, JSON.stringify(defaultBookmarks));
      e.stopPropagation();
      renderMyBookmarks();
    });
  });
}

function renderBookmarks() {
  const bookmarkFile = require("./resources/sites.json");
  $(".bookmarks").each((index, item)=>{
    const $bookmarkHeader = $(item).find("h3");
    const bookmarkList = bookmarkFile[$bookmarkHeader.text()];
    let insertAfterElem = $bookmarkHeader;
    bookmarkList.forEach((dataItem)=>{ 
      const $li = $(`<li class="bookmarks-${index}">
      <div class="bookmarkEntry">
        <img src="/resources/${dataItem.logo}}" alt="icon">
        <div>${dataItem.name}</div>
      </div></li>`);
      $li.on("click", ()=>{
        window.open(dataItem.url, "_self");
      });
      $li.insertAfter(insertAfterElem);
      insertAfterElem = $li;
    });
    $(`.bookmarks-${index}`).wrapAll("<ul></ul>");
  });
}


function setSearchEngine(searchEngine) {
  const searchFormParams = {
    "百度": { action: "//baidu.com/s", name: "wd", placeholder: "百度一下"},
    "谷歌": { action: "//google.com/search", name: "q", placeholder: "Google"},
    "必应": { action: "//bing.com/search", name: "q", placeholder: "Bing"}
  };

  $searchEngineList.each((i, item)=>{
    if (item.textContent === searchEngine) {
      $(item).addClass(searchEngineSelected);
    }
  });

  $(".searchForm").attr("action", searchFormParams[searchEngine].action)
  .find("input").attr("name", searchFormParams[searchEngine].name)
  .attr("placeholder", searchFormParams[searchEngine].placeholder);
}