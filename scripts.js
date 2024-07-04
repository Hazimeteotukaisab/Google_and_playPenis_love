function sendAuthCode() {
    // メールアドレスとパスワードを取得
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 実際にはバックエンドにリクエストを送信してメールを送る処理が必要
    console.log(`Sending auth code to ${email}`);

    // ログインフォームを隠して認証フォームを表示
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('auth-form').style.display = 'block';
}

function verifyAuthCode() {
    const authCode = document.getElementById('auth-code').value;

    // ここでは固定の認証コードを使用
    const expectedAuthCode = '1234';

    if (authCode === expectedAuthCode) {
        window.location.href = 'https://www.google.com';
    } else {
        alert('認証コードが間違っています。もう一度お試しください。');
    }
}
