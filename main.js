const allMusicData_URL = "https://reiwa.f5.si/chunithm_record.json";
const profile_URLbase = "https://apiwrapper.qmc.workers.dev/?content=profile";
const userData_URLbase = "https://apiwrapper.qmc.workers.dev/?content=record";
const rights_URL = "https://reiwa.f5.si/chunithm_right.json";
var allMusicData;
var playerData;
var profile;
var setblockID = 0;
var rankColorset;

// ����A�S�Ă��i���Ă���_�炵��
var isAprilFool = false;

function elementChildRemoveAll(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function toggleAprilfool() {
    const button = document.getElementById("aprilfool_toggle");
    if (isAprilFool) {
        isAprilFool = false;
        button.style.background = "linear-gradient(135deg, #e60000, #f39800, #fff100, #009944, #0068b7, #1d2088, #920783)";
        button.innerText = "�G�C�v�����t�[�����[�h��ON�ɂ���";
    } else {
        isAprilFool = true;
        button.style.background = "#333";
        button.innerText = "�G�C�v�����t�[�����[�h��OFF�ɂ���";
    }
}

function copyBookmarklet() {
    if (!navigator.clipboard) {
        alert("�\���󂠂�܂��񂪁A���̃u���E�U�ł̓R�s�[�ł��܂���B");
        return;
    }
    const copyStr = `javascript:(function(){var e=document.createElement("script");e.src="https://reiwa.f5.si/chuni_scoredata/main.js?"+String(Math.floor((new Date).getTime()/1e3)),document.body.appendChild(e)})();`
    navigator.clipboard.writeText(copyStr);
    document.getElementById("bookmarklet").innerText = "Copied!";
    setTimeout(() => {
        document.getElementById("bookmarklet").innerText = "Copy Bookmarklet";
    }, 3000);
}


const constList = [15.4, 15.3, 15.2, 15.1, 15,
    14.9, 14.8, 14.7, 14.6, 14.5, 14.4, 14.3, 14.2, 14.1, 14,
    13.9, 13.8, 13.7, 13.6, 13.5, 13.4, 13.3, 13.2, 13.1, 13,
    12.9, 12.8, 12.7, 12.6, 12.5, 12.4, 12.3, 12.2, 12.1, 12,
    11.9, 11.8, 11.7, 11.6, 11.5, 11.4, 11.3, 11.2, 11.1, 11,
    10.9, 10.8, 10.7, 10.6, 10.5, 10.4, 10.3, 10.2, 10.1, 10,
    9.5, 9, 8.5, 8, 7.5, 7, 6, 5, 4, 3, 2, 1
];

// score����=rank ���[�U�[�Z�b�g�ǉ����ĕ��בւ�
const defaultColorSet = [
    {
        score: 0,
        color: "#888888",
        stroke: true,
        rank: "D",
        colorindex: 0
    },
    {
        score: 500000,
        color: "#b87333",
        stroke: false,
        rank: "C",
        colorindex: 1
    },
    {
        score: 600000,
        color: "#03b1fc",
        stroke: false,
        rank: "B",
        colorindex: 2
    },
    {
        score: 700000,
        color: "#03b1fc",
        stroke: false,
        rank: "BB",
        colorindex: 2
    },
    {
        score: 800000,
        color: "#03b1fc",
        stroke: false,
        rank: "BBB",
        colorindex: 2
    },
    {
        score: 900000,
        color: "#fcc203",
        stroke: false,
        rank: "A",
        colorindex: 3
    },
    {
        score: 925000,
        color: "#fcc203",
        stroke: false,
        rank: "AA",
        colorindex: 3
    },
    {
        score: 950000,
        color: "#fcc203",
        stroke: false,
        rank: "AAA",
        colorindex: 3
    },
    {
        score: 975000,
        color: "#fad148",
        stroke: false,
        rank: "S",
        colorindex: 4
    },
    {
        score: 990000,
        color: "#fad148",
        stroke: false,
        rank: "S+",
        colorindex: 4
    },
    {
        score: 1000000,
        color: "#fad148",
        stroke: false,
        rank: "SS",
        colorindex: 4
    },
    {
        score: 1005000,
        color: "#fad148",
        stroke: false,
        rank: "SS+",
        colorindex: 4
    },
    {
        score: 1007500,
        color: "#ffdf75",
        stroke: true,
        rank: "SSS",
        colorindex: 6
    },
    {
        score: 1009000,
        color: "#ffffff",
        stroke: false,
        rank: "SSS+",
        colorindex: 7
    },
    {
        score: 1010000,
        color: "#ff2222",
        stroke: true,
        rank: "MAX",
        colorindex: 8
    }
];

const colorStrokeOnlySet = [
    {
        color: "#888888",
        stroke: true,
    },
    {
        color: "#b87333",
        stroke: false,
    },
    {
        color: "#03b1fc",
        stroke: false,
    },
    {
        color: "#fcc203",
        stroke: false,
    },
    {
        color: "#fad148",
        stroke: false,
    },
    {
        color: "#ffdf75",
        stroke: false,
    },
    {
        color: "#ffdf75",
        stroke: true,
    },
    {
        color: "#ffffff",
        stroke: false,
    },
    {
        color: "#ff2222",
        stroke: true,
    }
];

// �K��profile�����Ɏ��s
async function isValid() {
    return profile.error === undefined;
}

function alertInvalid(errorCode, message) {
    switch (errorCode) {
        case 404:
            alert("�G���[���������܂����B���͂��ꂽ���[�U�[�l�[���ɊԈႢ���Ȃ����m�F���Ă��������B");
            break;
        case 429:
            alert("�A�N�Z�X�ߑ��ł��B15���قǑ҂��Ă��������x���������������B");
            break;
        case 403:
            if (message === "invalid token.") {
                alert("�G���[���������܂����B���͂��ꂽAPI�A�N�Z�X�g�[�N���ɊԈႢ���Ȃ����m�F���Ă��������B");
            } else {
                alert("�G���[���������܂����B���͂��ꂽ���[�U�[������J�ɂȂ��Ă��Ȃ����m�F���Ă��������B");
            }
            break;
        case 503:
            alert("�G���[���������܂����Bchunirec�������e�i���X���ŗ��p�s�\�ɂȂ��Ă���\��������܂��B");
            break;
        default:
            alert("�s���ȃG���[�ł��B��҂̃L���[�}���E�G�m�r�N�g�ɘA�������Ă���������Ə�����܂��B");
    }
}

async function refresh() {
    const chunirecUsername = document.getElementById("chunirec_username").value;
    const chunirecApiaccesstoken = document.getElementById("chunirec_apiaccesstoken").value;
    if (chunirecUsername === "") {
        alert("���[�U�[�l�[������͂��Ă��������I");
        return;
    }
    document.getElementById("loader").style.display = "block";
    saveSettings();
    saveColorset();
    await generateList();

    if (chunirecUsername !== localStorage.getItem("chunirec_username") ||
        chunirecApiaccesstoken !== localStorage.getItem("chunirec_apiaccesstoken") ||
        playerData === undefined) {
        // ���[�U�[�l�[���m�F(+�v���t�R�Â�)
        const nameval = chunirecUsername;
        const token = chunirecApiaccesstoken;
        const tokenString = token !== "" ? "&token=" + token : "";
        profile = await (await fetch(profile_URLbase + "&id=" + nameval + tokenString)).json();

        if (!await isValid()) {
            document.getElementById("loader").style.display = "none";
            alertInvalid(profile.error.code, profile.error.message);
            return;
        }

        localStorage.setItem("chunirec_username", chunirecUsername);
        localStorage.setItem("chunirec_apiaccesstoken", chunirecApiaccesstoken);

        // �v���C���[�f�[�^�擾
        const userUrl = userData_URLbase + "&id=" + localStorage.getItem("chunirec_username");
        const playerDataRaw = await (await fetch(userUrl)).json();
        playerData = playerDataRaw.records; // �f�[�^�R�Â�
        playerData.sort(function (a, b) {
            if (a.const < b.const) return 1;
            if (a.const > b.const) return -1;
            return 0;
        });
    }
    applyData();

    document.getElementById("loader").style.display = "none";
}

async function generateRights() {
    const rightdiv = document.getElementById("copyright");
    const rights = await (await fetch(rights_URL)).json();
    for (let i = 0; i < rights.length; i++) {
        let p = rightdiv.appendChild(document.createElement("p"));
        p.innerText = rights[i].replaceAll("<br>", "\n");
    }
}

window.addEventListener('DOMContentLoaded', async function () {
    document.getElementById("loader").style.display = "block";

    loadColorset();
    loadSettings();

    if (document.getElementById("myrate").checked) document.getElementById("myratesetting").style.display = "block";

    // �萔�\����
    allMusicData = await (await fetch(allMusicData_URL)).json();
    await generateList();

    // ���쌠���X�g����
    generateRights();

    const chunirecUsernameElement = document.getElementById("chunirec_username");
    const chunirecApiaccesstokenElement = document.getElementById("chunirec_apiaccesstoken");

    // ���[�U�[�l�[���E�A�N�Z�X�g�[�N���ǂݍ���
    if (localStorage.getItem("chunirec_username") !== null) chunirecUsernameElement.value = localStorage.getItem("chunirec_username");
    if (localStorage.getItem("chunirec_apiaccesstoken") !== null) chunirecApiaccesstokenElement.value = localStorage.getItem("chunirec_apiaccesstoken");

    // �󗓂Ȃ�Stop
    if (chunirecUsernameElement.value === "") {
        document.getElementById("loader").style.display = "none";
        return;
    }

    // ���[�U�[�l�[���m�F(+�v���t�R�Â�)
    const nameval = chunirecUsernameElement.value;
    profile = await (await fetch(profile_URLbase + "&id=" + nameval)).json();

    if (!await isValid()) {
        document.getElementById("loader").style.display = "none";
        alertInvalid(profile.error.code);
        return;
    }

    localStorage.setItem("chunirec_username", chunirecUsernameElement.value);

    // �v���C���[�f�[�^�擾
    const userUrl = userData_URLbase + "&id=" + localStorage.getItem("chunirec_username");
    const playerDataRaw = await (await fetch(userUrl)).json();
    playerData = playerDataRaw.records; // �f�[�^�R�Â�
    playerData.sort(function (a, b) {
        if (a.const < b.const) return 1;
        if (a.const > b.const) return -1;
        return 0;
    });

    applyData();

    document.getElementById("loader").style.display = "none";
});

// �萔�\����
async function generateList() {
    const low = Number(document.getElementById("lvrange_low").value);
    const high = Number(document.getElementById("lvrange_high").value);

    const constlistC = constList.slice(high, low + 1);

    allMusicData.sort(function (a, b) {
        if (a.const < b.const) return 1;
        if (a.const > b.const) return -1;
        if (a.release > b.release) return 1;
        if (a.release < b.release) return -1;
        return 0;
    });

    const dispult = document.getElementById("dispult").checked;
    const dispmas = document.getElementById("dispmas").checked;
    const dispexp = document.getElementById("dispexp").checked;
    const dispadv = document.getElementById("dispadv").checked;
    const dispbas = document.getElementById("dispbas").checked;

    const disp_popani = document.getElementById("disp_popani").checked;
    const disp_niconico = document.getElementById("disp_niconico").checked;
    const disp_touhou = document.getElementById("disp_touhou").checked;
    const disp_variety = document.getElementById("disp_variety").checked;
    const disp_irodori = document.getElementById("disp_irodori").checked;
    const disp_gekimai = document.getElementById("disp_gekimai").checked;
    const disp_original = document.getElementById("disp_original").checked;

    const outfield = document.getElementById("outfield");

    elementChildRemoveAll(outfield);

    if (isAprilFool) {
        outfield.style.background = "linear-gradient(135deg, #e60000, #f39800, #fff100, #009944, #0068b7, #1d2088, #920783)";
    } else {
        outfield.style.background = "rgb(255, 238, 252);";
    }

    let m = 0;
    for (let i = 0; i < constList.length; i++) {
        let constval = constList[i].toFixed(1);

        // ���x���u���b�N
        let levblock = outfield.appendChild(document.createElement("div"));
        levblock.className = "levblock";
        levblock.id = constval;

        let constdisp = levblock.appendChild(document.createElement("div"));
        constdisp.className = "items";
        constdisp.id = constval + "first";
        let inside = constdisp.appendChild(document.createElement("div"));
        inside.className = "levconst";
        inside.innerText = constval;

        if (isAprilFool) inside.contentEditable = true;

        // levblock �萔ID
        while (allMusicData[m] !== undefined && allMusicData[m].const === constList[i]) {
            let diff = allMusicData[m].diff.toLowerCase();
            let genre = allMusicData[m].genre;
            if (
                (
                    (diff === "ult" && dispult) ||
                    (diff === "mas" && dispmas) ||
                    (diff === "exp" && dispexp) ||
                    (diff === "adv" && dispadv) ||
                    (diff === "bas" && dispbas)
                ) &&
                (
                    (genre === "POPS&ANIME" && disp_popani) ||
                    (genre === "niconico" && disp_niconico) ||
                    (genre === "����Project" && disp_touhou) ||
                    (genre === "VARIETY" && disp_variety) ||
                    (genre === "�C���h���~�h��" && disp_irodori) ||
                    (genre === "�Q�L�}�C" && disp_gekimai) ||
                    (genre === "ORIGINAL" && disp_original)
                )
            ) {
                // �W����������
                let title = allMusicData[m].title;
                let artist = allMusicData[m].artist;
                let notes = allMusicData[m].notes;

                let item = levblock.appendChild(document.createElement("div"));
                item.className = "items";
                let datatxt = ("0000" + String(notes)).slice(-4) + title + diff + constval;
                item.setAttribute("data-spc", datatxt);
                item.setAttribute("data-score", "0");
                item.id = datatxt;
                item.draggable = true;

                if (isAprilFool) {
                    // D&D����
                    item.ondragstart = (e) => e.dataTransfer.setData("text/plain", e.target.id);
                    item.ondragover = function (e) {
                        e.preventDefault();
                        let rect = this.getBoundingClientRect();
                        this.style.boxSizing = "border-box";
                        if ((e.clientX - rect.left) < (this.clientWidth / 2)) {
                            this.style.borderLeft = "4px solid blue";
                            this.style.borderRight = "";
                        } else {
                            this.style.borderLeft = "";
                            this.style.borderRight = "4px solid blue";
                        }
                    };
                    item.ondragleave = function () {
                        this.style.borderLeft = "";
                        this.style.borderRight = "";
                        this.style.boxSizing = "content-box";
                    };
                    item.ondrop = function (e) {
                        e.preventDefault();
                        let id = e.dataTransfer.getData("text/plain");
                        let elm_drag = document.getElementById(id);

                        let rect = this.getBoundingClientRect();
                        if ((e.clientX - rect.left) < (this.clientWidth / 2)) {
                            this.parentNode.insertBefore(elm_drag, this);
                        } else {
                            this.parentNode.insertBefore(elm_drag, this.nextSibling);
                        }
                        this.style.borderLeft = "";
                        this.style.borderRight = "";
                        this.style.boxSizing = "content-box";
                    };
                }

                if (diff === "ult") {
                    let bg = item.appendChild(document.createElement("div"));
                    bg.className = "back";
                    let bgimg = bg.appendChild(document.createElement("img"));
                    bgimg.src = "ultima.png";
                }

                let img = item.appendChild(document.createElement("img"));
                if (document.getElementById("copyrightmode").checked) {
                    img.src = "ban.png";
                } else {
                    img.src = "https://reiwa.f5.si/musicjackets/chunithm/" + md5(title + artist) + ".webp";
                }
                img.title = title;
                img.alt = title;
                img.draggable = false;
                img.className = diff.toLowerCase();

                // �^�C�g���u���b�N�\��
                if (document.getElementById("titledisp").checked) {
                    let titleblock = item.appendChild(document.createElement("div"));
                    titleblock.className = "titleblock";
                    titleblock.innerText = title;
                }

                // �萔�s���}�[�J�[����(��\���͂��łɏ�ł���Ă���̂�OK)
                if (allMusicData[m].unknown && allMusicData[m].const >= 10) {
                    let unknownMarkerWrapper = item.appendChild(document.createElement("div"));
                    unknownMarkerWrapper.className = "markerwrapper";
                    let unknownMarker = unknownMarkerWrapper.appendChild(document.createElement("div"));
                    unknownMarker.className = "unknown";
                    let unknownMarkerQuestion = unknownMarker.appendChild(document.createElement("div"));
                    unknownMarkerQuestion.className = "uq";
                    unknownMarkerQuestion.innerText = "�H";
                }

                let datadisp = item.appendChild(document.createElement("div"));
                datadisp.className = "datadisp";
                item.style.fontSize = "2.2rem";
                if (isAprilFool) {
                    datadisp.contentEditable = true;

                    // �f�t�H���g
                    item.setAttribute("data-fontsize", "22");
                    datadisp.style.color = "#ffdf75";
                    datadisp.style.fontFamily = "'Fugaz One', cursive";
                }
            }

            m++;
        }

        // item����1�Ȃ�Ȃ��Ȃ�
        if (levblock.childElementCount === 1) levblock.style.display = "none";

        if (!constlistC.includes(constList[i])) levblock.style.display = "none";

        // �s���ߗp�̍����������Ȃ��t�B���[
        for (let f = 0; f < 8; f++) {
            let item = levblock.appendChild(document.createElement("div"));
            item.className = "fakeitem";
        }
    }
}

// �f�[�^�K�p
async function applyData() {
    // �}�C�萔�\�^�C�g��
    const title = outfield.insertBefore(document.createElement("h2"), outfield.firstChild);
    title.innerText = profile.player_name + "�̃}�C�萔�\";

    // �K�p����
    const markMusicCondition = document.getElementsByName("condition"); // [0]�����N [1]�A�`�[�u [2]�X�R�A
    const dispMusicCondition = document.getElementsByName("conditiondisp"); // [0]�����N [1]�A�`�[�u [2]�X�R�A
    const dispContentCondition = document.getElementsByName("display"); // [0]�����N [1]�A�`�[�u [2]�X�R�A [3] �{�[�_�[

    if (document.getElementById("conddispblock").checked) {
        // �K�p�����u���b�N
        const applyerBlock = outfield.insertBefore(document.createElement("div"), title.nextSibling);
        applyerBlock.className = "applyerBlock";
        const applyMarkMusicCondPgh = applyerBlock.appendChild(document.createElement("p"));
        const applyDispMusicCondPgh = applyerBlock.appendChild(document.createElement("p"));
        const applyDispContentPgh = applyerBlock.appendChild(document.createElement("p"));

        // �}�[�N����
        const applyMarkMusicCond = document.getElementsByName("condition");
        let achieveMark, doneMark;
        if (applyMarkMusicCond[0].checked) {
            let am_obj = document.getElementById("rankselect");
            let am_idx = am_obj.selectedIndex;
            achieveMark = "�����N" + am_obj.options[am_idx].text;
            let dm_obj = document.getElementById("rank_doneornot");
            let dm_idx = dm_obj.selectedIndex;
            doneMark = dm_obj.options[dm_idx].text;
        } else if (applyMarkMusicCond[1].checked) {
            let am_obj = document.getElementById("achieveselect");
            let am_idx = am_obj.selectedIndex;
            achieveMark = am_obj.options[am_idx].text;
            let dm_obj = document.getElementById("achieve_doneornot");
            let dm_idx = dm_obj.selectedIndex;
            doneMark = dm_obj.options[dm_idx].text;
        } else if (applyMarkMusicCond[2].checked) {
            let am_obj = document.getElementById("scoreselect");
            achieveMark = Number(am_obj.value).toLocaleString() + "�_";
            let dm_obj = document.getElementById("score_doneornot");
            let dm_idx = dm_obj.selectedIndex;
            doneMark = dm_obj.options[dm_idx].text;
        }
        applyMarkMusicCondPgh.innerText = "�}�[�N����: " + achieveMark +
            "��B��" + doneMark +
            "�y�Ȃ��}�[�N����";

        // �\������
        const applyDispMusicCond = document.getElementsByName("conditiondisp");
        let achieveCondsDisp, doneCondsDisp;
        if (applyDispMusicCond[0].checked) {
            let am_obj = document.getElementById("rankdispselect");
            let am_idx = am_obj.selectedIndex;
            achieveCondsDisp = "�����N" + am_obj.options[am_idx].text;
            let dm_obj = document.getElementById("rankdisp_doneornot");
            let dm_idx = dm_obj.selectedIndex;
            doneCondsDisp = dm_obj.options[dm_idx].text;
        } else if (applyDispMusicCond[1].checked) {
            let am_obj = document.getElementById("achieveselectdisp");
            let am_idx = am_obj.selectedIndex;
            achieveCondsDisp = am_obj.options[am_idx].text;
            let dm_obj = document.getElementById("achievedisp_doneornot");
            let dm_idx = dm_obj.selectedIndex;
            doneCondsDisp = dm_obj.options[dm_idx].text;
        } else if (applyDispMusicCond[2].checked) {
            let am_obj = document.getElementById("scoreselectdisp");
            achieveCondsDisp = Number(am_obj.value).toLocaleString() + "�_";
            let dm_obj = document.getElementById("scoredisp_doneornot");
            let dm_idx = dm_obj.selectedIndex;
            doneCondsDisp = dm_obj.options[dm_idx].text;
        }
        applyDispMusicCondPgh.innerText = "�\������: " + achieveCondsDisp +
            "��B��" + doneCondsDisp +
            "�y�Ȃ�\������";

        // �\�����e
        const applyDispContent = document.getElementsByName("display");
        let dispbasis;
        if (applyDispContent[0].checked) {
            dispbasis = document.getElementById("disprank").parentNode.textContent;
        } else if (applyDispContent[1].checked) {
            dispbasis = document.getElementById("dispachieve").parentNode.textContent;
        } else if (applyDispContent[2].checked) {
            dispbasis = document.getElementById("dispscore").parentNode.textContent;
        } else if (applyDispContent[3].checked) {
            let rankObj = document.getElementById("borderselect");
            let rankIdx = rankObj.selectedIndex;
            dispbasis = "�����N" + rankObj.options[rankIdx].text + "����ɕ\��";
        }
        applyDispContentPgh.innerText = "�\�����e: " + dispbasis + "����";
    }

    // �K�p����
    const levblocks = document.getElementsByClassName("levblock");

    const colorsets = document.getElementById("myrateSets").children;
    let savingData = [];
    let savingData_scores = [];
    for (let i = 0; i < colorsets.length; i++) {
        let scoreset = Number(colorsets[i].getElementsByClassName("scoreinput")[0].value);
        let colorset = colorsets[i].getElementsByClassName("colorinput")[0].value;
        let strokeset = colorsets[i].getElementsByClassName("strokeinput")[0].checked;
        savingData.push({
            score: scoreset,
            color: colorset,
            stroke: strokeset,
            rank: ""
        });
        savingData_scores.push(scoreset);
    }

    rankColorset = undefined;

    if (document.getElementById("myrate").checked) {
        let remainingScoreset = [];
        for (let i = 0; i < defaultColorSet.length; i++) {
            if (!savingData_scores.includes(defaultColorSet[i].score)) {
                remainingScoreset.push(defaultColorSet[i]);
            }
        }
        rankColorset = savingData.concat(remainingScoreset);
    } else {
        rankColorset = defaultColorSet;
    }

    rankColorset.sort(function (a, b) {
        if (a.score < b.score) return -1;
        if (a.score > b.score) return 1;
        return 0;
    });

    for (let i = 0; i < levblocks.length; i++) {
        let block = levblocks[i].getElementsByClassName("items");
        let blockConst = constList[i];
        for (let j = 0; j < block.length; j++) {
            if (block[j].id === blockConst.toFixed(1) + "first") continue;

            let dfdata = block[j].getAttribute("data-spc");

            let score, pd, isAJ, isFC, notes;
            let b = block[j];
            let datadisp = b.getElementsByClassName("datadisp")[0];
            let existFlag = false;
            for (let k = 0; k < playerData.length; k++) {
                let temp_pd = playerData[k];
                if (temp_pd.title + temp_pd.diff.toLowerCase() + temp_pd.const.toFixed(1) === dfdata.slice(4)) {
                    // console.log(`${temp_pd.title} ${temp_pd.diff}`)
                    score = temp_pd.score;
                    pd = playerData[k];
                    isAJ = pd.is_alljustice;
                    isFC = pd.is_fullcombo;
                    existFlag = true;
                    break;
                } else {
                    score = 0;
                }
                notes = Number(dfdata.slice(0, 4));
            }
            if (document.getElementById("noplay").checked) {
                if (!existFlag) b.style.display = "none";
            }

            b.setAttribute("data-score", String(score));

            let color;
            let scorerate = "D";
            let stroke = false;

            for (let cst = 0; cst < rankColorset.length; cst++) {
                let s = rankColorset[cst];
                if (s.score <= score) {
                    color = s.color;
                    stroke = s.stroke;
                    b.setAttribute("data-colorindex", String(s.colorindex));
                } else {
                    break;
                }
            }

            for (let srank = 0; srank < defaultColorSet.length; srank++) {
                if (score < defaultColorSet[srank].score) break;
                scorerate = defaultColorSet[srank].rank;
            }

            // 1�����`�F�b�N
            let oneotiflag = false;
            if (notes !== 0) {
                // 1�����v�Z
                let per1noteScore = max / notes / 101;
                if (score === Math.floor(max - per1noteScore)) oneotiflag = true;
            }

            if (document.getElementById("oneoti").checked && oneotiflag) {
                color = "#ff5e00";
                stroke = true;
            }

            b.setAttribute("data-markstatus", "0");
            if (document.getElementById("marker_fc").checked) {
                // FC�}�[�J�[����
                if (isFC && !isAJ) {
                    let FCMarkerWrapper = b.appendChild(document.createElement("div"));
                    FCMarkerWrapper.className = "markerwrapper_right_1";
                    let FCMarker = FCMarkerWrapper.appendChild(document.createElement("div"));
                    FCMarker.className = "fullcombo";
                    b.setAttribute("data-markstatus", "1");
                }
            }
            if (document.getElementById("marker_aj").checked) {
                // AJ�}�[�J�[����
                if (isAJ) {
                    let AJMarkerWrapper = b.appendChild(document.createElement("div"));
                    AJMarkerWrapper.className = "markerwrapper_right_1";
                    let AJMarker = AJMarkerWrapper.appendChild(document.createElement("div"));
                    AJMarker.className = "alljustice";
                    b.setAttribute("data-markstatus", "2");
                }
            }

            let mark = false;
            let oneotiSelect = false;

            // �}�[�N�����ݒ�
            // ��������: [0]�����N [1]�A�`�[�u [2]�X�R�A
            if (markMusicCondition[0].checked) {
                let rankselect = Number(document.getElementById("rankselect").value);
                if (rankselect === 1009999) { // 1��������
                    oneotiSelect = true;
                    // 1�����`�F�b�N
                    if (oneotiflag) rankselect = score;
                }
                let docond = document.getElementById("rank_doneornot").value;
                if ((docond === "done" && score >= rankselect) || (docond === "notyet" && score < rankselect)) mark = true;
            } else if (markMusicCondition[1].checked) {
                let achieve = document.getElementById("achieveselect").value;
                let docond = document.getElementById("achieve_doneornot").value;
                if (achieve === "AJ") { // AJ�̏ꍇ
                    if ((docond === "done" && isAJ) || (docond === "notyet" && !isAJ)) mark = true;
                } else if (achieve === "FC") {
                    if ((docond === "done" && (isAJ || isFC)) || (docond === "notyet" && (!isAJ && !isFC))) mark = true;
                }
            } else if (markMusicCondition[2].checked) {
                let border = Number(document.getElementById("scoreselect").value);
                let docond = document.getElementById("score_doneornot").value;
                if ((docond === "done" && score >= border) || (docond === "notyet" && score < border)) mark = true;
            }

            datadisp.innerText = "";
            let image = b.getElementsByTagName("img")[0];
            let realmark = false;

            if (mark) {
                // �\�����e�ݒ�
                // ��������: [0]�����N [1]�A�`�[�u [2]�X�R�A [3]���L [4]�{�[�_�[
                // �t�H���g�T�C�Y��CSS�ŊǗ����ׂ��H
                // image.style.opacity���Ȃ�Ƃ���������AJ/FC���ƃ}�[�N���邩�ۂ��̏���������Ȃ̂ŁA�炢
                if (dispContentCondition[0].checked) { // �����N
                    image.style.opacity = "0.5";
                    if (dfdata.slice(-7, -4) === "ult") b.getElementsByClassName("ult")[0].style.opacity = "0.5";
                    datadisp.innerText = scorerate;
                    datadisp.style.color = color;
                    b.style.fontSize = "2.2rem";
                    if (stroke) datadisp.style.webkitTextStroke = `1.5px #fff`;
                    if (document.getElementById("nomax").checked && oneotiSelect && score === 1010000) b.style.display = "none";
                    b.setAttribute("data-fontsize", "22");
                    realmark = true;
                } else if (dispContentCondition[1].checked) { // �A�`�[�u
                    if (isAJ || isFC) {
                        image.style.opacity = "0.5";
                        if (dfdata.slice(-7, -4) === "ult") b.getElementsByClassName("ult")[0].style.opacity = "0.5";
                        realmark = true;
                    }
                    if (isAJ) {
                        datadisp.innerText = "AJ";
                        datadisp.style.color = "#ffdf75";
                        b.setAttribute("data-colorindex", "5");
                    } else if (isFC) {
                        datadisp.innerText = "FC";
                        datadisp.style.color = "#fcc203";
                        b.setAttribute("data-colorindex", "3");
                    }
                    b.style.fontSize = "3rem";
                    if (document.getElementById("nomax").checked && oneotiSelect && score === 1010000) b.style.display = "none";
                    b.setAttribute("data-fontsize", "30");
                } else if (dispContentCondition[2].checked) { // �X�R�A
                    image.style.opacity = "0.5";
                    if (dfdata.slice(-7, -4) === "ult") b.getElementsByClassName("ult")[0].style.opacity = "0.5";
                    let scoreDisplay, regFontsizeValue;
                    if (score >= 1000000 && score < 1010000) {
                        if (document.getElementById("oneoti").checked && oneotiflag) {
                            color = "#ff5e00";
                            stroke = true;
                        }
                        if (document.getElementById("scorecut").checked) {
                            scoreDisplay = "'" + String(score).slice(3);
                            b.style.fontSize = "2.2rem";
                            regFontsizeValue = "22";
                        } else {
                            scoreDisplay = score;
                            b.style.fontSize = "1.45rem";
                            regFontsizeValue = "16";
                        }
                        if (stroke) datadisp.style.webkitTextStroke = `1.5px #fff`;
                    } else if (score === 1010000) {
                        if (document.getElementById("nomax").checked && oneotiSelect) {
                            b.style.display = "none";
                        } else {
                            scoreDisplay = "MAX";
                            b.style.fontSize = "2.2rem";
                            regFontsizeValue = "22";
                            if (stroke) datadisp.style.webkitTextStroke = `1.5px #fff`;
                        }
                    } else {
                        scoreDisplay = score;
                        b.style.fontSize = "1.6rem";
                        regFontsizeValue = "16";
                        if (stroke) datadisp.style.webkitTextStroke = `1.5px #fff`;
                    }
                    datadisp.innerText = scoreDisplay;
                    datadisp.style.color = color;
                    b.setAttribute("data-fontsize", regFontsizeValue);
                    realmark = true;
                } else if (dispContentCondition[3].checked) { // ���L
                    image.style.opacity = "0.5";
                    if (dfdata.slice(-7, -4) === "ult") b.getElementsByClassName("ult")[0].style.opacity = "0.5";
                    b.style.fontSize = "1.8rem";
                    b.setAttribute("data-fontsize", "18");

                    let rankDisplayDiv = datadisp.appendChild(document.createElement("div"));
                    rankDisplayDiv.className = "rankDisplay";
                    rankDisplayDiv.innerText = scorerate;
                    rankDisplayDiv.style.fontSize = "1em";

                    let scoreDisplay;
                    let scoreDisplayDiv = datadisp.appendChild(document.createElement("div"));
                    scoreDisplayDiv.className = "scoreDisplay";
                    scoreDisplayDiv.style.fontSize = "1em";

                    if (score >= 1000000 && score < 1010000) {
                        if (document.getElementById("oneoti").checked && oneotiflag) {
                            color = "#ff5e00";
                            stroke = true;
                        }
                        if (document.getElementById("scorecut").checked) {
                            scoreDisplay = "'" + String(score).slice(3);
                        } else {
                            scoreDisplay = score;
                            scoreDisplayDiv.style.fontSize = "0.8em";
                        }
                    } else if (score === 1010000) {
                        if (document.getElementById("nomax").checked && oneotiSelect) {
                            b.style.display = "none";
                        } else {
                            scoreDisplay = "";
                        }
                    } else {
                        scoreDisplay = score;
                        scoreDisplayDiv.style.fontSize = "0.8em";
                    }

                    scoreDisplayDiv.innerText = scoreDisplay;
                    datadisp.style.color = color;

                    if (stroke) datadisp.style.webkitTextStroke = `1.5px #fff`;
                    if (document.getElementById("nomax").checked && oneotiSelect && score === 1010000) b.style.display = "none";

                    realmark = true;
                } else if (dispContentCondition[4].checked) { // �{�[�_�[
                    image.style.opacity = "0.5";
                    if (dfdata.slice(-7, -4) === "ult") b.getElementsByClassName("ult")[0].style.opacity = "0.5";
                    let borderBasis = Number(document.getElementById("borderselect").value);
                    let diffDisplay;
                    if (score === borderBasis) {
                        diffDisplay = "0";
                    } else if (score > borderBasis) {
                        diffDisplay = "+" + String(score - borderBasis);
                    } else {
                        diffDisplay = "-" + String(borderBasis - score);
                    }
                    if (stroke) datadisp.style.webkitTextStroke = `1.5px #fff`;
                    b.style.fontSize = String(Math.abs(score - borderBasis)).length >= 5 ? "1.4rem" : "2rem"; // 5���ȏ�Ȃ當��������
                    datadisp.innerText = diffDisplay;
                    datadisp.style.color = color;
                    if (document.getElementById("nomax").checked && oneotiSelect && score === 1010000) b.style.display = "none";
                    b.setAttribute("data-fontsize", String(Math.abs(score - borderBasis)).length >= 5 ? "14" : "20");
                    realmark = true;
                }
            } else {
                // �f�t�H���g
                b.setAttribute("data-colorindex", "6");
                b.style.fontSize = "2.2rem";
                b.setAttribute("data-fontsize", "22");
                datadisp.style.color = "#ffdf75";
                datadisp.style.fontFamily = "'Fugaz One', 'Dela Gothic One', cursive";
                datadisp.style.whiteSpace = "nowrap";
                datadisp.style.display = "none";
                datadisp.style.webkitTextStroke = "1.5px #fff";
            }

            // �\�������ݒ�
            // ��������: [0]�����N [1]�A�`�[�u [2]�X�R�A
            if (dispMusicCondition[0].checked) {
                let rankselect = Number(document.getElementById("rankdispselect").value);
                if (rankselect === 1009999) { // 1��������
                    oneotiSelect = true;
                    // 1�����`�F�b�N
                    if (oneotiflag) rankselect = score;
                }
                let docond = document.getElementById("rankdisp_doneornot").value;
                if ((docond === "done" && score < rankselect) || (docond === "notyet" && score >= rankselect)) b.style.display = "none";
            } else if (dispMusicCondition[1].checked) {
                let achieve = document.getElementById("achieveselectdisp").value;
                let docond = document.getElementById("achievedisp_doneornot").value;
                if (achieve === "AJ") { // AJ�̏ꍇ
                    if ((docond === "done" && !isAJ) || (docond === "notyet" && isAJ)) b.style.display = "none";
                } else if (achieve === "FC") {
                    if ((docond === "done" && (!isAJ && !isFC)) || (docond === "notyet" && (isAJ || isFC))) b.style.display = "none";
                }
            } else if (dispMusicCondition[2].checked) {
                let border = Number(document.getElementById("scoreselectdisp").value);
                let docond = document.getElementById("scoredisp_doneornot").value;
                if ((docond === "done" && score < border) || (docond === "notyet" && score >= border)) b.style.display = "none";
            }

            if (isAprilFool) {
                // �폜�{�^������
                let removeButton = b.appendChild(document.createElement("button"));
                removeButton.className = "overlay-btn-base remove-music";
                removeButton.title = "�y�Ȃ��폜����";
                removeButton.addEventListener("click", function () {
                    document.getElementById(dfdata).remove();
                });

                // �}�[�N�ϔ���p����
                b.setAttribute("data-ismarked", realmark ? "yes" : "no");

                // �}�[�N�{�^������
                let markButton = b.appendChild(document.createElement("button"));
                markButton.className = "overlay-btn-base mark-music";
                markButton.title = "�}�[�N��Ԃ�؂�ւ���";
                markButton.addEventListener("click", function () {
                    const music = document.getElementById(dfdata);
                    const isMarked = music.getAttribute("data-ismarked") === "yes" ? true : false;
                    const image = music.getElementsByTagName("img")[0];
                    const datadisp = music.getElementsByClassName("datadisp")[0];
                    if (isMarked) {
                        image.style.opacity = "1";
                        if (dfdata.slice(-7, -4) === "ult") music.getElementsByClassName("ult")[0].style.opacity = "1";
                        datadisp.style.display = "none";
                        music.setAttribute("data-ismarked", "no");
                    } else {
                        image.style.opacity = "0.5";
                        if (dfdata.slice(-7, -4) === "ult") music.getElementsByClassName("ult")[0].style.opacity = "0.5";
                        datadisp.style.display = "block";
                        music.setAttribute("data-ismarked", "yes");
                    }
                });

                // �t�H���g�T�C�Y�{�^������
                let fontLargerButton = b.appendChild(document.createElement("button"));
                fontLargerButton.className = "overlay-btn-base edit-font-larger";
                fontLargerButton.title = "�t�H���g�T�C�Y���グ��";
                fontLargerButton.addEventListener("click", function () {
                    const fontsizeValue = Number(b.getAttribute("data-fontsize")) + 2;
                    b.style.fontSize = String(fontsizeValue / 10) + "rem";
                    b.setAttribute("data-fontsize", String(fontsizeValue));
                });

                let fontSmallerButton = b.appendChild(document.createElement("button"));
                fontSmallerButton.className = "overlay-btn-base edit-font-smaller";
                fontSmallerButton.title = "�t�H���g�T�C�Y��������";
                fontSmallerButton.addEventListener("click", function () {
                    const fontsizeValue = Math.max(Number(b.getAttribute("data-fontsize")) - 2, 2);
                    b.style.fontSize = String(fontsizeValue / 10) + "rem";
                    b.setAttribute("data-fontsize", String(fontsizeValue));
                });

                // �����N�㉺�{�^������
                let rankPlusButton = b.appendChild(document.createElement("button"));
                rankPlusButton.className = "overlay-btn-base edit-rank-plus";
                rankPlusButton.title = "�����J���[�̃����N���グ��";
                rankPlusButton.addEventListener("click", function () {
                    const rankColorIndex = Math.min(Number(b.getAttribute("data-colorindex")) + 1, 8);
                    const colorset = colorStrokeOnlySet[rankColorIndex];
                    datadisp.style.color = colorset.color;
                    datadisp.style.webkitTextStroke = colorset.stroke ? "1.5px #fff" : "unset";
                    b.setAttribute("data-colorindex", String(rankColorIndex));
                });

                let rankMinusButton = b.appendChild(document.createElement("button"));
                rankMinusButton.className = "overlay-btn-base edit-rank-minus";
                rankMinusButton.title = "�����J���[�̃����N��������";
                rankMinusButton.addEventListener("click", function () {
                    const rankColorIndex = Math.max(Number(b.getAttribute("data-colorindex")) - 1, 0);
                    const colorset = colorStrokeOnlySet[rankColorIndex];
                    datadisp.style.color = colorset.color;
                    datadisp.style.webkitTextStroke = colorset.stroke ? "1.5px #fff" : "unset";
                    b.setAttribute("data-colorindex", String(rankColorIndex));
                });

                // �}�[�N����
                let markChangeButton = b.appendChild(document.createElement("button"));
                markChangeButton.className = "overlay-btn-base edit-mark-change";
                markChangeButton.title = "AJ/FC�}�[�J�[�̏�Ԃ�؂�ւ���";
                markChangeButton.addEventListener("click", function () {
                    const markerState = b.getAttribute("data-markstatus");
                    switch (markerState) {
                        case "0":
                            let FCMarkerWrapper = b.appendChild(document.createElement("div"));
                            FCMarkerWrapper.className = "markerwrapper_right_1";
                            let FCMarker = FCMarkerWrapper.appendChild(document.createElement("div"));
                            FCMarker.className = "fullcombo";
                            b.setAttribute("data-markstatus", "1");
                            break;
                        case "1":
                            let AJMarkerWrapper = b.getElementsByClassName("markerwrapper_right_1")[0];
                            let AJMarker = AJMarkerWrapper.getElementsByClassName("fullcombo")[0];
                            AJMarker.className = "alljustice";
                            b.setAttribute("data-markstatus", "2");
                            break;
                        case "2":
                            let markerWrapper = b.getElementsByClassName("markerwrapper_right_1")[0];
                            markerWrapper.remove();
                            b.setAttribute("data-markstatus", "0");
                    }
                });
            }
        }
        let remain = levblocks[i].children;
        let showflag = false;
        for (let ch = 1; ch < remain.length; ch++) {
            if (remain[ch].className === "items" && remain[ch].style.display !== "none") {
                showflag = true;
                break;
            }
        }
        if (!showflag) levblocks[i].style.display = "none";

        // �\�[�g
        if (showflag) {
            let blockParent = levblocks[i];
            let cList = Array.from(block).slice(1); // 1�ڂ͒萔�\���Ȃ̂ŏ��O
            if (document.getElementById("sortscoredrop").checked) {
                cList.sort(function (a, b) {
                    let ascore = Number(a.getAttribute("data-score"));
                    let bscore = Number(b.getAttribute("data-score"));
                    if (ascore > bscore) return -1;
                    if (ascore < bscore) return 1;
                    return 0;
                });
            } else if (document.getElementById("sortscoreraise").checked) {
                cList.sort(function (a, b) {
                    let ascore = Number(a.getAttribute("data-score"));
                    let bscore = Number(b.getAttribute("data-score"));
                    if (ascore < bscore) return -1;
                    if (ascore > bscore) return 1;
                    return 0;
                });
            }
            let allList = Array.from(block).slice(0, 1).concat(cList);
            while (blockParent.firstChild) blockParent.removeChild(blockParent.firstChild);
            for (let i = 0; i < allList.length; i++) blockParent.appendChild(allList[i]);
        }
    }
}

function togglerateset() {
    let obj = document.getElementById("myratesetting");
    obj.style.display = document.getElementById("myrate").checked ? "block" : "none";
}

function appenderRate(border, color, check) {
    const block = document.getElementById("myrateSets");
    const appended = block.appendChild(document.createElement("div"));
    appended.className = "setblock";
    appended.innerHTML = `�X�R�A: <input type="number" value="${border}" class="scoreinput"> �F: <input type="color" class="colorinput" value="${color}"> <label><input class="strokeinput" type="checkbox"${check ? " checked" : ""}>�����</label> `;
    const deleteButton = appended.appendChild(document.createElement("button"));
    deleteButton.className = "innerset";
    deleteButton.innerText = "�폜����";
    const currentID = setblockID;
    appended.id = `setblock_${currentID}`;
    deleteButton.addEventListener("click", function () {
        deleteRate(currentID);
    });
    setblockID++;
}

function deleteRate(id) {
    document.getElementById(`setblock_${id}`).remove();
}

function saveColorset() {
    const colorsets = document.getElementById("myrateSets").children;
    let savingData = [];
    for (let i = 0; i < colorsets.length; i++) {
        let scoreset = Number(colorsets[i].getElementsByClassName("scoreinput")[0].value);
        let colorset = colorsets[i].getElementsByClassName("colorinput")[0].value;
        let strokeset = colorsets[i].getElementsByClassName("strokeinput")[0].checked;
        savingData.push({
            score: scoreset,
            color: colorset,
            stroke: strokeset,
            rank: ""
        });
    }

    localStorage.setItem("chunimyconst_colorset", JSON.stringify(savingData));
}

function loadColorset() {
    const rawsc = localStorage.getItem("chunimyconst_colorset");
    if (rawsc !== null) {
        const savedColor = JSON.parse(rawsc);
        for (let i = 0; i < savedColor.length; i++) appenderRate(savedColor[i].score, savedColor[i].color, savedColor[i].stroke);
    }
}

function saveSettings() {
    // �}�[�N���� [0]�����N [1]�A�`�[�u [2]�X�R�A
    localStorage.setItem("chunimyconst_markby", Array.from(document.getElementsByName("condition")).findIndex(c => c.checked));

    // �\�����e [0]�����N [1]�A�`�[�u [2]�X�R�A [3] �{�[�_�[
    localStorage.setItem("chunimyconst_dispby", Array.from(document.getElementsByName("display")).findIndex(c => c.checked));

    // �\������ [0]�����N [1]�A�`�[�u [2]�X�R�A
    localStorage.setItem("chunimyconst_dispcond", Array.from(document.getElementsByName("conditiondisp")).findIndex(c => c.checked));

    // �}�[�N����
    // �����N
    localStorage.setItem("chunimyconst_byrankval", document.getElementById("rankselect").value);
    localStorage.setItem("chunimyconst_byrankval_yn", document.getElementById("rank_doneornot").value);

    // �A�`�[�u
    localStorage.setItem("chunimyconst_byachieveval", document.getElementById("achieveselect").value);
    localStorage.setItem("chunimyconst_byachieveval_yn", document.getElementById("achieve_doneornot").value);

    // �X�R�A
    localStorage.setItem("chunimyconst_byscoreval", document.getElementById("scoreselect").value); // select�łȂ�txt
    localStorage.setItem("chunimyconst_byscoreval_yn", document.getElementById("score_doneornot").value);

    // �\������
    // �����N
    localStorage.setItem("chunimyconst_byrankval_disp", document.getElementById("rankdispselect").value);
    localStorage.setItem("chunimyconst_byrankval_disp_yn", document.getElementById("rankdisp_doneornot").value);

    // �A�`�[�u
    localStorage.setItem("chunimyconst_byachieveval_disp", document.getElementById("achieveselectdisp").value);
    localStorage.setItem("chunimyconst_byachieveval_disp_yn", document.getElementById("achievedisp_doneornot").value);

    // �X�R�A
    localStorage.setItem("chunimyconst_byscoreval_disp", document.getElementById("scoreselectdisp").value); // select�łȂ�txt
    localStorage.setItem("chunimyconst_byscoreval_disp_yn", document.getElementById("scoredisp_doneornot").value);

    // �\�[�g
    localStorage.setItem("chunimyconst_sortdefault", document.getElementById("sortdefault").checked);
    localStorage.setItem("chunimyconst_sortscoredrop", document.getElementById("sortscoredrop").checked);
    localStorage.setItem("chunimyconst_sortscoreraise", document.getElementById("sortscoreraise").checked);

    // ���̑�
    localStorage.setItem("chunimyconst_scorecut", document.getElementById("scorecut").checked);
    localStorage.setItem("chunimyconst_oneoti", document.getElementById("oneoti").checked);
    localStorage.setItem("chunimyconst_noplay", document.getElementById("noplay").checked);
    localStorage.setItem("chunimyconst_nomax", document.getElementById("nomax").checked);
    localStorage.setItem("chunimyconst_myrate", document.getElementById("myrate").checked);
    localStorage.setItem("chunimyconst_titledisp", document.getElementById("titledisp").checked);
    // localStorage.setItem("chunimyconst_marker_ajfc", document.getElementById("marker_ajfc").checked);
    localStorage.setItem("chunimyconst_marker_aj", document.getElementById("marker_aj").checked);
    localStorage.setItem("chunimyconst_marker_fc", document.getElementById("marker_fc").checked);
    localStorage.setItem("chunimyconst_copyrightmode", document.getElementById("copyrightmode").checked);
    localStorage.setItem("chunimyconst_conddispblock", document.getElementById("conddispblock").checked);

    // �\����Փx
    localStorage.setItem("chunimyconst_dispult", document.getElementById("dispult").checked);
    localStorage.setItem("chunimyconst_dispmas", document.getElementById("dispmas").checked);
    localStorage.setItem("chunimyconst_dispexp", document.getElementById("dispexp").checked);
    localStorage.setItem("chunimyconst_dispadv", document.getElementById("dispadv").checked);
    localStorage.setItem("chunimyconst_dispbas", document.getElementById("dispbas").checked);

    // �\���W������
    localStorage.setItem("chunimyconst_disp_popani", document.getElementById("disp_popani").checked);
    localStorage.setItem("chunimyconst_disp_niconico", document.getElementById("disp_niconico").checked);
    localStorage.setItem("chunimyconst_disp_touhou", document.getElementById("disp_touhou").checked);
    localStorage.setItem("chunimyconst_disp_variety", document.getElementById("disp_variety").checked);
    localStorage.setItem("chunimyconst_disp_irodori", document.getElementById("disp_irodori").checked);
    localStorage.setItem("chunimyconst_disp_gekimai", document.getElementById("disp_gekimai").checked);
    localStorage.setItem("chunimyconst_disp_original", document.getElementById("disp_original").checked);

    // �\�����x��
    localStorage.setItem("chunimyconst_lowerlevel", document.getElementById("lvrange_low").value);
    localStorage.setItem("chunimyconst_higherlevel", document.getElementById("lvrange_high").value);
}

function getCheckboxValue(key, defaultValue) {
    const value = localStorage.getItem(key);
    return value === null ? defaultValue : JSON.parse(value);
}

function setOptionsValue(selectElmID, key) {
    const element = document.getElementById(selectElmID).options;
    for (let i = 0; i < element.length; i++) {
        if (element[i].value === localStorage.getItem(key)) {
            element[i].selected = true;
            break;
        }
    }
}

function loadSettings() {
    // �}�[�N���� [0]�����N [1]�A�`�[�u [2]�X�R�A
    document.getElementsByName("condition")[Number(localStorage.getItem("chunimyconst_markby") || 0)].checked = true;
    setOptionsValue("rankselect", "chunimyconst_byrankval");
    setOptionsValue("rank_doneornot", "chunimyconst_byrankval_yn");
    setOptionsValue("achieveselect", "chunimyconst_byachieveval");
    setOptionsValue("achieve_doneornot", "chunimyconst_byachieveval_yn");
    document.getElementById("scoreselect").value = localStorage.getItem("chunimyconst_byscoreval") || "1009900";
    setOptionsValue("score_doneornot", "chunimyconst_byscoreval_yn");

    // �\������ [0]�����N [1]�A�`�[�u [2]�X�R�A
    document.getElementsByName("conditiondisp")[Number(localStorage.getItem("chunimyconst_dispcond") || 0)].checked = true;
    setOptionsValue("rankdispselect", "chunimyconst_byrankval_disp");
    setOptionsValue("rankdisp_doneornot", "chunimyconst_byrankval_disp_yn");
    setOptionsValue("achieveselectdisp", "chunimyconst_byachieveval_disp");
    setOptionsValue("achievedisp_doneornot", "chunimyconst_byachieveval_disp_yn")
    document.getElementById("scoreselectdisp").value = localStorage.getItem("chunimyconst_byscoreval_disp") || "1009900";
    setOptionsValue("scoredisp_doneornot", "chunimyconst_byscoreval_disp_yn");

    // �\�����e [0]�����N [1]�A�`�[�u [2]�X�R�A [3] �{�[�_�[
    document.getElementsByName("display")[Number(localStorage.getItem("chunimyconst_dispby") || 0)].checked = true;

    // �\�[�g�ݒ�
    document.getElementById("sortdefault").checked = getCheckboxValue("chunimyconst_sortdefault", true);
    document.getElementById("sortscoredrop").checked = getCheckboxValue("chunimyconst_sortscoredrop", false);
    document.getElementById("sortscoreraise").checked = getCheckboxValue("chunimyconst_sortscoreraise", false);


    // ���̑��ݒ�
    document.getElementById("scorecut").checked = getCheckboxValue("chunimyconst_scorecut", true);
    document.getElementById("oneoti").checked = getCheckboxValue("chunimyconst_oneoti", true);
    document.getElementById("nomax").checked = getCheckboxValue("chunimyconst_nomax", true);
    document.getElementById("noplay").checked = getCheckboxValue("chunimyconst_noplay", false);
    document.getElementById("titledisp").checked = getCheckboxValue("chunimyconst_titledisp", false);
    // document.getElementById("marker_ajfc").checked = getCheckboxValue("chunimyconst_marker_ajfc", true);
    document.getElementById("marker_aj").checked = getCheckboxValue("chunimyconst_marker_aj", true);
    document.getElementById("marker_fc").checked = getCheckboxValue("chunimyconst_marker_fc", true);
    document.getElementById("copyrightmode").checked = getCheckboxValue("chunimyconst_copyrightmode", false);
    document.getElementById("conddispblock").checked = getCheckboxValue("chunimyconst_conddispblock", false);
    document.getElementById("myrate").checked = getCheckboxValue("chunimyconst_myrate", false);

    // �\����Փx
    document.getElementById("dispult").checked = getCheckboxValue("chunimyconst_dispult", true);
    document.getElementById("dispmas").checked = getCheckboxValue("chunimyconst_dispmas", true);
    document.getElementById("dispexp").checked = getCheckboxValue("chunimyconst_dispexp", true);
    document.getElementById("dispadv").checked = getCheckboxValue("chunimyconst_dispadv", true);
    document.getElementById("dispbas").checked = getCheckboxValue("chunimyconst_dispbas", true);

    // �\�����x��
    setOptionsValue("lvrange_low", "chunimyconst_lowerlevel");
    setOptionsValue("lvrange_high", "chunimyconst_higherlevel");

    // �\���W������
    document.getElementById("disp_popani").checked = getCheckboxValue("chunimyconst_disp_popani", true);
    document.getElementById("disp_niconico").checked = getCheckboxValue("chunimyconst_disp_niconico", true);
    document.getElementById("disp_touhou").checked = getCheckboxValue("chunimyconst_disp_touhou", true);
    document.getElementById("disp_variety").checked = getCheckboxValue("chunimyconst_disp_variety", true);
    document.getElementById("disp_irodori").checked = getCheckboxValue("chunimyconst_disp_irodori", true);
    document.getElementById("disp_gekimai").checked = getCheckboxValue("chunimyconst_disp_gekimai", true);
    document.getElementById("disp_original").checked = getCheckboxValue("chunimyconst_disp_original", true);
}
