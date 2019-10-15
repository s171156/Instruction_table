var g_command = [];       // 入力したコマンド
var g_maxData = 4;        // データ数
var g_invalidCommand = 0; // 無効なコマンド
var g_useBGC = "#0f0";    // 使用する背景色
var g_whiteBGC = "#fff";  // 白色の背景色

// 色の設定
var setColor = function (idx, colorStr) {
    document.getElementById("cell" + idx).style.backgroundColor = colorStr;
}

// 初期化
var initData = function () {

    for (var i = 0; i <= g_maxData; i++) {
        document.getElementById("input" + i).innerHTML = "";
        document.getElementById("output" + i).innerHTML = "";
        setColor(i, g_whiteBGC);
        g_command[i] = g_invalidCommand;
    }
    setColor(0, g_useBGC);
    document.getElementsByName("data")[0].checked = true;
};

// ロード時
window.onload = function () {
    initData();
};

// 選択されているラジオボタンを取得
var getSelectedRadio = function () {
    //ラジオボタンオブジェクトを取得する
    var radios = document.getElementsByName("data");
    var idx;

    for (var i = 0, len = radios.length; i < len; i++) {
        if (radios[i].checked) {
            idx = i;
            break;
        }
    }

    return idx;
};

// 命令をクリックしたときの動作
var deleteNum = function (idx) {
    for (var i = 0; i < g_maxData; i++) {
        setColor(i, g_whiteBGC);
    }
    document.getElementById("input" + idx).innerHTML = "";
    document.getElementsByName("data")[idx].checked = true;
    setColor(idx, g_useBGC);
};
// オプションをクリックしたときの動作
var deleteOpt = function (idx) {
    document.getElementById("input" + idx).innerHTML = "";
    setColor(idx, g_whiteBGC);
};

// 値の設定
var setValue = function (val) {
    var idx;

    // 図形の場合
    if (val < 8) {
        idx = getSelectedRadio();
        setColor(idx, g_whiteBGC);
        document.getElementsByName("data")[idx].checked = false;
        if (idx + 1 < g_maxData) {
            setColor(idx + 1, g_useBGC);
            document.getElementsByName("data")[idx + 1].checked = true;
        }
    }
    // オプションの場合
    else {
        idx = g_maxData;
        g_command[g_maxData] = val;
        setColor(idx, "#f8f");
    }
    document.getElementById("input" + idx).innerHTML = val;
};

// 実行
var execute = function () {
    // データの設定
    var invalidData = 0; // 無効なデータ
    var dataList = [];   // 出力するデータ
    var idxList = [];    // 出力する順番
    // データの初期化
    for (var i = 0; i < g_maxData; i++) {
        g_command[i] = parseInt(document.getElementById("input" + i).innerHTML);
        dataList[i] = i + 1;
        idxList[i] = i;
    }
    g_command[g_maxData] = parseInt(document.getElementById("input" + g_maxData).innerHTML);
    // 最終的な表示順序を決める
    if (g_command[g_maxData] !== g_invalidCommand) {
        switch (g_command[g_maxData]) {
            case 8:
                idxList[0] = 3;
                idxList[1] = 2;
                idxList[2] = 1;
                idxList[3] = 0;
                break;

            case 9:
                idxList[0] = 2;
                idxList[1] = 3;
                idxList[2] = 0;
                idxList[3] = 1;
                break;

            case 10:
                idxList[0] = 1;
                idxList[1] = 0;
                idxList[2] = 3;
                idxList[3] = 2;
                break;

            default:
                break;
        }
    }

    // ========================
    // 命令を消すコマンドの探索
    // ========================
    var deletePrevCommand = 6; // 前の命令を消す
    var deleteNextCommand = 7; // 次の命令を消す

    // 前の命令を消すコマンドがあるかどうか探索する（下から探索する）
    for (var i = g_maxData - 1; i >= 0; i--) {
        // 前の命令を消すコマンドの場合
        if (deletePrevCommand === g_command[i]) {
            if (i > 0) {
                g_command[i - 1] = g_invalidCommand;
            }
            g_command[i] = g_invalidCommand;
        }
    }
    // 次の命令を消すコマンドがあるかどうか探索する（上から探索する）
    for (var i = 0; i < g_maxData; i++) {
        // 次の命令を消すコマンドの場合
        if (deleteNextCommand === g_command[i]) {
            if (i + 1 < g_maxData) {
                g_command[i + 1] = g_invalidCommand;
            }
            g_command[i] = g_invalidCommand;
        }
    }

    // ==========
    // 図形の操作
    // ==========
    var deletePrevFigure = 3; // 前の図形を消す
    var deleteNextFigure = 4; // 次の図形を消す
    var changePrevFigure = 5; // 前の図形と交換する
    for (var i = 0; i < g_maxData; i++) {
        // 前の図形を消すコマンドの場合
        if (g_command[i] === deletePrevFigure) {
            if (i > 0) {
                dataList[i - 1] = invalidData;
            }
            g_command[i] = g_invalidCommand;
        }
        // 次の図形を消すコマンドの場合
        else if (g_command[i] === deleteNextFigure) {
            if (i + 1 < g_maxData) {
                dataList[i + 1] = invalidData;
            }
            g_command[i] = g_invalidCommand;
        }
        // 前の図形と交換するコマンドの場合
        else if (g_command[i] === changePrevFigure) {
            if (i > 0) {
                var tmp = dataList[i - 1];
                dataList[i - 1] = dataList[i];
                dataList[i] = tmp;
                g_command[i] = g_command[i - 1];
                g_command[i - 1] = g_invalidCommand;
            }
            else {
                g_command[i] = g_invalidCommand;
            }
        }
        // 上記以外の場合
        else {
            // 何もしない
            ;
        }
    }

    // ========================
    // 上下反転・左右反転の処理
    // ========================
    var changeUpperLower = 1; // 上下反転のコマンド
    var changeLeftRight = 2;  // 左右反転のコマンド
    for (var i = 0; i < g_maxData; i++) {
        // 図形が無い場合
        if (dataList[i] === invalidData) {
            dataList[i] = "";
        }
        // 図形がある場合
        else {
            // 上下反転のコマンドの場合
            if (g_command[i] === changeUpperLower) {
                dataList[i] += " 上下";
            }
            // 左右反転のコマンドの場合
            else if (g_command[i] === changeLeftRight) {
                dataList[i] += " 左右";
            }
            // 上記以外の場合
            else {
                // 何もしない
                ;
            }
        }
    }

    // 出力
    for (var i = 0; i < g_maxData; i++) {
        document.getElementById("output" + i).innerHTML = "<font color='#f00'>" + dataList[idxList[i]] + "</font>";
    }
};