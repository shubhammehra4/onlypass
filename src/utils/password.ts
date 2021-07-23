import argon2 from "argon2";
import chalk from "chalk";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { prompt } from "inquirer";
import { newUserPrompt, startPrompt } from "./prompt";
import { sleep } from "./helpers";
import crypto from "crypto";
const log = console.log;

async function createMasterPassword() {
    newUserPrompt();
    const { master } = await prompt({
        type: "password",
        name: "master",
        message: chalk.underline.bold("Create Master Password"),
        mask: "",
    });
    const masterPassword = await argon2.hash(master, {
        hashLength: 60,
        timeCost: 12,
    });
    writeFileSync("master.txt", masterPassword);
    log(chalk.green.bold("✔ Master Password Created"));
    await sleep(1500);
}

export async function masterPassword() {
    const masterExists = existsSync("master.txt");
    if (!masterExists) {
        await createMasterPassword();
        startPrompt();
    }
    const { master } = await prompt({
        type: "password",
        name: "master",
        message: "Enter Master Password",
        mask: "",
    });
    const masterPassword = readFileSync("master.txt");
    const done = await argon2.verify(masterPassword.toString(), master);
    if (!done) {
        log(chalk.red.bold("Wrong Master Password!!"));
        process.exit(1);
    }

    return master as string;
}

export function generatePassword(length = 18) {
    var wishlist =
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*-_";
    return Array.from(crypto.randomFillSync(new Uint32Array(length)))
        .map((x) => wishlist[x % wishlist.length])
        .join("");
}
