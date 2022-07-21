import axios from 'axios';
import { exit, stdout } from 'process';

const TIMEOUT = 750;

const COUNT = new Uint8Array(new SharedArrayBuffer(1024));

async function sendBadUsername() {
    Atomics.add(COUNT, 0, 1);
    const username = 'admin';
    const password = 'very.bad.guy';

    try {
        let response = await axios.post('https://api.sandbox.withreach.com/v1/session', {}, {
            auth: { username, password },
            timeout: TIMEOUT,
        });
        console.log(response);
    } catch (error) {
        if (error.response && error.response.status == 401) {
            stdout.write('.');
        } else if (error.code == 'ECONNABORTED') {
            stdout.write('-');
        } else {
            console.error('error', error);
            exit(1);
        }
    }
}

for (let i = 0; i < 30; i++)
    setInterval(() => sendBadUsername(), TIMEOUT);


const RUN = 5 * 60 * 1000;
setTimeout(() => {
    console.log(Atomics.load(COUNT, 0));
    exit();
}, RUN);
