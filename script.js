function Torrent(e, t, r) {
    if (this.link = e,
    this.name = t,
    r)
        this.parseTrackers(),
        this.linkElement = document.createElement("dl"),
        this.linkElement.innerHTML = '<dt><a href="' + this.getMagnetURI() + '"><span class="u magnet" style="background-image:url(' + magnetLogoURL + ');">Magnet</span></a></dt>';
    else {
        var n = this;
        this.linkElement = document.createElement("span"),
        this.linkElement.setAttribute("class", "m");
        var a = document.createElement("a");
        a.setAttribute("href", this.getMagnetURI()),
        a.setAttribute("title", "Fetching trackers..."),
        a.setAttribute("class", "magnet"),
        a.innerHTML = '<img src="' + magnetLogoURL + '" />',
        a.addEventListener("mouseover", function() {
            n.trackers || (n.timeout = setTimeout(function() {
                n.getTrackers()
            }, 100))
        }),
        a.addEventListener("mouseout", function() {
            n.timeout && clearTimeout(n.timeout)
        }),
        this.linkElement.appendChild(a)
    }
}
var magnetLogoURL = chrome.extension.getURL("icon16.png");
Torrent.prototype = {
    getMagnetURI: function() {
        var e = this.trackers ? "&tr=" + this.trackers.join("&tr=") : "";
        return "magnet:?xt=urn:btih:" + this.getHash() + "&dn=" + encodeURI(this.name) + e
    },
    parseTrackers: function(e) {
        this.trackers = [];
        for (var t = e ? (new DOMParser).parseFromString(e, "text/html") : document, r = t.querySelectorAll(".trackers dl dt"), n = 0; n < r.length; n++)
            this.trackers.push(r[n].innerText)
    },
    getTrackers: function() {
        var e = this
          , t = new XMLHttpRequest;
        t.open("GET", this.link, !0),
        t.onload = function() {
            if (t.status >= 200 && t.status < 400) {
                e.parseTrackers(t.responseText);
                var r = e.linkElement.querySelector("a");
                r.setAttribute("href", e.getMagnetURI()),
                r.setAttribute("title", "Trackers added!"),
                r.style.opacity = 1
            }
        }
        ,
        t.send()
    },
    getHash: function() {
        return this.link.replace(/\//g, "")
    }
};
var pathName = location.pathname.replace(/\//g, "");
if (40 === pathName.length) {
    var name = document.querySelector(".download h2 span").innerHTML.replace(/<[^>]*>/g, "")
      , torrent = new Torrent(pathName,name,!0);
    document.querySelector(".download dl").insertAdjacentElement("afterend", torrent.linkElement)
} else if (pathName.match(/search/i))
    for (var searchItems = document.querySelectorAll(".results dl"), i = 0; i < searchItems.length; i++) {
        var currentItem = searchItems[i]
          , link = currentItem.querySelector("dt a")
          , torrent = new Torrent(link.getAttribute("href"),link.innerHTML.replace(/<[^>]*>/g, ""))
          , dd = currentItem.querySelector("dd");
        dd.insertBefore(torrent.linkElement, dd.firstChild),
        dd.style.width = parseInt(window.getComputedStyle(dd).width) + 50 + "px"
    }
