// script.js

// APIのエンドポイント
const apiUrl = 'https://script.google.com/macros/s/AKfycbyaoqUVgkQSqDAkyp4VmEPQVK4EKq7jZ3UMprvt3Hzwo1fl7qx_j8fhhy5ReWtspVnl/exec';

// ユーザーリストを表示する要素
const userList = document.getElementById('songtitle');

// Fetch APIを使用してデータを取得
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTPエラー！ステータスコード: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // データを取得して表示
        userList.innerHTML = ''; // ローディングメッセージを削除
        data.forEach(user => {
            const listItem = document.createElement('li1');
            listItem.innerHTML = `曲名: ${user.title} <br> PEAK: ${user.peak}│ NOTES: ${user.noets}│FRICK: ${user.frick}│ RHYTHM: ${user.rhythm}│POWER: ${user.power}│SOF-LAN: ${user.soflan} <br>`;
            userList.appendChild(listItem);
        });
    })
    .catch(error => {
        // エラーハンドリング
        console.error('データの取得中にエラーが発生しました:', error);
        userList.innerHTML = 'データの取得中にエラーが発生しました。';
    });