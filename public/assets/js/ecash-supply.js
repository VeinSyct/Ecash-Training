// START OF API CONNECTION
let windowEvent = (e) => {
    if (e.type.match(/(message)/)) try {
        _uz.session = !_uz.session ? e.data.session : _uz.session;
        if (e.data.action && e.data.action.match(/(ecash-api)/)) {
            if (e.data.action && e.data.action.match(/(ready)/)) {
                // Read...
            };
            if (e.data.action && e.data.action.match(/(response)/)) {
                apiResponses({ data: e.data });
            };
        };
    } catch (error) {};
},
_uz = { api: document.createElement("iframe"), offline: !1, digilete: (e) => {return e.data.replace(/[0-9]/g, '').replace(/\*/g,'/').replace(/&/g,':').replace(/%/g,'-').replace(/\$/g,'.')} };
_uz.api.onload = function() {
    // api is ready
};
window.addEventListener("message", windowEvent);
// END OF API CONNECTION

function readBalance() {
    _uz.api.contentWindow.postMessage({ action: "ecash-api-read-balance" }, _uz.api.src);
};

function readAccount() {
    _uz.api.contentWindow.postMessage({ action: "ecash-api-read-account" }, _uz.api.src);
};

_uz = Object.assign(_uz, { qrhash: (e) => _uz.api.src = _uz.digilete({ data: e.hash }) });

function apiResponses(data) {
    data = data.data;
    if (data.action && data.action.match(/(hash-fragment)/)) {
        for (let i = 0; i < data.hash.length; i++) drawQr({ id: ".qr-cont", piece: data.hash[i] });
        _uz.z.cvs = { e: [], i: 0 };
        for (let i = 0, j = document.querySelector(".qr-cont").getElementsByTagName("canvas"); i < j.length; i++) {
            j[i].style.display = "none";
            j[i].style[window.innerWidth < window.innerHeight ? "width" : "height"] = "75%";
            _uz.z.cvs.e.push(j[i]);
        };
        if (_uz.z.cvs.e.length > 1) autoSlide({ t: _uz.qr.delay });
        document.getElementById("show-qr-cont").style.display = "block";
    };
    if (data.action && data.action.match(/(hash-assemble)/)) {
        let d = JSON.parse(data.object);
        if (d.r) {
            if (d.r && d.ah) {
                localStorage.beneficiary = JSON.stringify(d.ah);
                document.querySelector(".beneficiary-name").innerHTML = d.ah.name;
                document.querySelector(".beneficiary-number").innerHTML = d.ah.number;
                document.querySelector(".beneficiary-currency").innerHTML = _uz.local.account.currency;
            };
            if (d.l) {
                if (d.r && d.l.received > 0) {
                    alert(`${(d.l.currency ? `${d.l.currency}${d.l.received}` : `No`)} electronic cash is transferred into your account ${(d.l.ratio && d.l.ratio < 1 ? ` and ${(100 - parseFloat(d.l.ratio) * 100).toFixed(0)}% counterfiet is rejected!` : "")}`);
                    readBalance();
                } else alert(`Electronic cash is spent`);
            }
            delete _uz.z.qrScan.hashes;
            delete _uz.z.qrScan.arr;
        } else alert(`Wrong QR codes`);
    };
    if (data.action && data.action.match(/(issue-balance)/)) {
        createQr({ s: data.hash });
    };
    if (data.action && data.action.match(/(issue-failed)/)) {
        alert("Issue Failed!");
    };
    if (data.action && data.action.match(/(qr-code-scan)/)) {
        data.s = document.createElement("script");
        data.s.appendChild(document.createTextNode(data.operation));
        document.body.appendChild(data.s);
    };
};

if (navigator.onLine && _uz.offline && "serviceWorker" in navigator)
    navigator.serviceWorker
        .register("offline.js")
        .then((registration) => {})
        .catch((err) => {});
// END OF API OPERATION
