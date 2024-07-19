const apiUrl = "https://api.chunirec.net/2.0/records/profile.json"

const userList = document.getElementById(user_name);
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
}