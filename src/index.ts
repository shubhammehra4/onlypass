import storage from "node-persist";
import { decrypt, sleep } from "./utils/helpers";
import { optionsPrompt } from "./utils/option";
import { masterPassword } from "./utils/password";
import { startPrompt } from "./utils/prompt";

export interface Password {
    id: number;
    field: string;
    username: string;
    password: string;
}

async function main() {
    startPrompt();
    await storage.init({ dir: "data/", logging: true });
    // await storage.clear();
    const master = await masterPassword();
    var encryptedPasswords: string[] = await storage.values();

    let passwords: Password[] = encryptedPasswords.map((p, i) => {
        let { field, username, password } = JSON.parse(p);
        let decryptedPassword = decrypt(password, master);
        return {
            id: i,
            field,
            username,
            password: decryptedPassword,
        };
    });

    await sleep(2000);
    while (true) {
        passwords = await optionsPrompt(master, passwords);
    }
}

main();
