import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const algorithm = "aes-256-ctr";
const IV_LENGTH = 16;
const KEY_LENGTH = 32;
const KEY_PAD = "master";

export function encrypt(text: string, master: string) {
    let iv = randomBytes(IV_LENGTH);
    let cipher = createCipheriv(
        algorithm,
        master.padEnd(KEY_LENGTH, KEY_PAD),
        iv
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string, master: string) {
    let [textiv, textdata] = text.split(":");
    let iv = Buffer.from(textiv, "hex");
    let encryptedText = Buffer.from(textdata, "hex");
    let decipher = createDecipheriv(
        algorithm,
        master.padEnd(KEY_LENGTH, KEY_PAD),
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
