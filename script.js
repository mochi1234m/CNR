// script.js

// API�̃G���h�|�C���g
const apiUrl = 'https://script.google.com/macros/s/AKfycbyaoqUVgkQSqDAkyp4VmEPQVK4EKq7jZ3UMprvt3Hzwo1fl7qx_j8fhhy5ReWtspVnl/exec';

// ���[�U�[���X�g��\������v�f
const userList = document.getElementById('songtitle');

// Fetch API���g�p���ăf�[�^���擾
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP�G���[�I�X�e�[�^�X�R�[�h: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // �f�[�^���擾���ĕ\��
        userList.innerHTML = ''; // ���[�f�B���O���b�Z�[�W���폜
        data.forEach(user => {
            const listItem = document.createElement('li1');
            listItem.innerHTML = `�Ȗ�: ${user.title} <br> PEAK: ${user.peak}�� NOTES: ${user.noets}��FRICK: ${user.frick}�� RHYTHM: ${user.rhythm}��POWER: ${user.power}��SOF-LAN: ${user.soflan} <br>`;
            userList.appendChild(listItem);
        });
    })
    .catch(error => {
        // �G���[�n���h�����O
        console.error('�f�[�^�̎擾���ɃG���[���������܂���:', error);
        userList.innerHTML = '�f�[�^�̎擾���ɃG���[���������܂����B';
    });